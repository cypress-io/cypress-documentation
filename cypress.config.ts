import { defineConfig } from "cypress";
import { readdirSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  projectId: 'imown1',
  viewportHeight: 800,
  viewportWidth: 1200,
  experimentalMemoryManagement: true,
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        "createFileTree"({ path }) {
          // take the given path and create an array of all file paths
          // with each files and the directory path of the file as strings
          // for example: given 'accessibility' return
          // ['accessibility/get-started/introduction', 'accessibility/core-concepts/how-it-works']
          path = 'docs/' + path;

          function walk(dir: string): string[] {
            return readdirSync(dir, { withFileTypes: true }).flatMap((file) => {
              if (file.name.includes('_category_.json') || file.name.includes('.DS_Store')) {
                return []
              }

              if (file.name.includes('.mdx')) {
                // remove the .mdx file extension
                file.name = file.name.slice(0, -4)
              }

              if (file.isDirectory()) {
                return walk(join(dir, file.name))
              } else {
                return [join(dir, file.name)]
              }
            })
          }

          return walk(path).filter((file) => file !== undefined).map((file) => file.slice(5))
        }
      })
      }
    },
});
