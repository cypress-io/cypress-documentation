const fs = require('fs')
const sidebarJSON = require('../content/_data/sidebar.json')
const keys = Object.keys(sidebarJSON)
let yamlArray = []

/**
 * Indents the given string
 * @param {string} str  The string to be indented.
 * @param {number} numOfIndents  The amount of indentations to place at the
 *     beginning of each line of the string.
 * @param {number=} opt_spacesPerIndent  Optional.  If specified, this should be
 *     the number of spaces to be used for each tab that would ordinarily be
 *     used to indent the text.  These amount of spaces will also be used to
 *     replace any tab characters that already exist within the string.
 * @return {string}  The new string with each line beginning with the desired
 *     amount of indentation.
 */
function indent(str, numOfIndents, opt_spacesPerIndent) {
  str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'))
  numOfIndents = new Array(opt_spacesPerIndent + 1 || 0).join(' ') // re-use

  return opt_spacesPerIndent
    ? str.replace(/^\t+/g, function (tabs) {
        return tabs.replace(/./g, numOfIndents)
      })
    : str
}

keys.map((key) => {
  sidebarJSON[key].map((item) => {
    if (item.slug === 'plugins') {
      // console.log('plugins:')
      yamlArray.push('plugins:')
      // console.log(indent('plugins: index.html', 1, 2))
      yamlArray.push(indent('plugins: index.html', 1, 2))
    } else {
      // console.log(`${item.slug}:`)
      yamlArray.push(`${item.slug}:`)
    }

    if (item.children) {
      item.children.map((child) => {
        // console.log(indent(`${child.slug}:`, 1, 2))
        yamlArray.push(indent(`${child.slug}:`, 1, 2))

        child.children.map((grandChild) => {
          // console.log(
          //   indent(`${grandChild.slug}: ${grandChild.slug}.html`, 1, 4)
          // )
          yamlArray.push(
            indent(`${grandChild.slug}: ${grandChild.slug}.html`, 1, 4)
          )
        })
      })
    }
  })
})

try {
  fs.writeFileSync('public/manifest.yml', yamlArray.join('\n'))
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err)
}
