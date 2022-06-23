// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/component-testing/component-framework-configuration.mdx",
  from: [
    /<npm-or-yarn>/g,
    /<\/npm-or-yarn>/g,
    /<template #npm>/g,
    /<template #yarn>/g,
    /<\/template>/g,
  ],
  to: [
    "<Tabs>",
    "</Tabs>",
    "<TabItem value='npm'>",
    "<TabItem value='yarn'>",
    "</TabItem>",
  ],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
