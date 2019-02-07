function wrapStart (hexo, args) {
  const [className, tag] = args
  return `<${tag || 'div'} class="${className}">`
}

function wrapEnd (hexo, args) {
  const [tag] = args
  return `</${tag || 'div'}>`
}

module.exports = {
  wrapStart,
  wrapEnd,
}
