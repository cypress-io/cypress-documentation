module.exports = function aliases (hexo, args) {
  // {% aliases contain includes contains %}
  // Appears as "Aliases: contain, includes, contains"

  const aliases = args.join(', ')

  return `<br><small class="aliases"><strong>Aliases: </strong>${aliases}</small>`
}
