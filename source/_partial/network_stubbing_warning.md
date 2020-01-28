{% note danger %}
🚨 Please be aware that Cypress only currently supports intercepting XMLHttpRequests. **Requests using the Fetch API and other types of network requests like page loads and `<script>` tags will not be intercepted or visible in the Command Log.** See {% issue 95 %} for more details and temporary workarounds.
{% endnote %}