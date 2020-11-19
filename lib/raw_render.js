module.exports = function rawRender (hexo, text, options = {}) {
  const { engine } = options

  // renders using the low level hexo methods
  // which enables us to nest async tags
  // in renderable strings
  return hexo.extend.tag.render(text, this)
  .then((text) => {
    if (!engine) {
      return text
    }

    return hexo.render.renderSync({
      text: text.replace(/[-]{2}/g, 'rDOUBLE_DASHr'),
      engine,
    })
    // these replacements are a temporary fix: see the comments on
    // https://github.com/cypress-io/cypress-documentation/pull/935
    .replace('–', '--')
    .replace('—', '---')
    .replace(/rDOUBLE_DASHr/g, '--')
  })
}
