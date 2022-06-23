// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/core-concepts/cypress-app.mdx",
  from: [
    /<code-group-react-vue2-vue3>/g,
    /<\/code-group-react-vue2-vue3>/g,
    /<template #react>/g,
    /<template #vue2>/g,
    /<template #vue3>/g,
    /<\/template>/g,
  ],
  to: [
    "<Tabs>",
    "</Tabs>",
    "<TabItem value='React'>",
    "<TabItem value='Vue 2'>",
    "<TabItem value='Vue 3'>",
    "</TabItem>",
  ],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
