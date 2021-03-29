;(function removeTrailingSlash() {
  if (window.location.pathname === '/') {
    // do nothing, otherwise this will cause
    // an infinite number of redirects
    return
  }

  /**
   * Netlify is allowing for paths to end with `/`, however, this can cause issues
   * if a user lands on a URL that ends with `/`, navigates to another page,
   * then presses the browser's back button. The browser's address bar will update
   * to the previous URL, but the page will 404. To eliminate this possibility,
   * we will remove any trailing slashes from the window.location.pathname.
   */
  if (window.location.pathname[window.location.pathname.length - 1] === '/') {
    let newLocation =
      window.origin +
      window.location.pathname.slice(0, window.location.pathname.length - 1) +
      (window.location.hash ? window.location.hash : '')

    window.location = newLocation
  }
})()
