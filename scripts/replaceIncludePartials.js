// https://www.npmjs.com/package/replace-in-file
const replace = require("replace-in-file");

const options = {
  files: "./docs/**/*.mdx",
  // files: "./docs/component-testing/component-framework-configuration.mdx",
  from: [
    /::include{file=partials\/anatomy-of-an-error.md}/g,
    /::include{file=partials\/CtBetaAlert.md}/g,
    /::include{file=partials\/default-selector-priority.md}/g,
    /::include{file=partials\/import-mount-functions.md}/g,
    /::include{file=partials\/intellisense-code-completion.md}/g,
    /::include{file=partials\/single-domain-workaround.md}/g,
    /::include{file=partials\/support-file-configuration.md}/g,
    /::include{file=partials\/then-should-and-difference.md}/g,
    /::include{file=partials\/warning-plugins-file.md}/g,
    /::include{file=partials\/warning-setup-node-events.md}/g,
  ],
  to: [
    "<AnatomyOfAnError />",
    "<CtBetaAlert />",
    "<DefaultSelectorPriority />",
    "<ImportMountFunctions />",
    "<IntellisenseCodeCompletion />",
    "<SingleDomainWorkaround />",
    "<SupportFileConfiguration />",
    "<ThenShouldAndDifference />",
    "<WarningPluginsFile />",
    "<WarningSetupNodeEvents />",
  ],
};

try {
  const results = replace.sync(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
}
