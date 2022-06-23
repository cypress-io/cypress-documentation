// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  from: [/<NavGuide.*/gms],
  to: [""],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
