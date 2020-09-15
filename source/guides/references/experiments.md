---
title: Experiments
---

If you'd like to try out what we're working on in the {% url "Test Runner" test-runner %}, you can enable beta features for your project by turning on the experimental features you'd like to try.

{% note warning %}
⚠️ The experimental features might change or ultimately be removed without making it into the core product. Our primary goal for experiments is to collect real-world feedback during the development.
{% endnote %}

# Configuration

You can pass the {% url "configuration" configuration %} options below to enable or disable experiments. See our {% url "Configuration Guide" configuration %} on how to pass configuration to Cypress.

Option | Default | Description
----- | ---- | ----
`experimentalComponentTesting` | `false` | Enables component testing using framework-specific adaptors. See {% url "Component Testing" component-testing-introduction %} for more detail.
`experimentalFetchPolyfill` | `false` | Automatically replaces `window.fetch` with a polyfill that Cypress can spy on and stub.
`experimentalSourceRewriting` | `false` | Enables AST-based JS/HTML rewriting. This may fix issues caused by the existing regex-based JS/HTML replacement algorithm. See {% issue 5273 %} for details.
`experimentalNetworkStubbing` | `false` | Enables {% url "`cy.route2`" route2 %}: a new version of the `cy.route` API that works on the HTTP layer, instead of stubbing out XMLHttpRequests. See {% issue 687 %} for details.

