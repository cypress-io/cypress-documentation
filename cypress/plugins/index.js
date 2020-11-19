// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs')

const baseUrlEnvMap = {
  'https://docs-staging.cypress.io': 'staging',
  'https://docs.cypress.io': 'production',
}

const getNodeEnv = (baseUrl) => {
  return process.env.NODE_ENV || baseUrlEnvMap[baseUrl] || 'development'
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // extract node env from environment variable
  // or base url or set as development by default
  config.env.NODE_ENV = getNodeEnv(config.baseUrl)

  on('task', {
    readFileMaybe (filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8')
      }

      return null
    },
  })

  // we use this to log things to stdout
  // because some of our tests can be very longer
  // and CI exits when the test is longer than 10min
  on('task', {
    log (message) {
      // eslint-disable-next-line no-console
      console.log(message)

      return null
    },
  })

  return config
}
