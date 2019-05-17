const Promise = require('bluebird')

module.exports = function note (hexo, args, content) {
  // {% note info Want to see Cypress in action? %}
  // Explore talks, blogs, and podcasts about testing in Cypress.
  // {% endnote %}
  //
  // <<< Transforms into >>>
  //
  // <blockquote class="note info">
  //   <strong class="note-title">Want to see Cypress in action?</strong>
  //   <p>
  //     Explore talks, blogs, and podcasts about testing in Cypress.
  //   </p>
  // </blockquote>

  const iconLookup = {
    info: 'info-circle',
    warning: 'exclamation-circle',
    success: 'check-circle',
    danger: 'times-circle',
    bolt: 'bolt', // useful for tips / hints
  }

  const toMarkdown = (text) =>
    hexo.render.renderSync({ text, engine: 'markdown' })

  const stripSurroundingParagraph = (text) =>
    text.replace(/^<p>/, '').replace(/<\/p>$/, '')

  let header = ''
  const className = args.shift()
  const icon = iconLookup[className]

  if (args.length) {
    header += `<strong class="note-title foo">
      ${icon ? `<i class="fa fa-${icon}"></i>` : ''}
      ${stripSurroundingParagraph(toMarkdown(args.join(' ')))}
    </strong>`
  }

  return Promise.resolve(
    // these replacements are a temporary fix: see the comments on
    // https://github.com/cypress-io/cypress-documentation/pull/935
    toMarkdown(content)
    .replace('–', '--')
    .replace('—', '---')
  ).then((markdown) => {
    return `<blockquote class="note ${className}">${header}${markdown}</blockquote>`
  })
}
