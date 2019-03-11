function badge (hexo, args) {
  // {% badge danger removed %}
  //
  // <<< Transforms into >>>
  //
  // `<span class="badge badge-pill badge-danger">removed</span>`

  // default
  // primary
  // success
  // info
  // warning
  // danger

  return `<span class="badge badge-pill badge-${args[0]}">${args[1]}</span>`
}

module.exports = {
  badge,
}
