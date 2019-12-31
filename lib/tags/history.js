const Promise = require('bluebird')

module.exports = function history (hexo, args, content) {
  // {% history %}
  // | 2.0.0 | Foo deprecated, now use bar
  // | 1.0.0 | Commmand introduced
  // {% endhistory %}

  const toMarkdown = (text) => {
    return hexo.render.renderSync({ text, engine: 'markdown' })
  }

  let tableMarkdown = `Version | Changes
                       --- | ---`

  return Promise.resolve(
    toMarkdown([tableMarkdown, content].join('\n'))
  ).then((markdown) => {
    return `<h1 id="History" class="article-heading">History</h1>${markdown}`
  })
}
