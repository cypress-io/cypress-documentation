#!/bin/bash

node ./scripts/convertToMDX.js &&
node ./scripts/replaceAlertComponents.js &&
node ./scripts/replaceCodeGroupComponents.js &&
node ./scripts/replaceCodeGroupNPMYarn.js &&
node ./scripts/replaceCodeGroupReactVue.js &&
node ./scripts/replaceCodeGroupReactVue2Vue3.js &&
node ./scripts/replaceCypressConfigFileTabs.js &&
node ./scripts/replaceIncludePartials.js &&
node ./scripts/removeNavGuideComponents.js &&
node ./scripts/lowercaseInternalLinks.js
