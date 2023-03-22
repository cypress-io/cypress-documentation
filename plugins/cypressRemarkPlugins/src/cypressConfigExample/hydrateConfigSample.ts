const pluginTemplate = `
import { defineConfig } from 'cypress'
/** replace import **/

export default defineConfig(/** replace code **/)
`

export function hydrateConfigSample(code: string, importCode?: string) {
  return pluginTemplate
    .replace('/** replace import **/', importCode || '')
    .replace('/** replace code **/', code)
}
