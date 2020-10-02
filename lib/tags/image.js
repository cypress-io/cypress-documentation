module.exports = function image (hexo, args) {
  // {% imgTag /img/api/coordinates-diagram.jpg "alt text" ["css-class"] %}
  //
  // <<< Transforms into >>>
  //
  // <img src="/img/api/coordinates-diagram.jpg" alt="alt text" class="css-class" />
  //
  // path should be relative to themes/cypress/source/

  const [path, altText, cssClass] = args

  return `<img src="${path}" alt="${altText}" class="${cssClass || ''}"/>`
}
