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

    const output = hexo.render.renderSync({
      text,
      engine,
    })

    if (engine !== 'markdown') {
      return output
    }

    return output
    // these replacements are a temporary fix: see the comments on
    // https://github.com/cypress-io/cypress-documentation/pull/935
    .replace('–', '--')
    .replace('—', '---')
  })
}
