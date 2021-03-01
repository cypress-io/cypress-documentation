(function () {
  // Ensure backwards compatibility with old-docs URLs
  if (window.location.hash) {
    let newHref = window.location.href.toLowerCase()

    if (newHref !== window.location.href) {
      window.location.replace(newHref);
    }
  }
})();