module.exports.ALLOWED_TEST_CONFIG = 
`{% fa fa-exclamation-triangle red %} **Note:** Some configuration values are readonly and cannot be changed via test configuration. The following configuration values **can be changed** via per test configuration:

- \`animationDistanceThreshold\`
- \`baseUrl\`
- \`browser\` **note:** filters whether the tests or a suite of tests runs depending on the current browser
- \`defaultCommandTimeout\`
- \`execTimeout\`
- \`env\` **note:** Provided environment variables will be merged with current environment variables.
- \`includeShadowDom\`
- \`requestTimeout\`
- \`responseTimeout\`
- \`retries\`
- \`viewportHeight\`
- \`viewportWidth\`
- \`waitForAnimations\`
`

module.exports.CHROMIUM_DOWNLOAD =
`### Download specific Chrome version

The Chrome browser is evergreen - meaning it will automatically update itself, sometimes causing a breaking change in your automated tests. We host [chromium.cypress.io](https://chromium.cypress.io) with links to download a specific released version of Chrome (dev, Canary and stable) for every platform. 
`

module.exports.CYPRESS_ENV_VAR_WARNING =
`{% note warning "Difference between OS-level and Cypress environment variables" %}
In Cypress, "environment variables" are variables that are accessible via \`Cypress.env\`. These are not the same as OS-level environment variables. However, [it is possible to set Cypress environment variables from OS-level environment variables](/guides/guides/environment-variables.html#Option-3-CYPRESS).
{% endnote %}
`

module.exports.ERRORS_ANATOMY =
`1. **Error name**: This is the type of the error (e.g. AssertionError, CypressError)
1. **Error message**: This generally tells you what went wrong. It can vary in length. Some are short like in the example, while some are long, and may tell you exactly how to fix the error. Some also contain a **Learn more** link that will take you to relevant Cypress documentation.
1. **Learn more:** Some error messages contain a Learn more link that will take you to relevant Cypress documentation.
1. **Code frame file**: This is usually the top line of the stack trace and it shows the file, line number, and column number that is highlighted in the code frame below. Clicking on this link will open the file in your  [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference) and highlight the line and column in editors that support it.
1. **Code frame**: This shows a snippet of code where the failure occurred, with the relevant line and column highlighted.
1. **View stack trace**: Clicking this toggles the visibility of the stack trace. Stack traces vary in length. Clicking on a blue file path will open the file in your [preferred file opener](https://on.cypress.io/IDE-integration#File-Opener-Preference).
1. **Print to console button**: Click this to print the full error to your DevTools console. This will usually allow you to click on lines in the stack trace and open files in your DevTools.

{% imgTag /img/guides/command-failure-error.png "example command failure error" %}
`

module.exports.LINUX_DEPENDENCIES = [
"#### Ubuntu/Debian",
"",
"```shell",
"apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb",
"```",
"",
"#### CentOS",
"",
"```shell",
"yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib",
"```",
].join("\n")

module.exports.NETWORK_STUBBING_WARNING =
`{% note danger %}
🚨 Please be aware that Cypress only currently supports intercepting XMLHttpRequests. **Requests using the Fetch API and other types of network requests like page loads and \`<script>\` tags will not be intercepted or visible in the Command Log.** You can automatically polyfill \`window.fetch\` to spy on and stub requests by enabling an [experimental](https://on.cypress.io/experimental) feature \`experimentalFetchPolyfill\`. See {% issue 95 %} for more details and temporary workarounds.

Cypress also has a new experimental [route2](/api/commands/route2.html) feature that supports requests using the Fetch API and other types of network requests like page loads. For more information, check out the [cy.route2() documentation](/api/commands/route2.html).
{% endnote %}
`

module.exports.THEN_SHOULD_DIFFERENCE = [
"### What's the difference between `.then()` and `.should()`/`.and()`?",
"",
"Using `.then()` allows you to use the yielded subject in a callback function and should be used when you need to manipulate some values or do some actions.",
"",
"When using a callback function with `.should()` or `.and()`, on the other hand, there is special logic to rerun the callback function until no assertions throw within it. You should be careful of side affects in a `.should()` or `.and()` callback function that you would not want performed multiple times.",
].join('\n')

module.exports.VPN_ALLOWED_LIST =
`To send the data and results of your tests to the [Dashboard](https://on.cypress.io/dashboard-introduction), Cypress needs free access to some URLs.

If you are running the tests from within a restrictive VPN you will need to allow some URLs so that Cypress can have effective communication with the Dashboard.

**The URLs are the following:**

- \`https://api.cypress.io\` - **Cypress API**
- \`https://assets.cypress.io\` - **Asset CDN** (Org logos, icons, videos, screenshots, etc.)
- \`https://authenticate.cypress.io\` - **Authentication API**
- \`https://dashboard.cypress.io\` - **Dashboard app**
- \`https://docs.cypress.io\` - **Cypress documentation**
- \`https://download.cypress.io\` - **CDN download of Cypress binary**
- \`https://on.cypress.io\` - **URL shortener for link redirects**
`

module.exports.XHR_STUBBING_DEPRECATED = [
"{% note warning %}",
"⚠️ **`cy.server()` and `cy.route()` are deprecated in Cypress 6.0.0**. In a future release, support for `cy.server()` and `cy.route()` will be moved to a plugin. Consider using [`cy.intercept()`](/api/commands/intercept.html) instead.",
"{% endnote %}",
].join('\n')