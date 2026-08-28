import { defineConfig } from "cypress";
import { readdirSync, readFileSync } from 'fs'
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
    // The suite visits every docs page against a production build. Block analytics
    // hosts so those crawls do not mint real Pendo, GA4, or FullStory visitors.
    blockHosts: [
      "*googletagmanager.com",
      "*google-analytics.com",
      "*fullstory.com",
      "*pendo.io",
    ],
    setupNodeEvents(on, config) {
      const path = 'docs';

      // A page can pin the route it publishes at with an absolute `slug`, in
      // which case its URL no longer matches where it sits on disk. Read that
      // first so these specs visit what the site actually serves.
      function absoluteSlug(file: string): string | undefined {
        const source = readFileSync(file, 'utf8')
        if (!source.startsWith('---')) {
          return undefined
        }

        const frontmatter = source.slice(3, source.indexOf('\n---', 3))
        const slug = /^slug:\s*(\S+)\s*$/m.exec(frontmatter)?.[1]

        // Relative slugs (the lodash page uses `_`) resolve against the file's
        // own location, so they are left to the path-based logic below.
        return slug?.startsWith('/') ? slug.slice(1) : undefined
      }

      function walk(dir: string): string[] {
        return readdirSync(dir, { withFileTypes: true }).flatMap((file) => {
          // ignore these irrelevant files with no content
          if (file.name.includes('_category_.json') || file.name.includes('.DS_Store')) {
            return []
          }

          if (file.isDirectory()) {
            if(file.name === 'partials') {
              return []
            }
            return walk(join(dir, file.name))
          }

          if (!file.name.endsWith('.mdx')) {
            return []
          }

          const slug = absoluteSlug(join(dir, file.name))
          if (slug) {
            return [slug]
          }

          let name = file.name.slice(0, -4)

          if (name.includes('lodash')) {
            // lodash file actually goes to _ URL
            name = name.replace('lodash', '_')
          }

          // drop the leading `docs/` to leave the published route
          return [join(dir, name).slice(5)]
        })
      }

      const URLs = walk(path)

      config.expose = config.expose || {}
      config.expose.URLs = URLs

      config.expose.limitPerSection = Number(config.env.limitPerSection) || 0

      return config
    },
  },
})
