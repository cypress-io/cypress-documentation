/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkDirective = require('remark-directive')
const remarkRehype = require('remark-rehype')
const directives = require('./remark-directives')

jest.mock('fs')

const CONTENT_PATH = path.join(__dirname, '../content')

const processText = async (text) => {
  const rehypeStringify = (await import('rehype-stringify')).default

  return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(directives)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(text)
    .then((file) => {
      return file.contents
    })
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(console, 'error')
  jest.spyOn(console, 'warn')
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

    expect(console.error).toHaveBeenCalledWith(
      '[include directive]',
      expect.stringMatching(/"file" attribute/)
    )

    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })

  it('should error and remove directive if file attribute refers to missing file', async () => {
    fs.readFileSync.mockImplementation(jest.requireActual('fs').readFileSync)
    const result = await processText('# aaa\n::include{file=invalid}\n## bbb')

    expect(console.error).toHaveBeenCalledWith(
      '[include directive]',
      expect.stringMatching(/Failed to read file: invalid/),
      expect.objectContaining(
        new Error(
          `ENOENT: no such file or directory, open '${CONTENT_PATH}/invalid'`
        )
      )
    )

    expect(console.error).toHaveBeenCalled()
    expect(result).toBe('<h1>aaa</h1>\n<h2>bbb</h2>')
  })
})
