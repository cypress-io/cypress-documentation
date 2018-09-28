const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const Promise = require('bluebird')
const { stripIndents } = require('common-tags')
const rawRender = require('../raw_render')

const globAsync = Promise.promisify(glob)

module.exports = function changelog (hexo) {
  // {% changelog %}
  const render = (str) => {
    return rawRender.call(this, hexo, str, { engine: 'markdown' })
  }

  const env = hexo.env.NODE_ENV || hexo.env.env || process.env.NODE_ENV || 'development'
  const isProdOrStaging = ['production', 'staging'].includes(env)
  const pathToChangelogs = path.resolve('source', '_changelogs', '*')

  return globAsync(pathToChangelogs)
  .call('reverse')
  .then((paths) => {
    return !isProdOrStaging ? paths.slice(0, 5) : paths
  })
  .map((path) => {
    return fs.readFile(path, 'utf8')
  })
  .tap((logs) => {
    if (!isProdOrStaging) {
      const warning = stripIndents`
        {% note warning Truncated Changelog %}
        For performance reasons, the changelog has been reduced to rendering the last 5 entries.

        Please run the docs in staging or production environments to see the full changelog.
        {% endnote %}`

      logs.push(warning)
    }
  })
  .map(render)
  .call('join', '')
}
