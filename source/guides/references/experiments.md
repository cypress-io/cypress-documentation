---
title: Experiments
---

If you'd like to try out what we're working on, you can enable beta features for your project by setting configuration using the options below.

When you open a Cypress project, clicking on the **Settings** tab and clicking into the **Experiments** panel will display the experimental features that are available and whether they are enabled for your project.

Option | Default | Description
----- | ---- | ----
`experimentalGetCookiesSameSite` | `false` | If `true`, Cypress will add `sameSite` values to the objects yielded from {% url "`cy.setCookie()`" setcookie %}, {% url "`cy.getCookie()`" getcookie %}, and {% url "`cy.getCookies()`" getcookies %}. This will become the default behavior in Cypress 5.0.
