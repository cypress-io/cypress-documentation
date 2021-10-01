// Requires https://github.com/remarkjs/remark-directive
// Also see https://talk.commonmark.org/t/generic-directives-plugins-syntax/444

const path = require('path')
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

const _require = (baseDir, filePath) => {
  const fullPath = path.join(baseDir, filePath)

  if (isDev) {
    delete require.cache[require.resolve(fullPath)]
  }

  return require(fullPath)
}

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
  const { type, name, processNode } = _require(__dirname, filePath)

  if (!directivesByType[type]) {
    directivesByType[type] = {}
  }

  if (!directivesByType[type][name]) {
    logger.success('Loaded directive', getDisplay(type, name))
  }

  directivesByType[type][name] = processNode
}

loadDirectives()
const filePathSeen = {}

module.exports = function directiveAttacher() {
  return function transform(tree, file) {
    // This value comes from the content:file:beforeInsert hook in nuxt.config.js
    const filePath = file.data.path || '(unknown)'

    // Ensure directives aren't reloaded in dev mode until files have been
    // processed at least once, to reduce startup time.
    if (!filePathSeen[filePath]) {
      filePathSeen[filePath] = true
    } else if (isDev) {
      loadDirectives()
    }

    function processNode(node, index, parent) {
      const { type, name } = node

      const fn = (directivesByType[type] || {})[name]

      if (fn) {
        const prefix = `[${getDisplay(type, name)}]`
        const error = (...args) => {
          logger.error(prefix, ...args, `\n\nFile being parsed: ${filePath}`)
        }
        const warn = (...args) => {
          logger.warn(prefix, ...args)
        }

        let result = { children: [] }

        try {
          result = fn(node, { _require, index, parent, processor, error, warn })
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
