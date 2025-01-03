import { defineConfig } from "cypress";
import { readdirSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  projectId: 'imown1',
  fixturesFolder: false,
  viewportHeight: 800,
  viewportWidth: 1200,
  experimentalMemoryManagement: true,
  e2e: {
    supportFile: false,
    baseUrl: "http://localhost:3000",
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

      config.env.URLs = URLs

      return config
    },
  },
})
