import './defaults'

const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/

Cypress.on('uncaught:exception', (err) => {
  // https://github.com/WICG/ResizeObserver/issues/38
  if (resizeObserverLoopErrRe.test(err.message)) {
    // returning false here prevents Cypress from
    // failing the test
    return false
  }
})
