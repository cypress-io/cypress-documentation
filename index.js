process.on('unhandledRejection', function (reason, p) {
  /* eslint-disable no-console */
  console.error('Unhandled Rejection at: Promise ', p)
  console.error('reason: ', reason)
  process.exit(-1)
})

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

// if there is a need to fetch data from our contentful acc
const contentfulClient = Contentful.createClient({
  space: hexo.env.GATSBY_CONTENTFUL_SPACE_ID || process.env.GATSBY_CONTENTFUL_SPACE_ID,
  accessToken: hexo.env.GATSBY_CONTENTFUL_ACCESS_TOKEN || process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN,
})

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

  // set this on both our process + hexo
  process.env.NODE_ENV = hexo.env.NODE_ENV = env

  console.log('NODE_ENV is:', chalk.cyan(env))

  return contentfulClient
  .getEntries({ content_type: 'topBanner' })
  .then(({ items }) => {
    const data = items.reduce((filtered, option) => {
      if (moment(option.fields.endDate).isSameOrAfter(moment())) {
        filtered.push({ ...option.fields, text: documentToHtmlString(option.fields.text) })
      }

      return filtered
    }, [])

    return new Promise((resolve) => {
      fs.writeFile(
        `${__dirname}/source/_data/banners.yml`,
        yaml.safeDump(data),
        (error) => {
          // log if writeFile ends with error, but don't block hexo init process
          if (error) console.error(error)

          return resolve()
        },
      )
    })
  })
  .then(() => hexo.init().then(() => hexo.call(cmd, args)))
  .catch((error) => {
    console.error(error)

    return hexo.init().then(() => hexo.call(cmd, args))
  })
}

initHexo()

