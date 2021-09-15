const fs = require('fs')
const path = require('path')

function processNode(node, { error }) {
  const { attributes } = node
  const { file } = attributes

  if (!file) {
    return error(
      `Found a "::include" directive without a "file" attribute. You might have intended to import a partial into a markdown file, but no partial can be found without the "file" attribute. The "::include" directive should look like "::include{file=path/to/file}".`
    )
  }

  try {
    const absPath = path.join(__dirname, '../../content/', file)

    return fs.readFileSync(absPath, { encoding: 'utf8' })
  } catch (err) {
    return error(
      `Failed to read file: ${file}. This error is due to a problem with partials. Check your markdown files for the "::include{file=PATH_TO_FILE}" directive and make sure that PATH_TO_FILE exists. If this issue persists, please open a new issue with steps to reproduce.`,
      err
    )
  }
}

module.exports = {
  type: 'leafDirective',
  name: 'include',
  processNode,
}
