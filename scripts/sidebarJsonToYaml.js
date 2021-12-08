const fs = require('fs')
const yaml = require('js-yaml')
const sidebarJSON = require('../content/_data/sidebar.json')
const sidebarKeys = Object.keys(sidebarJSON)
let formattedSidebar = {}

const process = (arr) => {
  return arr.reduce((acc, { slug, children }) => {
    return {
      ...acc,
      [slug]: children ? process(children) : `${slug}`,
    }
  }, {})
}

sidebarKeys.map((key) => {
  const formattedKey = process(sidebarJSON[key])

  Object.assign(formattedSidebar, formattedKey)
})

fs.writeFileSync('static/manifest.yml', yaml.dump(formattedSidebar), 'utf8')
