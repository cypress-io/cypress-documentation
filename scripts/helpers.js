'use strict'

/* global hexo */
const debug = require('debug')('docs')

const helpers = require('../lib/helpers')

let pathFn = require('path')
let _ = require('lodash')

let localizedPath = ['guides', 'api']

function startsWith (str, start) {
  return str.substring(0, start.length) === start
}

hexo.extend.helper.register('page_nav', function () {
  let type = this.page.canonical_path.split('/')[0]
  let sidebar = this.site.data.sidebar[type]
  let path = pathFn.basename(this.path)
  let list = {}
  let prefix = `sidebar.${type}.`

  for (let i in sidebar) {
    for (let j in sidebar[i]) {
      list[sidebar[i][j]] = { 'group': i, 'title': j }
    }
  }

  let keys = Object.keys(list)
  let index = keys.indexOf(path)
  let result = ''

  if (index > 0) {
    const group = list[keys[index - 1]].group
    const page = keys[index - 1]
    const title = list[keys[index - 1]].title
    const href = [type, group, page].join('/')

    result += `<a href="${this.config.root + href}" title="Prev Article" class="article-footer-prev"><i class="fa fa-chevron-left"></i><span>${this.__(prefix + title)}</span></a>`
  }

  if (index < keys.length - 1) {
    const group = list[keys[index + 1]].group
    const page = keys[index + 1]
    const title = list[keys[index + 1]].title
    const href = [type, group, page].join('/')

    result += `<a href="${this.config.root + href}" title="Next Article" class="article-footer-next"><span>${this.__(prefix + title)}</span><i class="fa fa-chevron-right"></i></a>`
  }

  return result
})

hexo.extend.helper.register('doc_sidebar', function (className) {
  let type = this.page.canonical_path.split('/')[0]
  let sidebar = this.site.data.sidebar[type]
  let path = pathFn.basename(this.path)
  let result = ''
  let self = this
  let prefix = `sidebar.${type}.`
  let expandAll = false
  let lang = this.page.lang
  let isEnglish = lang === 'en'

  // IF the sidebar's categories aren't that many,
  // just expand them all, since it's more of a hassle to expand one by one
  if (_.keys(sidebar).length <= 6) {
    expandAll = true
  }

  _.each(sidebar, function (menu, title) {
    result += `<li class="${className}-title is-collapsed" data-target="sidebar-li-${title}" data-toggle="collapse"><strong>${self.__(prefix + title)}</strong><ul class="sidebar-links">`

    _.each(menu, function (link, text) {
      let href = [type, title, link].join('/')

      if (!isEnglish) {
        href = [lang, href].join('/')
      }

      let itemClass = `${className}-link`
      let currentlyActive = link === path

      if (currentlyActive) {
        itemClass += ' current'
        // remove 'is-collapsed' class from parent container
        result = result.replace(`is-collapsed" data-target="sidebar-li-${title}`, `current" data-target="sidebar-li-${title}`)
      }

      if (expandAll) {
        // remove 'is-collapsed' class from parent container
        result = result.replace(`is-collapsed" data-target="sidebar-li-${title}`, `" data-target="sidebar-li-${title}`)
      }

      result += `<li class='sidebar-li sidebar-li-${title}'><a href="${self.config.root + href}" class="${itemClass}">
        ${self.__(prefix + text)}</a></li>`
    })

    // close the ul containing the menus
    result += '</ul></li>'
  })

  return result
})

hexo.extend.helper.register('api_toc', function () {
  let type = this.page.canonical_path.split('/')[0]
  let sidebar = this.site.data.sidebar[type]
  let result = ''
  let self = this
  let prefix = `sidebar.${type}.`

  _.each(sidebar, function (menu, title) {
    result += `<li class="api-title"><h2>${self.__(prefix + title)}</h2><ul class="api-links">`

    _.each(menu, function (link, text) {
      let href = [type, title, link].join('/')

      result += `<li class='api-li api-li-${title}'><a href="${self.config.root + href}" class="api-link">
        ${self.__(prefix + text)}</a></li>`
    })

    // close the ul containing the menus
    result += '</ul></li>'
  })

  return result
})

hexo.extend.helper.register('menu', function (type) {
  let file = `${type}-menu`
  let menu = this.site.data[file]
  let self = this
  let lang = this.page.lang
  let isEnglish = lang === 'en'
  let currentPathFolder = this.path.split('/')[0]

  return _.reduce(menu, function (result, menuPath, title) {
    if (!isEnglish && ~localizedPath.indexOf(title)) {
      menuPath = lang + menuPath
    }

    // Sees if our current path is part of the menu's path
    // Capture the first folder
    // /guides/welcome/foo.html captures 'guides'
    let firstPathName = menuPath.split('/')[1]

    // Does our current path match our menu?
    let isCurrent = currentPathFolder === firstPathName

    return `${result}<li><a href="${self.url_for(menuPath)}" class="${type}-nav-link ${isCurrent ? 'active' : ''}"> ${self.__(`menu.${title}`)}</a></li>`
  }, '')
})

hexo.extend.helper.register('canonical_url', function (lang) {
  let path = this.page.canonical_path

  if (lang && lang !== 'en') path = `${lang}/${path}`

  return `${this.config.url}/${path}`
})

hexo.extend.helper.register('url_for_lang', function (path) {
  let lang = this.page.lang
  let url = this.url_for(path)

  if (lang !== 'en' && url[0] === '/') url = `/${lang}${url}`

  return url
})

hexo.extend.helper.register('raw_link', function (path) {
  const branch = 'develop'

  return `https://github.com/cypress-io/cypress-documentation/edit/${branch}/source/${path}`
})

hexo.extend.helper.register('add_page_anchors', helpers.addPageAnchors)

hexo.extend.helper.register('canonical_path_for_nav', function () {
  let path = this.page.canonical_path

  if (startsWith(path, 'guides/') || startsWith(path, 'api/')) {
    return path
  }

  return ''

})

hexo.extend.helper.register('lang_name', function (lang) {
  let data = this.site.data.languages[lang]

  return data.name || data
})

hexo.extend.helper.register('order_by_name', function (posts) {
  return _.sortBy(posts, (post) => post.name.toLowerCase(), 'name')
})

/**
 * Helper that creates safe url id from section title.
 * @example
 ```
  {% for pluginType in site.data.plugins %}
    <h2 id="{{ id(pluginType.name) }}">{{ pluginType.name }}</h2>
  {% endfor %}
 ```
 */
const id = (title) => {
  const id = _.kebabCase(_.deburr(title))

  debug('from title "%s" got id "%s"', title, id)

  return id
}

hexo.extend.helper.register('id', id)
