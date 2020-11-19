'use strict'

/* global hexo */
const debug = require('debug')('docs')

const helpers = require('../lib/helpers')

let pathFn = require('path')
let _ = require('lodash')

function startsWith (str, start) {
  return str.substring(0, start.length) === start
}

hexo.extend.helper.register('page_nav', function () {
  const lang = this.page.lang
  const isEnglish = lang === 'en'
  const type = this.page.canonical_path.split('/')[0]
  const sidebar = this.site.data.sidebar[type]
  const path = pathFn.basename(this.path)
  const prefix = `sidebar.${type}.`
  let list = {}

  for (let i in sidebar) {
    for (let j in sidebar[i]) {
      list[sidebar[i][j]] = { 'group': i, 'title': j }
    }
  }

  let keys = Object.keys(list)
  let index = keys.indexOf(path)
  let result = ''

  const shouldShowPrevArticle = index > 0
  const shouldShowNextArticle = index < keys.length - 1

  if (shouldShowPrevArticle) {
    const group = list[keys[index - 1]].group
    const page = keys[index - 1]
    const title = list[keys[index - 1]].title
    const href = (!isEnglish ? [lang, type, group, page] : [type, group, page]).join('/')

    result += `<a href="${this.config.root + href}" title="Prev Article" class="article-footer-prev"><i class="fa fa-chevron-left"></i><span>${this.__(prefix + title)}</span></a>`
  }

  if (shouldShowNextArticle) {
    const group = list[keys[index + 1]].group
    const page = keys[index + 1]
    const title = list[keys[index + 1]].title
    const href = (!isEnglish ? [lang, type, group, page] : [type, group, page]).join('/')

    result += `<a href="${this.config.root + href}" title="Next Article" class="article-footer-next"><span>${this.__(prefix + title)}</span><i class="fa fa-chevron-right"></i></a>`
  }

  return result
})

hexo.extend.helper.register('doc_sidebar', function (className) {
  const lang = this.page.lang
  const isEnglish = lang === 'en'
  const type = this.page.canonical_path.split('/')[0]
  const sidebar = this.site.data.sidebar[type]
  const path = pathFn.basename(this.path)
  const self = this
  const prefix = `sidebar.${type}.`
  let result = ''
  let expandAll = false

  // IF the sidebar's categories aren't that many,
  // expand them all, since it's more of a hassle to expand one by one
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
  const lang = this.page.lang
  const isEnglish = lang === 'en'
  const type = this.page.canonical_path.split('/')[0]
  const sidebar = this.site.data.sidebar[type]
  const self = this
  const prefix = `sidebar.${type}.`
  let result = ''

  _.each(sidebar, function (menu, title) {
    result += `<li class="api-title"><h2>${self.__(prefix + title)}</h2><ul class="api-links">`

    _.each(menu, function (link, text) {
      let href = (!isEnglish ? [lang, type, title, link] : [type, title, link]).join('/')

      result += `<li class='api-li api-li-${title}'><a href="${self.config.root + href}" class="api-link">
        ${self.__(prefix + text)}</a></li>`
    })

    // close the ul containing the menus
    result += '</ul></li>'
  })

  return result
})

hexo.extend.helper.register('menu', function (type) {
  const lang = this.page.lang
  const isEnglish = lang === 'en'
  const file = `${type}-menu`
  const menu = this.site.data[file]
  const self = this
  const currentPathFolder = this.path.split('/')[0]

  return _.reduce(menu, function (result, menuPath, title) {
    if (!isEnglish) {
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
  const lang = this.page.lang
  let url = this.url_for(path)

  if (lang !== 'en' && url[0] === '/') url = `/${lang}${url}`

  return url
})

hexo.extend.helper.register('raw_link', function () {
  const source = this.page.source

  return `https://github.com/cypress-io/cypress-documentation/edit/develop/source/${source}`
})

hexo.extend.helper.register('add_page_anchors', helpers.addPageAnchors)

hexo.extend.helper.register('canonical_path_for_nav', function () {
  let path = this.page.canonical_path

  if (startsWith(path, 'guides/') || startsWith(path, 'api/')) {
    return path
  }

  return ''
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
