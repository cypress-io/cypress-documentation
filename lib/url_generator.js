const _ = require('lodash')
const fs = require('hexo-fs')
const url = require('url')
const path = require('path')
const Promise = require('bluebird')
const debug = require('debug')('docs')
const Keyv = require('keyv')
const pluralize = require('pluralize')

const CACHE_HOURS = 1

const keyv = new Keyv(process.env.REDIS_URL)

if (process.env.REDIS_URL) {
  debug('using external Redis server to store HREF checks')
  // allow the process exit when done
  // otherwise Redis connection will block it forever
  keyv.opts.store.client.unref()
} else {
  debug('storing external HREF checks in memory')
}
debug('caching HREF checks for %s', pluralize('hour', CACHE_HOURS, true))

const startsWithHttpRe = /^http/
const everythingAfterHashRe = /(#.+)/

// converts seconds to milliseconds
const seconds = (n) => 1000 * n
// converts hours into milliseconds
const hours = (n) => seconds(3600 * n)

function isExternalHref (str) {
  return startsWithHttpRe.test(str)
}

function stripHash (str) {
  return str.replace(everythingAfterHashRe, '')
}

function extractHash (str) {
  const matches = everythingAfterHashRe.exec(str)

  // return the hash match or empty string
  return (matches && matches[0]) || ''
}

function normalizeNestedPaths (data) {
  // takes the data, iterates through it
  // and modifies all of the values with a fully
  // qualified path to the html file

  function flatten (obj, memo, parents) {
    return _.reduce(obj, (memo, value, key) => {
      if (_.isObject(value)) {
        return flatten(value, memo, parents.concat(key))
      }

      memo[key] = parents.concat(value).join('/')

      return memo
    }, memo)
  }

  function expand (obj, parents) {
    return _.mapValues(obj, (value, key) => {
      if (_.isObject(value)) {
        return expand(value, parents.concat(key))
      }

      return parents.concat(value).join('/')
    })
  }

  // return
  return {
    expanded: expand(data, []),
    flattened: flatten(data, {}, []),
  }
}

function findFileBySource (sidebar, href) {
  const { expanded, flattened } = normalizeNestedPaths(sidebar)

  function property () {
    // drill into the original sidebar object
    return _.get(expanded, href.split('/'))
  }

  // find the path directly from the sidebar
  // if provided, or go search for it
  return flattened[href] || property()
}

function validateLocalFilePath (pathToFile) {
  if (!pathToFile) {
    return false
  }

  return fs.existsSync(path.resolve('source', pathToFile.replace('.html', '.md')))
}

function getLocalFilePath (sidebar, href, source) {
  const hash = extractHash(href)
  const pathToFile = findFileBySource(sidebar, stripHash(href))

  if (validateLocalFilePath(pathToFile)) {
    return Promise.resolve(`/${pathToFile}${hash}`)
  }

  return Promise.reject(
    new Error(`Constructing {% url %} tag helper failed

    > The source file was: ${source}

    > Could not find a valid doc file in the sidebar.yml for: "${href}"
      the full url was "${href}"
    `)
  )
}

function getUrl (sidebar, href, source, text) {
  if (!href) {
    // if we dont have a hash
    return Promise.reject(
      new Error(`A url tag was not passed an href argument.

        > The source file was: ${source}

        > url tag's text was: ${text}
      `)
    )
  }

  // parse this into fully qualified url
  // so we normalize values like
  // http://foo.com
  // http://foo.com/
  const parsed = url.parse(href)

  href = parsed.href

  // external URLs are validated separately
  // and not cached
  if (isExternalHref(href)) {
    debug('building', href)
    return Promise.resolve(href)
  }

  // do we already have a cache for this href?
  return keyv.get(href).then((cachedValue) => {
    // if we got it, return it!
    if (cachedValue) {
      debug('key found %s -> %s', href, cachedValue)
      return cachedValue
    }

    debug('building and validating href', href)

    return getLocalFilePath(sidebar, href, source)
    .then((pathToFile) => {
      // cache this once its been locally resolved
      return keyv.set(href, pathToFile, hours(CACHE_HOURS))
      .then(() => {
        return pathToFile
      })

    })
  })
}

module.exports = {
  cache: keyv,

  normalizeNestedPaths,

  findFileBySource,

  getLocalFilePath,

  getUrl,
}
