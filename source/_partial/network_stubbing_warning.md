{% note danger %}
🚨 Please be aware that Cypress only currently supports intercepting XMLHttpRequests. **Requests using the Fetch API and other types of network requests like page loads and `<script>` tags will not be intercepted or visible in the Command Log.** You can automatically polyfill `window.fetch` to spy on and stub requests by enabling an [experimental](https://on.cypress.io/experimental) feature `experimentalFetchPolyfill`. See {% issue 95 %} for more details and temporary workarounds.

Cypress also has a new experimental [route2](/api/commands/route2.html) feature that supports requests using the Fetch API and other types of network requests like page loads. For more information, check out the [route2 documentation](/api/commands/route2.html).{% endnote %}
{% endnote %}
