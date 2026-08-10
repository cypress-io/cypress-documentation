// Wraps an inline third-party script so it does not run under Cypress.
//
// The docs Cypress suite visits every page (see cypress/support/visitAllPages.ts),
// and CI serves a real production build, so NODE_ENV is 'production' and analytics
// inject normally. Cypress also clears storage between tests, so each page visit is
// counted as a brand new visitor. A NODE_ENV check cannot help here; the check has
// to happen in the browser.
//
// Both signals are checked because neither is guaranteed on its own: the user agent
// carries "Cypress/<version>" for the bundled Electron browser, and window.Cypress
// is injected into the application under test.
const IS_AUTOMATION = "navigator.userAgent.includes('Cypress') || window.Cypress"

module.exports = function skipForAutomation(script) {
  return `if (!(${IS_AUTOMATION})) {\n${script}\n}`
}
