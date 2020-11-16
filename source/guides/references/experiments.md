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

{% history %}
{% url "6.0.0" changelog#6-0-0 %} | Removed `experimentalNetworkStubbing` and made it the default behavior.
{% url "5.2.0" changelog#5-2-0 %} | Removed `experimentalShadowDomSupport` and made it the default behavior.
{% url "5.1.0" changelog#5-1-0 %} | Added support for `experimentalNetworkStubbing`.
{% url "5.0.0" changelog#5-0-0 %} | Removed `experimentalGetCookiesSameSite` and made it the default behavior.
{% url "4.9.0" changelog#4-9-0 %} | Added support for `experimentalFetchPolyfill`.
{% url "4.8.0" changelog#4-8-0 %} | Added support for `experimentalShadowDomSupport`.
{% url "4.6.0" changelog#4-6-0 %} | Added support for `experimentalSourceRewriting`.
{% url "4.5.0" changelog#4-5-0 %} | Added support for `experimentalComponentTesting`.
{% url "4.3.0" changelog#4-3-0 %} | Added support for `experimentalGetCookiesSameSite`.
{% endhistory %}
