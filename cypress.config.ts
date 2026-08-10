import { defineConfig } from "cypress";
import { readdirSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  projectId: 'imown1',
  allowCypressEnv: false,
  fixturesFolder: false,
  viewportHeight: 800,
  viewportWidth: 1200,
  experimentalMemoryManagement: true,
  experimentalFastVisibility: true,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    baseUrl: "http://localhost:3000",
    // Defense in depth for third-party tracking. `plugins/analytics-env.js`
    // already keeps these scripts out of every non-production build, so nothing
    // here should fire — this is the net that catches a tag added to the Google
    // Tag Manager container (which is configured outside this repo) or a
    // regression in that gate. Blocked requests get an immediate 503, so they
    // cost the suite nothing.
    //
    // Host only, no protocol. `*host` — not `*.host` — so the bare apex domain
    // matches too. See /app/references/configuration#blockHosts.
    //
    // Osano is deliberately absent: it's the consent manager, osano.cy.ts
    // asserts on the real banner, and cypress/support/e2e.ts stubs it for
    // every other spec.
    blockHosts: [
      '*pendo.io',
      '*googletagmanager.com',
      '*google-analytics.com',
      '*fullstory.com',
    ],
    setupNodeEvents(on, config) {
      const path = 'docs';

      function walk(dir: string): string[] {
        return readdirSync(dir, { withFileTypes: true }).flatMap((file) => {
          // ignore these irrelevant files with no content
          if (file.name.includes('_category_.json') || file.name.includes('.DS_Store')) {
            return []
          }

          if (file.name.includes('lodash')) {
            // lodash file actually goes to _ URL
            file.name = file.name.replace('lodash', '_')
          }

          if (file.name.includes('.mdx')) {
            // remove the .mdx file extension
            file.name = file.name.slice(0, -4)
          }

          if (file.isDirectory()) {
            if(file.name === 'partials') {
              return []
            }
            return walk(join(dir, file.name))
          } else {
            return [join(dir, file.name)]
          }
        })
      }

      const URLs = walk(path).filter((file) => file !== undefined).map((file) => file.slice(5))

      config.expose = config.expose || {}
      config.expose.URLs = URLs

      config.expose.limitPerSection = Number(config.env.limitPerSection) || 0

      return config
    },
  },
})
