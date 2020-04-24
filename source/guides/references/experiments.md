---
title: Experiments
---

If you'd like to try out what we're working on, you can enable beta features for your project by setting configuration using the options below.

{% note warning %}
⚠️ The experimental features might change or ultimately be removed without making it into the core product. Our primary goal for experiments is to collect real-world feedback during the development.
{% endnote %}

When you open a Cypress project, clicking on the **Settings** tab and clicking into the **Experiments** panel will display the experimental features that are available and whether they are enabled for your project.

Option | Default | Description
----- | ---- | ----
`experimentalGetCookiesSameSite` | `false` | If `true`, Cypress will add `sameSite` values to the objects yielded from {% url "`cy.setCookie()`" setcookie %}, {% url "`cy.getCookie()`" getcookie %}, and {% url "`cy.getCookies()`" getcookies %}. This will become the default behavior in Cypress 5.0.
`experimentalComponentTesting` | `false` | When set to `true`, Cypress allows you to execute *component* tests using framework-specific adaptors. By default component specs should be located in `cypress/component` folder, but you can change this setting using `componentFolder` configuration option. For more details see [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test/tree/feature/cypress-mount-mode#readme) and [cypress-vue-unit-test](https://github.com/bahmutov/cypress-vue-unit-test/tree/feature/cypress-mount-mode#readme).
