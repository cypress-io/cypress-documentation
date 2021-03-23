;(function removeTrailingSlash() {
  if (window.location.pathname[window.location.pathname.length - 1] === '/') {
    let newLocation =
      window.origin +
      window.location.pathname.slice(0, window.location.pathname.length - 1) +
      (window.location.hash ? window.location.hash : '')

    window.location = newLocation
  }
})()
