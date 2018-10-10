const Promise = require('bluebird')

module.exports = function history (hexo, args, content) {
  // {% history %}
  // | 2.0.0 | Foo deprecated, now use bar
  // | 1.0.0 | Commmand introduced
  // {% endhistory %}

  const toMarkdown = (text) =>
    hexo.render.renderSync({ text, engine: 'markdown' })

  let tableMarkdown = `| Version | Changes |
                        | --- | --- |`

  return Promise.resolve(
    toMarkdown([tableMarkdown, content].join('\n'))
  ).then((markdown) => {
    return `<details class="history"><summary class="history-heading">History</summary>${markdown}</details>`
  })
}
