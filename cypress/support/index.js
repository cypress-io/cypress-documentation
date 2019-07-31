/// <reference types="cypress" />
import './defaults'

const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/

// a couple of shortcuts to check which environment we are running in

Cypress.isDevelopment = () => Cypress.env('NODE_ENV') === 'development'

Cypress.isStaging = () => Cypress.env('NODE_ENV') === 'staging'

Cypress.isProduction = () => Cypress.env('NODE_ENV') === 'production'

Cypress.is = (envName) => Cypress.env('NODE_ENV') === envName

Cypress.on('uncaught:exception', (err) => {
  // https://github.com/WICG/ResizeObserver/issues/38
  if (resizeObserverLoopErrRe.test(err.message)) {
    // returning false here prevents Cypress from
    // failing the test
    return false
  }
})
