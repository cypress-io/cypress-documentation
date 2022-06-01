const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'ma3dkn',
  retries: {
    runMode: 3,
    openMode: 0,
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.spec.js',
  },
})
