const _ = require('lodash')
const fs = require('hexo-fs')
const url = require('url')
const path = require('path')
const cheerio = require('cheerio')
const Promise = require('bluebird')
// const request = require('request-promise')
// const errors = require('request-promise/errors')
const la = require('lazy-ass')
const is = require('check-more-types')
const debug = require('debug')('docs')
// const minimist = require('minimist')
const Keyv = require('keyv')
const YAML = require('yamljs')
const { commaLists } = require('common-tags')

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

debug('caching HREF checks for %s', `${CACHE_HOURS} ${CACHE_HOURS === 1 ? 'hour' : 'hours'}`)

const startsWithHttpRe = /^http/
const everythingAfterHashRe = /(#.+)/

// const args = minimist(process.argv.slice(2))

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

function assertHashIsPresent (descriptor, source, hash, html, tag = 'url') {
  la(is.unemptyString(html), 'expected html string', html)

  // verify that the hash is present on this page
  const $ = cheerio.load(html)

  // hash starts with a '#hash'
  // or href starts with '#hash'
  if ($(hash).length || $(`a[href=${hash}]`).length) {
    // found it, we good!
    return
  }

  // we didn't find anything, so throw the error
  const truncated = _.truncate(html, { length: 120 }) || '""'

  // TODO: show all available ids if cannot find hash

  // if we dont have a hash
  throw new Error(`Constructing {% ${tag} %} tag helper failed

  > The source file was: ${source}

  > You referenced a hash that does not exist at: ${descriptor}

  > Expected to find an element matching the id: ${hash} or href: ${hash}

  > The HTML response body was:

  ${truncated}
  `)
}

// const hrefs = []

// function isTimeoutError (err) {
//   return err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT'
// }

// function validateExternalUrl (href, source) {
//   const { hash, hostname } = url.parse(href)

//   const started = new Date()

//   // don't check download.cypress.io
//   if (hostname === 'download.cypress.io') {
//     debug('assuming %s is working (from %s)', hostname, href)

//     return Promise.resolve()
//   }

//   if (href.includes('Object]')) {
//     return Promise.reject(
//       new Error(`Constructing {% url %} tag helper failed
//         > The source file was: ${source}

//         > You must quote the URL: ${href}
//       `)
//     )
//   }

//   hrefs.push(href)

//   debug('validate %s by requesting it', href)

//   return request({
//     method: hash ? 'GET' : 'HEAD', // if we have a hash, use GET, else HEAD
//     url: href,
//     timeout: 5000,
//   })
//   .then((html) => {
//     // bail if we dont have a hash
//     if (!hash) {
//       return
//     }

//     assertHashIsPresent(href, source, hash, html)
//   })
//   .catch(errors.StatusCodeError, (err) => {
//     err.message = `Request to: ${href} failed. (Status Code ${err.statusCode})`
//     throw err
//   })
//   .catch(errors.RequestError, (reason) => {
//     // https://github.com/request/request-promise#rejected-promises-and-the-simple-option
//     const err = reason.error

//     if (isTimeoutError(err)) {
//       /* eslint-disable no-console */
//       const ms = new Date() - started

//       console.log(`Request to: ${href} timed out. Ignoring this error and proceeding. Waited for ${ms}ms.`)

//       return
//     }

//     /* eslint-disable no-console */
//     console.log(`Request to: ${href} failed.`)

//     throw err
//   })
// }

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

function getLocalFile (sidebar, href, source, fullUrl) {
  // get the resolve path to the file
  // cypress-101 -> guides/core-concepts/cypress-101.html
  const pathToFile = findFileBySource(sidebar, href)

  if (pathToFile) {
    // ensure this physically exists on disk
    // inside of './source' folder
    return fs.readFile(
      path.resolve('source', pathToFile.replace('.html', '.md'))
    ).then((str) => {
      // return an array with
      // path to file, and str bytes
      return [pathToFile, str]
    })
  }

  return Promise.reject(
    new Error(`Constructing {% url %} tag helper failed

    > The source file was: ${source}

    > Could not find a valid doc file in the sidebar.yml for: "${href}"
      the full url was "${fullUrl}"
    `)
  )
}

/**
 * Tries to validate an anchor link like "visual-testing" against section
 * names in the given YAML file (like "plugins.yml"). All sections
 * will become anchor links with kebab cases. So a section "Visual Testing"
 * will become anchor "visual-testing"
 */
function validateYamlName (filename, hash) {
  la(is.unemptyString(hash), 'expected a hash to validate in YAML file', filename, hash)

  // handle "#visual-testing" and "visual-testing" the same way
  if (hash[0] === '#') {
    hash = hash.substr(1)
  }

  return new Promise((resolve, reject) => {
    const yml = YAML.load(filename)
    const names = _.map(yml, 'name').map(_.kebabCase)

    debug('in YAML file %s section names are: %o', filename, names)

    if (names.includes(hash)) {
      const resolved = `/plugins/#${hash}`

      debug('resolved plugin url %s', resolved)

      return resolve(resolved)
    }

    const error = commaLists`
      Could not section name "${hash}"
      in YAML file ${filename}

      Available sections: ${names}
    `

    return reject(new Error(error))
  })
}

function validateLocalFile (sidebar, href, source, render) {
  const hash = extractHash(href)

  // a couple of exceptions that are autogenerated
  // changelog document
  // plugins (YAML file)

  if (href.includes('changelog')) {
    return Promise.resolve(`/guides/references/changelog.html${hash}`)
  }

  if (href.includes('plugins#')) {
    return validateYamlName('source/_data/plugins.yml', hash)
  }

  const withoutHash = stripHash(href)

  debug('getting local file %s', withoutHash)

  return getLocalFile(sidebar, withoutHash, source, href)
  .spread((pathToFile, str) => {
    if (hash) {
      // if we have a hash then render
      // the markdown contents so we can
      // ensure it has the hash present!
      la(is.string(str), 'expected a string to render, got', typeof str, str)
      const html = render(str)

      assertHashIsPresent(pathToFile, source, hash, html)

      return pathToFile
    }

    return pathToFile
  })
  .then((pathToFile) => {
    return `/${pathToFile}${hash}`
  })
}

function validateAndGetUrl (sidebar, href, source, text, render) {
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

  // do we already have a cache for this href?
  return keyv.get(href).then((cachedValue) => {
    // if we got it, return it!
    if (cachedValue) {
      debug('key found %s -> %s', href, cachedValue)

      return cachedValue
    }

    debug('requesting href', href)

    if (isExternalHref(href)) {
      // cache this now even though
      // we haven't validated it yet
      // because it will just fail later
      return keyv.set(href, href, hours(CACHE_HOURS))
      .then(() => {
        return href
      })
    }

    debug('validating local file %s', href)

    return validateLocalFile(sidebar, href, source, render)
    .then((pathToFile) => {
      // cache this once it has been locally resolved
      return keyv.set(href, pathToFile, hours(CACHE_HOURS))
      .then(() => {
        return pathToFile
      })
    })
  })
}

module.exports = {
  cache: keyv,

  assertHashIsPresent,

  normalizeNestedPaths,

  findFileBySource,

  getLocalFile,

  validateLocalFile,

  validateAndGetUrl,
}
