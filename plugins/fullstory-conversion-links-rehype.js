// Labels conversion links in Markdown content at build time, so the labels
// are in the server-rendered HTML and on every client render without
// depending on when anything mounts. See fullstory-conversion-links.js.

const {
  SURFACES,
  conversionLinkAttributes,
} = require('./fullstory-conversion-links')

/** "data-fs-element" → "dataFsElement", the hast property name. */
function hastProperty(attribute) {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function labelElement(node) {
  const properties = node.properties || (node.properties = {})
  if (properties.dataFsElement !== undefined) return
  const href = typeof properties.href === 'string' ? properties.href : ''
  Object.entries(conversionLinkAttributes(href, SURFACES.content)).forEach(
    ([name, value]) => {
      properties[hastProperty(name)] = value
    }
  )
}

// An <a> written as JSX in an .mdx file. Only a literal href can be classified.
function labelJsxElement(node) {
  const attributes = node.attributes || (node.attributes = [])
  const named = (name) =>
    attributes.find(
      (attribute) =>
        attribute.type === 'mdxJsxAttribute' && attribute.name === name
    )
  if (named('data-fs-element')) return
  const href = named('href')
  if (!href || typeof href.value !== 'string') return
  Object.entries(
    conversionLinkAttributes(href.value, SURFACES.content)
  ).forEach(([name, value]) => {
    attributes.push({ type: 'mdxJsxAttribute', name, value })
  })
}

function visit(node) {
  if (node.type === 'element' && node.tagName === 'a') labelElement(node)
  if (
    (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') &&
    node.name === 'a'
  ) {
    labelJsxElement(node)
  }
  if (node.children) node.children.forEach(visit)
}

module.exports = function rehypeFullStoryConversionLinks() {
  return (tree) => visit(tree)
}
