
module.exports = function video (hexo, args) {
  // {% video 237115455 %}
  //
  // <<< Transforms into >>>
  //
  // <div class="embed-container">
  //  <iframe src="//player.vimeo.com/video/237115455" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  // </div>

  const [videoId] = args
  return `
    <div class="embed-container">
      <iframe src="//player.vimeo.com/video/${videoId}" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    </div>
  `
}
