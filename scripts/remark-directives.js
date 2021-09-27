// Requires https://github.com/remarkjs/remark-directive
// Also see https://talk.commonmark.org/t/generic-directives-plugins-syntax/444

const unified = require('unified')
const visit = require('unist-util-visit')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const squeezeParagraphs = require('remark-squeeze-paragraphs')
const slug = require('remark-slug')
const autolinkHeadings = require('remark-autolink-headings')
const externalLinks = require('remark-external-links')
const remarkFootnotes = require('remark-footnotes')
const gfm = require('remark-gfm')
const logger = require('consola').withTag('remark-directives')

const isDev = process.env.NODE_ENV === 'development'

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(squeezeParagraphs)
  .use(slug)
  .use(externalLinks)
  .use(autolinkHeadings)
  .use(remarkFootnotes)
  .use(gfm)

const getDisplay = (type, name) => {
  const prefix = {
    textDirective: ':',
    leafDirective: '::',
    containerDirective: ':::',
  }

  return `${prefix[type]}${name}`
}

// All directives should be specified here
function loadDirectives() {
  loadDirective('./directives/include')
  loadDirective('./directives/cypress-config-example')
  loadDirective('./directives/cypress-plugin-example')
}

const directivesByType = {}

// This allows updating a directive file while developing in "yarn start"
// without needing to restart the server. Note that after the directive
// file is saved, the page you're viewing will also need to be re-saved
// to force Nuxt to update its cache.
function loadDirective(filePath) {
  if (isDev) {
    delete require.cache[require.resolve(filePath)]
  }

  const { type, name, processNode } = require(filePath)

  if (!directivesByType[type]) {
    directivesByType[type] = {}
  }

  logger.success(
    directivesByType[type][name] ? 'Reloaded directive' : 'Loaded directive',
    getDisplay(type, name)
  )

  directivesByType[type][name] = processNode
}

loadDirectives()
const fileCache = {}

module.exports = function directiveAttacher() {
  return function transform(tree, file) {
    // Ensure directives aren't reloaded in dev mode until files have been
    // processed at least once, to reduce startup time and console spam.
    // If you don't see a directive update, try reloading the .md file.
    if (!fileCache[file]) {
      fileCache[file] = true
    } else if (isDev) {
      loadDirectives()
    }

    function processNode(node, index, parent) {
      const { type, name } = node

      const fn = (directivesByType[type] || {})[name]

      if (fn) {
        const prefix = `[${getDisplay(type, name)}]`
        const error = (...args) => {
          logger.error(prefix, ...args)
        }
        const warn = (...args) => {
          logger.warn(prefix, ...args)
        }

        let result = { children: [] }

        try {
          result = fn(node, { index, parent, processor, error, warn })
        } catch (err) {
          return error(err)
        }

        const parsed = processor.parse(result)

        parent.children.splice(index, 1, ...parsed.children)
      }
    }
    visit(tree, processNode)
  }
}

// For testing
module.exports.logger = logger
