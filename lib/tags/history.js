const Promise = require('bluebird')

module.exports = function history (hexo, args, content) {
  // {% history %}
  // | 2.0.0 | Foo deprecated, now use bar
  // | 1.0.0 | Commmand introduced
  // {% endhistory %}

  const toMarkdown = (text) =>
    hexo.render.renderSync({ text, engine: 'markdown' })

  let tableMarkdown = `Version | Changes
                       --- | ---`

  return Promise.resolve(
    toMarkdown([tableMarkdown, content].join('\n'))
  ).then((markdown) => {
    return `<details class="history"><summary><h1 id="History" class="article-heading"><i class="fa fa-chevron-down history-disclosure"></i>History</h1></summary>${markdown}</details>`
  })
}
