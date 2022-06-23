// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/component-testing/custom-mount-react.mdx",
  from: [
    /<code-group>/g,
    /<\/code-group>/g,
    /<code-block label=/g,
    /<\/code-block>/g,
  ],
  to: ["<Tabs>", "</Tabs>", "<TabItem value=", "</TabItem>"],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
