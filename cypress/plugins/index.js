// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

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

  return config
}
