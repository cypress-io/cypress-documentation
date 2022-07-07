const pluginTemplate = `
import { defineConfig } from 'cypress'
/** replace import **/

export default defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    setupNodeEvents(on, config) {
      /** replace code **/
    }
  }
})
`

export function hydratePluginSample(code: string, importCode?: string) {
  code = `// highlight-start
  ${code}
  // highlight-end
  `

  importCode = importCode ? `// highlight-start
  ${importCode}
  // highlight-end
  ` : ''
  return pluginTemplate.replace('/** replace import **/', importCode).replace('/** replace code **/', code)
}
