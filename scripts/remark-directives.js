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

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(squeezeParagraphs)
  .use(slug)
  .use(externalLinks)
  .use(autolinkHeadings)
  .use(remarkFootnotes)
  .use(gfm)

const directivesByType = {}

addDirective(require('./directives/include'))
addDirective(require('./directives/cypress-config-example'))

function addDirective({ type, name, processNode }) {
  if (!directivesByType[type]) {
    directivesByType[type] = {}
  }

  directivesByType[type][name] = processNode
}

module.exports = function directiveAttacher() {
  /* eslint-disable no-console */
  return function transform(tree, file) {
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
