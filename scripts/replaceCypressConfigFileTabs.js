// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/component-testing/component-framework-configuration.mdx",
  from: [
    /<cypress-config-file>/g,
    /<\/cypress-config-file>/g,
    /<template #js>/g,
    /<template #ts>/g,
    /<\/template>/g,
  ],
  to: [
    "<Tabs>",
    "</Tabs>",
    "<TabItem value='cypress.config.js'>",
    "<TabItem value='cypress.config.ts'>",
    "</TabItem>",
  ],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
