const pluginTemplate = `
import { defineConfig } from 'cypress'

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      /** replace **/
    }
  }
})
`

export function hydratePluginSample(code: string) {
  return pluginTemplate.replace('/** replace **/', code)
}
