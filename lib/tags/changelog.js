/* eslint-disable */
// if we're in dev, just read off the first 5 fs.readFile changelogs and render them
// if we're in prod / staging then build them all!

const path = require('path')
const glob = require('glob')
const Promise = require('bluebird')

const globAsync = Promise.promisify(glob)

module.exports = function partial(hexo, fileName) {
  // const pathToFile = path.resolve('source', '_partial', `${fileName}.md`)

  // glob the path to all of the changelogs
  const pathToChangelogs = path.resolve('source', '_changelogs', '*')

  return globAsync(pathToChangelogs)
  .then((changelogs) => {

  })

  // return hexo.render.renderSync({ path: pathToFile, engine: 'markdown' })
}
