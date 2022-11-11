// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/core-concepts/cypress-app.mdx",
  from: [
    /<code-group-react-vue>/g,
    /<\/code-group-react-vue>/g,
    /<template #react>/g,
    /<template #react-alert>/g,
    /<template vue>/g,
    /<template vue-alert>/g,
    /<\/template>/g,
  ],
  to: [
    "<Tabs>",
    "</Tabs>",
    "<TabItem value='React'>",
    "<TabItem value='React'>",
    "<TabItem value='Vue'>",
    "<TabItem value='Vue'>",
    "</TabItem>",
  ],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
