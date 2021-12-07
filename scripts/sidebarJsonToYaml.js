const fs = require('fs')
const yaml = require('js-yaml')
const { indent } = require('../utils/indentString')
const sidebarJSON = require('../content/_data/sidebar.json')
const keys = Object.keys(sidebarJSON)
let yamlArray = []

keys.map((key) => {
  sidebarJSON[key].map((item) => {
    if (item.slug === 'plugins') {
      yamlArray.push('plugins:')
      yamlArray.push(indent('plugins: index.html', 1, 2))
    } else {
      yamlArray.push(`${item.slug}:`)
    }

    if (item.children) {
      item.children.map((child) => {
        yamlArray.push(indent(`${child.slug}:`, 1, 2))

        child.children.map((grandChild) => {
          if (grandChild.title === 'Table of Contents') {
            yamlArray.push(
              indent('table-of-contents: table-of-contents.html', 1, 4)
            )

            return
          }

          if (grandChild.title === 'All Assertions') {
            yamlArray.push(indent('all-assertions: assertions.html', 1, 4))

            return
          }

          yamlArray.push(
            indent(`${grandChild.slug}: ${grandChild.slug}.html`, 1, 4)
          )
        })
      })
    }
  })
})

try {
  fs.writeFileSync('static/manifest.yml', yaml.dump(yamlArray.join('\n')))
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err)
}
