{% note warning %}
⚠️ `cy.route()` and `cy.server()` only support intercepting XMLHttpRequests. Requests using the Fetch API and other types of network requests like page loads and `<script>` tags will not be intercepted by `cy.route()` and `cy.server()`.

**To support requests using the Fetch API you can use one of the solutions below:**

- Use [`cy.intercept()`](/api/commands/intercept.html) which supports requests using the Fetch API and other types of network requests like page loads. See [`cy.intercept()`](/api/commands/intercept.html).
- Polyfill `window.fetch` to spy on and stub requests using `cy.route()` and `cy.server()` by enabling [`experimentalFetchPolyfill`](https://on.cypress.io/experimental). See {% issue 95 %} for more details and temporary workarounds.
{% endnote %}
