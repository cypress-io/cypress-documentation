const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'ma3dkn',
  retries: {
    runMode: 3,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents() {},
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.spec.js',
  },
})
