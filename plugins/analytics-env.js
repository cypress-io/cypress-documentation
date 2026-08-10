/**
 * Decides whether third-party analytics/tracking scripts should be injected.
 *
 * `docusaurus build` always sets `NODE_ENV=production`, so `NODE_ENV` alone
 * cannot tell the real docs.cypress.io deploy apart from:
 *
 *   - a local `npm run build && npm run serve` on http://localhost:3000
 *   - the CI job that builds and serves the site for the Cypress e2e specs
 *   - a Netlify deploy preview or branch deploy
 *
 * All of those load the Google Tag Manager container (and everything it fires,
 * such as Pendo), which pollutes analytics with traffic that isn't real users.
 * Hosting platforms do expose the deploy context, so use that instead and fail
 * closed — an unknown environment gets no tracking.
 */

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {boolean}
 */
function isProductionDeploy(env = process.env) {
  // Escape hatch, e.g. to verify a tracking change on a preview build.
  if (env.ANALYTICS_ENABLED === 'true') {
    return true
  }
  if (env.ANALYTICS_ENABLED === 'false') {
    return false
  }

  // The dev server (`npm run start`) is never production.
  if (env.NODE_ENV !== 'production') {
    return false
  }

  // Netlify sets CONTEXT on every build:
  // 'production' | 'deploy-preview' | 'branch-deploy' | 'dev'
  if (env.CONTEXT) {
    return env.CONTEXT === 'production'
  }

  // Vercel sets VERCEL_ENV: 'production' | 'preview' | 'development'
  if (env.VERCEL_ENV) {
    return env.VERCEL_ENV === 'production'
  }

  // Local production build, CI, or anything else we can't identify.
  return false
}

module.exports = { isProductionDeploy }
