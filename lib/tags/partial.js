const path = require('path')
const fs = require('fs')
const rawRender = require('../raw_render')

module.exports = function partial (hexo, fileName) {
  const pathToFile = path.resolve('source', '_partial', `${fileName}.md`)

  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, (err, data) => {
      if (err) reject(err)

      if (data) {
        resolve(rawRender(hexo, data.toString(), { engine: 'markdown' }))
      }
    })
  })
}
