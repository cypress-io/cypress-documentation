const fs = require('fs')
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

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(squeezeParagraphs)
  .use(slug)
  .use(externalLinks)
  .use(autolinkHeadings)
  .use(remarkFootnotes)
  .use(gfm)

const INCLUDE_DIRECTIVE_NAME = 'include'

module.exports = function remarkPartialPlugin() {
  return transform

  function transform(tree) {
    visit(tree, ['leafDirective'], onDirective)
  }

  function onDirective(node, index, parent) {
    const { name, attributes } = node

    if (name !== INCLUDE_DIRECTIVE_NAME) {
      return
    }

    const { file } = attributes

    if (!file) {
      return
    }

    const snippet = readFile(file)
    const result = processor.parse(snippet)

    parent.children.splice(index, 1, ...result.children)
  }
}

function readFile(filepath) {
  if (!filepath) {
    return
  }

  try {
    return fs.readFileSync(path.join(__dirname, '../content/', filepath), {
      encoding: 'utf8',
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Failed to read file: ${filepath}`,
      error,
      'This error is due to a problem with templating. Check your markdown files for the "::include{file=PATH_TO_FILE}" directive and make sure that PATH_TO_FILE exists. If this issue persists, please open a new issue with steps to reproduce.'
    )
  }
}
