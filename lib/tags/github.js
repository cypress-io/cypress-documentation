const Promise = require('bluebird')
const util = require('hexo-util')

function user (hexo, args) {
  // {% user "jane-lane" %}
  //
  // turns into <a href="https://github.com/jane-lane" target="_blank">@jane-lane</a>
  const identity = args[0]

  const attrs = {
    href: `https://github.com/${identity}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  return Promise.resolve(hexo.render.renderSync({ text: `@${identity}`, engine: 'markdown' }))
  .then((markdown) => {
    // remove <p> and </p> and \n
    markdown = markdown
    .split('<p>').join('')
    .split('</p>').join('')
    .split('\n').join('')

    return util.htmlTag('a', attrs, markdown)
  })
}

function issue (hexo, args) {
  // {% issue 74 "not currently supported" %}

  const num = args[0]

  const attrs = {
    href: `https://github.com/cypress-io/cypress/issues/${num}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  const text = args[1] || `#${num}`

  return Promise.resolve(hexo.render.renderSync({ text, engine: 'markdown' }))
  .then((markdown) => {
    // remove <p> and </p> and \n
    markdown = markdown
    .split('<p>').join('')
    .split('</p>').join('')
    .split('\n').join('')

    return util.htmlTag('a', attrs, markdown)
  })
}


function PR (hexo, args) {
  // {% PR 74 "See PR" %}

  const num = args[0]

  const attrs = {
    href: `https://github.com/cypress-io/cypress/pull/${num}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  const text = args[1] || `#${num}`

  return Promise.resolve(hexo.render.renderSync({ text, engine: 'markdown' }))
  .then((markdown) => {
    // remove <p> and </p> and \n
    markdown = markdown
    .split('<p>').join('')
    .split('</p>').join('')
    .split('\n').join('')

    return util.htmlTag('a', attrs, markdown)
  })
}

function openAnIssue (hexo, args) {
  // {% open_an_issue %}
  // {% open_an_issue 'here' %}

  const attrs = {
    href: 'https://github.com/cypress-io/cypress/issues/new',
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  const text = args[0] || 'Open an issue'

  return util.htmlTag('a', attrs, text)
}

module.exports = {
  user,

  issue,

  PR,

  openAnIssue,
}
