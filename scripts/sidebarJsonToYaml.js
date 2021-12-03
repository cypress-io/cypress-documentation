const fs = require('fs')
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
