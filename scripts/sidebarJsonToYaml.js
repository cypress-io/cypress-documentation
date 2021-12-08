const fs = require('fs')
const yaml = require('js-yaml')
const slugify = require('slugify')
const sidebarJSON = require('../content/_data/sidebar.json')
const sidebarKeys = Object.keys(sidebarJSON)
let formattedSidebar = {}

const process = (arr) => {
  return arr.reduce((acc, { slug, children, title }) => {
    return {
      ...acc,
      [slug ? slug : slugify(title).toLowerCase()]: children
        ? process(children)
        : `${slug ? slug : slugify(title).toLowerCase()}`,
    }
  }, {})
}

sidebarKeys.map((key) => {
  const formattedKey = process(sidebarJSON[key])

  Object.assign(formattedSidebar, formattedKey)
})

fs.writeFileSync('static/manifest.yml', yaml.dump(formattedSidebar), 'utf8')
