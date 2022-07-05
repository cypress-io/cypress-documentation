"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydratePluginSample = void 0;
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
`;
function hydratePluginSample(code) {
    return pluginTemplate.replace('/** replace **/', code);
}
exports.hydratePluginSample = hydratePluginSample;
