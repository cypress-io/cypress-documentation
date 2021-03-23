;(function ensureTrailingSlash() {
  // eslint-disable-next-line no-console
  console.log('✅ LOADED: ensureTrailingSlash.js')
  let SLASH = '/'

  if (!(location.href[location.href.length - 1] === SLASH)) {
    window.location = location.href + SLASH
  }
})()
