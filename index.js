process.on('unhandledRejection', function (reason, p) {
  /* eslint-disable no-console */
  console.error('Unhandled Rejection at: Promise ', p)
  console.error('reason: ', reason)
  process.exit(-1)
})

// const { copyUntranslatedDocs } = require('./copy-english-docs')
const Hexo = require('hexo')
const chalk = require('chalk')
const minimist = require('minimist')
const Contentful = require('contentful')
const moment = require('moment')
const yaml = require('js-yaml')
const fs = require('fs')
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer')

// these are the args like --port
const args = minimist(process.argv.slice(2))

// this is the command passed in such as 'server' or 'generate'
const cmd = args._.shift()

const hexo = new Hexo(process.cwd(), args)

function initHexo () {
  // defaults outside of _config.yml
  Object.assign(hexo.config, {
    hfc_useref: {
      enable: true,
      concat: true,
      exclude: null,
    },
    hfc_html: {
      enable: false,
      exclude: null,
    },
    hfc_css: {
      enable: true,
      exclude: ['*.min.css'],
    },
    hfc_favicons: {
      enable: false,
    },
    hfc_js: {
      enable: true,
      mangle: true,
      compress: {},
      exclude: ['*.min.js'],
    },
    hfc_img: {
      enable: true,
      interlaced: false,
      multipass: false,
      optimizationLevel: 2,
      pngquant: false,
      progressive: false,
      webp: true,
      webpQuality: 75,
      gifslice: true,
      jpegtran: true,
      jpegrecompress: false,
      jpegrecompressQuality: 'medium',
      optipng: true,
      svgo: false,
    },
  })

  // hexo does this weird thing where it literally sets
  // an 'env' property on the 'env' object
  // so we take that into account (and any other way it is set)
  const env = hexo.env.NODE_ENV || hexo.env.env || process.env.NODE_ENV || 'development'

  // https://github.com/mamboer/hexo-filter-cleanup
  // only run the filter_cleanup if we are in
  // production mode -- deploying static asset
  // this will combine multiple JS files into single "application.js"
  // note that --debug mode in hexo disables clean up automatically
  if (env !== 'production' && env !== 'staging') {
    console.log('disabling filter cleanup for environment', env)
    hexo.config.filter_cleanup = false
  }

  let url

  if (env === 'staging') {
    url = 'https://docs-staging.cypress.io'
  } else {
    url = 'https://docs.cypress.io'
  }

  console.log('in environment %s site url is %s', env, url)
  hexo.config.url = url

  // set this on both our process + Hexo
  process.env.NODE_ENV = hexo.env.NODE_ENV = env

  console.log('NODE_ENV is:', chalk.cyan(env))

  return new Promise((resolve, reject) => {
    const space = hexo.env.GATSBY_CONTENTFUL_SPACE_ID || process.env.GATSBY_CONTENTFUL_SPACE_ID
    const accessToken = hexo.env.GATSBY_CONTENTFUL_ACCESS_TOKEN || process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN
    const environment = hexo.env.GATSBY_CONTENTFUL_ENVIRONMENT || process.env.GATSBY_CONTENTFUL_ENVIRONMENT || 'master'

    if (typeof space === 'undefined' || typeof accessToken === 'undefined') {
      return reject({
        message: 'No Contentful space variables.',
      })
    }

    return Contentful.createClient({ space, accessToken, environment })
    .getEntries({ content_type: 'docsTopBanner' })
    .then(({ items }) => {
      const data = items.reduce((filtered, { sys: { id }, fields }) => {
        if (moment(fields.endDate).isSameOrAfter(moment())) {
          filtered.push({ id, ...fields, text: documentToHtmlString(fields.text) })
        }

        return filtered
      }, [])

      fs.writeFile(
        `${__dirname}/source/_data/banners.yml`,
        yaml.safeDump(data),
        (error) => {
          // log if writeFile ends with error, but don't block hexo init process
          if (error) {
            console.warn(error)

            return reject(error)
          }

          return resolve()
        },
      )
    })
    .catch((err) => {
      return reject({
        message: err,
      })
    })
  })
  // start Hexo
  .then(() => hexo.init().then(() => hexo.call(cmd, args)))
  .catch((error) => {
    // log error object
    console.error(error)

    // but start Hexo anyway
    return hexo.init().then(() => hexo.call(cmd, args))
  })
}

initHexo()
