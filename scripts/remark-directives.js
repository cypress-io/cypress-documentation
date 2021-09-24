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

function addDirectives() {
  addDirective('./directives/include')
  addDirective('./directives/cypress-config-example')
}

const directivesByType = {}

// This allows updating a directive file while developing in "yarn start"
// without needing to restart the server. Note that after the directive
// file is saved, the page you're viewing will also need to be re-saved
// to force Nuxt to update its cache.
function addDirective(filePath) {
  if (isDev) {
    delete require.cache[require.resolve(filePath)]
  }

  const { type, name, processNode } = require(filePath)

  if (!directivesByType[type]) {
    directivesByType[type] = {}
  }

  directivesByType[type][name] = processNode
}

if (!isDev) {
  addDirectives()
}

module.exports = function directiveAttacher() {
  /* eslint-disable no-console */
  return function transform(tree, file) {
    if (isDev) {
      addDirectives()
    }

    function processNode(node, index, parent) {
      const { type, name } = node

      const fn = (directivesByType[type] || {})[name]

      if (fn) {
        const prefix = `[${name} directive]`
        const error = (...args) => {
          console.error(prefix, ...args)
        }
        const warn = (...args) => {
          console.warn(prefix, ...args)
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
