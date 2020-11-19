module.exports = function video (hexo, args) {
  // {% video vimeo 237115455 %}
  //
  // <<< Transforms into >>>
  //
  // <div class="embed-container">
  //  <iframe src="//player.vimeo.com/video/237115455" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  // </div>

  // {% video youtube 5XQOK0v_YRE %}
  //
  // <<< Transforms into >>>
  //
  // <div class="embed-container">
  //  <iframe width="560" height="315" src="https://www.youtube.com/embed/5XQOK0v_YRE?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  // </div>

  const [player, videoId] = args

  switch (player) {
    case 'vimeo':
      return `
        <div class="embed-container">
          <iframe title="${player} video" src="//player.vimeo.com/video/${videoId}" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        </div>
      `
    case 'youtube':
      return `
        <div class="embed-container">
          <iframe title="${player} video" src="https://www.youtube.com/embed/${videoId}?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
      `
    case 'local':
      return `
        <div>
        <video autoplay loop muted playsinline controls class="lazy" poster="${videoId.split('.')[0]}.png" style="width:100%">
            <source data-src="${videoId}" type="video/mp4">
        </video>
        </div>
      `

    default:
      throw new Error('invalid player option passed to the "video" tag')
  }
}
