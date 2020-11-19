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

  const className = args.shift()

  const toMarkdown = (text) => {
    return rawRender(hexo, text, { engine: 'markdown' })
  }

  const stripSurroundingParagraph = (text) => {
    return text.replace(/^<p>/, '').replace(/<\/p>\n?$/, '')
  }

  const renderHeader = (params) => {
    if (!params.length) {
      return Promise.resolve('')
    }

    return toMarkdown(params.join(' '))
    .then((content) => {
      const className = args.shift()
      const icon = iconLookup[className]

      return `<strong class="note-title foo">
        ${icon ? `<i class="fa fa-${icon}"></i>` : ''}
        ${stripSurroundingParagraph(content)}
      </strong>`
    })
  }

  return Promise.all([
    toMarkdown(content),
    renderHeader(args),
  ])
  .then(([markdown, header]) => `<blockquote class="note ${className}">${header}${markdown}</blockquote>`)
}
