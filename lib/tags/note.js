const Promise = require('bluebird')
const rawRender = require('../raw_render')

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
    rawRender(hexo, text, {engine: 'markdown'})

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
    toMarkdown(content)
  ).then((markdown) => {
    return `<blockquote class="note ${className}">${header}${markdown}</blockquote>`
  })
}
