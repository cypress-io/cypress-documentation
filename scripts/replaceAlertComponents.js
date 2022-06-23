// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/getting-started/installing-cypress.mdx",
  from: [
    /<Alert type="info">/g,
    /<Alert type="success">/g,
    /<Alert type="warning">/g,
    /<Alert type="danger">/g,
    /<Alert type="bolt">/g,
    /<\/Alert>/g,
  ],
  to: [":::info", ":::tip", ":::caution", ":::danger", ":::note", ":::"],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
