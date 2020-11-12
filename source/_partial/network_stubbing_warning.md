{% note danger %}
🚨 Please be aware that `cy.route()` and `cy.server()` only currently support intercepting XMLHttpRequests. **Requests using the Fetch API and other types of network requests like page loads and `<script>` tags will not be intercepted or visible in the Command Log.** You can automatically polyfill `window.fetch` to spy on and stub requests by enabling an [experimental](https://on.cypress.io/experimental) feature `experimentalFetchPolyfill`. See {% issue 95 %} for more details and temporary workarounds.

To intercept requests using the Fetch API and other types of network requests like page loads, try out [cy.http()](/api/commands/http.html).{% endnote %}
