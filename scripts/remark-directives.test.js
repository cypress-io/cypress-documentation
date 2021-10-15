const fs = require('fs')
const path = require('path')
const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkDirective = require('remark-directive')
const squeezeParagraphs = require('remark-squeeze-paragraphs')
const externalLinks = require('remark-external-links')
const remarkFootnotes = require('remark-footnotes')
const gfm = require('remark-gfm')
const remarkRehype = require('remark-rehype')
const rehypeRaw = require('rehype-raw')
const rehypeStringify = require('rehype-stringify')
const handlersFn = require('@nuxt/content/parsers/markdown/handlers')
const endent = require('endent').default

const directives = require('./remark-directives')
const fixtures = require('./remark-directives.fixtures')
const { logger } = directives

jest.mock('fs')
jest.mock('consola', () => {
  const consola = jest.requireActual('consola')

  consola.pauseLogs()

  return consola
})

const CONTENT_PATH = path.join(__dirname, '../content')

// Reproduce as much of the nuxt-content markdown processing pipeline as
// possible, minus anything that would unnecessarily bloat the output like
// remark-slug or remark-autolink-headings.
//
// See:
// - this project's nuxt.config.js
// - https://github.com/nuxt/content/blob/main/packages/content/lib/utils.js
// - https://github.com/nuxt/content/blob/main/packages/content/parsers/markdown/index.js
const processText = (text) => {
  const handlers = handlersFn()

  // Don't use the nuxt-content code formatting
  delete handlers.code

  return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(directives)
    .use(squeezeParagraphs)
    .use(externalLinks)
    .use(remarkFootnotes)
    .use(gfm)
    .use(remarkRehype, { handlers, allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { collapseEmptyAttributes: true })
    .process(text)
    .then((file) => {
      return file.contents
    })
}

beforeEach(() => {
  logger.mockTypes(() => jest.fn())
})

describe('::include', () => {
  it('should attempt to include files relative to the content directory', async () => {
    await processText('::include{file=example}')
    expect(fs.readFileSync).toHaveBeenCalledWith(
      `${CONTENT_PATH}/example`,
      expect.anything()
    )

    await processText('::include{file=/path/to/example}')
    expect(fs.readFileSync).toHaveBeenCalledWith(
      `${CONTENT_PATH}/path/to/example`,
      expect.anything()
    )
  })

  it('should replace directive with markdown parsed file contents', async () => {
    fs.readFileSync.mockReturnValue('### ccc\n#### ddd')
    const result = await processText('# aaa\n::include{file=content}\n## bbb')

    expect(result).toBe(
      `<h1>aaa</h1>\n<h3>ccc</h3>\n<h4>ddd</h4>\n<h2>bbb</h2>`
    )
  })

  it('should log an error and remove directive if file attribute is omitted', async () => {
    const result = await processText('# aaa\n::include\n## bbb')

    expect(logger.error).toHaveBeenCalledWith(
      '[::include]',
      expect.stringMatching(/"file" attribute/),
      expect.anything()
    )

    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })

  it('should error and remove directive if file attribute refers to missing file', async () => {
    fs.readFileSync.mockImplementation(jest.requireActual('fs').readFileSync)
    const result = await processText('# aaa\n::include{file=invalid}\n## bbb')

    expect(logger.error).toHaveBeenCalledWith(
      '[::include]',
      expect.stringMatching(/Failed to read file: invalid/),
      expect.objectContaining(
        new Error(
          `ENOENT: no such file or directory, open '${CONTENT_PATH}/invalid'`
        )
      ),
      expect.anything()
    )

    expect(logger.error).toHaveBeenCalled()
    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })
})

describe(':::cypress-config-example', () => {
  const cceFixtures = fixtures['cypress-config-example']

  it('should render js config object in 3 tabs', async () => {
    const text = endent`
    # aaa
    :::cypress-config-example

    \`\`\`js
    {
      foo: 123,
      prop: {
        bar: true
      }
    }
    \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cceFixtures.codeBlock)
  })

  it('should render js config object with header in 2 tabs', async () => {
    const text = endent`
    # aaa
    :::cypress-config-example

    \`\`\`js
    const { foo } = require('foo')
    \`\`\`

    \`\`\`js
    {
      foo: 123,
      prop: {
        bar: true
      }
    }
    \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cceFixtures.codeBlockWithHeader)
  })

  it('should render js object with functions in 2 tabs', async () => {
    const text = endent`
    # aaa
    :::cypress-config-example

    \`\`\`js
    {
      foo: 123,
      prop: {
        bar() {
          // code
        }
      }
    }
    \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(logger.warn).toHaveBeenCalledWith(
      '[:::cypress-config-example]',
      expect.stringMatching(/skipping cypress.json tab/)
    )

    expect(result).toBe(cceFixtures.codeBlockWithFunction)
  })

  it('should render js object in 2 tabs when noJson is specified', async () => {
    const text = endent`
    # aaa
    :::cypress-config-example{noJson}

    \`\`\`js
    {
      foo: 123,
      prop: {
        bar: true
      }
    }
    \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(logger.warn).not.toHaveBeenCalled()

    expect(result).toBe(cceFixtures.codeBlockWithNoJson)
  })

  it('should log an error and remove directive if code blocks are omitted', async () => {
    const text = endent`
    # aaa
    :::cypress-config-example
    :::
    ## bbb
    `
    const result = await processText(text)

    expect(logger.error).toHaveBeenCalledWith(
      '[:::cypress-config-example]',
      expect.stringMatching(/Expected 1 or 2 code blocks inside directive, instead got/),
      [],
      expect.anything()
    )

    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })

  it('should log an error and remove directive if code cannot be parsed', async () => {
    const text = endent`
    # aaa
    :::cypress-config-example

    \`\`\`js
    xyz
    \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(logger.error).toHaveBeenCalledWith(
      '[:::cypress-config-example]',
      expect.stringMatching(/Unable to parse code/),
      expect.objectContaining(
        new Error('ReferenceError: xyz is not defined')
      ),
      expect.anything()
    )

    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })
})

describe(':::cypress-plugin-example', () => {
  const cpeFixtures = fixtures['cypress-plugin-example']

  it('should render function body in all 3 tabs', async () => {
    const text = endent`
    # aaa
    :::cypress-plugin-example

    \`\`\`js
    on('something', () => {
      someThing(config)
    })
      \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cpeFixtures.functionBody)
  })

  it('should use component object if specified', async () => {
    const text = endent`
    # aaa
    :::cypress-plugin-example{configProp=component}

    \`\`\`js
    on('something', () => {
      someThing(config)
    })
      \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cpeFixtures.functionBodyComponent)
  })

  it('should omit comment if specified', async () => {
    const text = endent`
    # aaa
    :::cypress-plugin-example{noComment}

    \`\`\`js
    on('something', () => {
      someThing(config)
    })
      \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cpeFixtures.functionBodyNoComment)
  })

  it('should render header and body in all 3 tabs', async () => {
    const text = endent`
    # aaa
    :::cypress-plugin-example

    \`\`\`js
    const { foo } = require('foo')
    \`\`\`

    \`\`\`js
    on('something', () => {
      foo(config)
    })
      \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cpeFixtures.functionBodyAndHeader)
  })

  it('should adjust header and body content in plugins file tab', async () => {
    const text = endent`
    # aaa
    :::cypress-plugin-example

    \`\`\`js
    const { foo } = require('./foo')
    \`\`\`

    \`\`\`js
    on('something', () => {
      require('./bar')(foo, config)
    })
  \`\`\`

    :::
    ## bbb
    `
    const result = await processText(text)

    expect(result).toBe(cpeFixtures.functionBodyAndHeaderAdjustedForPluginsFile)
  })

  it('should log an error and remove directive if code blocks are omitted', async () => {
    const text = endent`
    # aaa
    :::cypress-plugin-example
    :::
    ## bbb
    `
    const result = await processText(text)

    expect(logger.error).toHaveBeenCalledWith(
      '[:::cypress-plugin-example]',
      expect.stringMatching(/Expected 1 or 2 code blocks inside directive, instead got/),
      [],
      expect.anything()
    )

    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })

})