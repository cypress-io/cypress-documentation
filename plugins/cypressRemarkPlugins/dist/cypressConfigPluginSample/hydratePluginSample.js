"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydratePluginSample = void 0;
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
`;
function hydratePluginSample(code, importCode) {
    return pluginTemplate.replace('/** replace import **/', importCode || '').replace('/** replace code **/', code);
}
exports.hydratePluginSample = hydratePluginSample;
//# sourceMappingURL=hydratePluginSample.js.map