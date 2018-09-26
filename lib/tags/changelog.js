const path = require('path')
const glob = require('glob')
const Promise = require('bluebird')
const rawRender = require('../raw_render')
const fs = require('fs-extra')

const globAsync = Promise.promisify(glob)

module.exports = function partial (hexo) {
  // {% changelog %}
  const render = (str) => {
    return rawRender.call(this, hexo, str, { engine: 'markdown' })
  }

  const env = hexo.env.NODE_ENV || hexo.env.env || process.env.NODE_ENV || 'development'
  const pathToChangelogs = path.resolve('source', '_changelogs', '*')

  return globAsync(pathToChangelogs)
  .call('reverse')
  .then((paths) => {
    const shouldSlice = env !== 'production' | 'staging'

    return shouldSlice ? paths.slice(0, 5) : paths
  })
  .map((path) => {
    return fs.readFile(path, 'utf8')
  })
  .map(render)
  .call('join', '')
}
