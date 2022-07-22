---
title: Experiments
---

If you'd like to try out what we're working on in the
[Cypress App](/guides/core-concepts/cypress-app), you can enable beta features
for your project by turning on the experimental features you'd like to try.

<Alert type="warning">

⚠️ The experimental features might change or ultimately be removed without
making it into the core product. Our primary goal for experiments is to collect
real-world feedback during their development.

</Alert>

## Configuration

You can pass the [Cypress configuration](/guides/references/configuration)
options below to enable or disable experiments. See our
[Configuration Guide](/guides/references/configuration) on how to pass
configuration to Cypress.

| Option                             | Default | Description                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `experimentalFetchPolyfill`        | `false` | Automatically replaces `window.fetch` with a polyfill that Cypress can spy on and stub. Note: `experimentalFetchPolyfill` has been deprecated in Cypress 6.0.0 and will be removed in a future release. Consider using [cy.intercept()](/api/commands/intercept) to intercept `fetch` requests instead.                        |
| `experimentalInteractiveRunEvents` | `false` | Allows listening to the [`before:run`](/api/plugins/before-run-api), [`after:run`](/api/plugins/after-run-api), [`before:spec`](/api/plugins/before-spec-api), and [`after:spec`](/api/plugins/after-spec-api) events in the [setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function during interactive mode. |
| `experimentalSessionAndOrigin`     | `false` | Enables cross-origin and improved session support, including the [`cy.origin()`](/api/commands/origin) and [`cy.session()`](/api/commands/session) commands. Only available in end-to-end testing.                                                                                                                             |
| `experimentalSourceRewriting`      | `false` | Enables AST-based JS/HTML rewriting. This may fix issues caused by the existing regex-based JS/HTML replacement algorithm. See [#5273](https://github.com/cypress-io/cypress/issues/5273) for details.                                                                                                                         |

## History

| Version                                     | Changes                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [9.6.0](/guides/references/changelog#9-6-0) | Added support for `experimentalSessionAndOrigin` and removed `experimentalSessionSupport`.                                   |
| [8.2.0](/guides/references/changelog#8-2-0) | Added support for `experimentalSessionSupport`.                                                                              |
| [7.1.0](/guides/references/changelog#7-1-0) | Added support for `experimentalInteractiveRunEvents`.                                                                        |
| [7.0.0](/guides/references/changelog#7-0-0) | Removed `experimentalComponentTesting` and made it the default behavior.                                                     |
| [6.7.0](/guides/references/changelog#6-7-0) | Removed `experimentalRunEvents` and made it the default behavior.                                                            |
| [6.3.0](/guides/references/changelog#6-3-0) | Added support for `experimentalStudio`.                                                                                      |
| [6.2.0](/guides/references/changelog#6-2-0) | Added support for `experimentalRunEvents`.                                                                                   |
| [6.0.0](/guides/references/changelog#6-0-0) | Removed `experimentalNetworkStubbing` and made it the default behavior when using [cy.intercept()](/api/commands/intercept). |
| [6.0.0](/guides/references/changelog#6-0-0) | Deprecated `experimentalFetchPolyfill`.                                                                                      |
| [5.2.0](/guides/references/changelog#5-2-0) | Removed `experimentalShadowDomSupport` and made it the default behavior.                                                     |
| [5.1.0](/guides/references/changelog#5-1-0) | Added support for `experimentalNetworkStubbing`.                                                                             |
| [5.0.0](/guides/references/changelog#5-0-0) | Removed `experimentalGetCookiesSameSite` and made it the default behavior.                                                   |
| [4.9.0](/guides/references/changelog#4-9-0) | Added support for `experimentalFetchPolyfill`.                                                                               |
| [4.8.0](/guides/references/changelog#4-8-0) | Added support for `experimentalShadowDomSupport`.                                                                            |
| [4.6.0](/guides/references/changelog#4-6-0) | Added support for `experimentalSourceRewriting`.                                                                             |
| [4.5.0](/guides/references/changelog#4-5-0) | Added support for `experimentalComponentTesting`.                                                                            |
| [4.3.0](/guides/references/changelog#4-3-0) | Added support for `experimentalGetCookiesSameSite`.                                                                          |
