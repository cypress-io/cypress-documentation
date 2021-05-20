---
title: Web Security
---

Browsers adhere to a strict [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). This means that browsers restrict access between `<iframes>` when their origin policies do not match.

Because Cypress works from within the browser, Cypress must be able to directly communicate with your remote application at all times. Unfortunately, browsers naturally try to prevent Cypress from doing this.

To get around these restrictions, Cypress implements some strategies involving JavaScript code, the browser's internal APIs, and network proxying to _play by the rules_ of same-origin policy. It is our goal to fully automate the application under test without you needing to modify your application's code - and we are _mostly_ able to do this.

#### Examples of what Cypress does under the hood:

- Injects [`document.domain`](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain) into `text/html` pages.
- Proxies all HTTP / HTTPS traffic.
- Changes the hosted URL to match that of the application under test.
- Uses the browser's internal APIs for network level traffic.

When Cypress first loads, the internal Cypress web application is hosted on a random port: something like `http://localhost:65874/__/`.

After the first [`cy.visit()`](/api/commands/visit) command is issued in a test, Cypress changes its URL to match the origin of your remote application, thereby solving the first major hurdle of same-origin policy. Your application's code executes the same as it does outside of Cypress, and everything works as expected.

<Alert type="info">

<strong class="alert-header">How is HTTPS supported?</strong>

Cypress does some pretty interesting things under the hood to make testing HTTPS sites work. Cypress enables you to control and stub at the network level. Therefore, Cypress must assign and manage browser certificates to be able to modify the traffic in real time.

You'll notice Chrome display a warning that the 'SSL certificate does not match'. This is normal and correct. Under the hood we act as our own CA authority and issue certificates dynamically in order to intercept requests otherwise impossible to access. We only do this for the superdomain currently under test, and bypass other traffic. That's why if you open a tab in Cypress to another host, the certificates match as expected.

</Alert>

## Limitations

It's important to note that although we do our **very best** to ensure your application works normally inside of Cypress, there _are_ some limitations you need to be aware of.

### Same superdomain per test

Because Cypress changes its own host URL to match that of your applications, it requires that the URLs navigated to have the same superdomain for the entirety of a single test.

If you attempt to visit two different superdomains, Cypress will error. Visiting subdomains works fine. You can visit different superdomains in _different_ tests, but not in the _same_ test.

```javascript
it('navigates', () => {
  cy.visit('https://www.cypress.io')
  cy.visit('https://docs.cypress.io') // yup all good
})
```

```javascript
it('navigates', () => {
  cy.visit('https://apple.com')
  cy.visit('https://google.com') // this will error
})
```

```javascript
it('navigates', () => {
  cy.visit('https://apple.com')
})

// split visiting different origin in another test
it('navigates to new origin', () => {
  cy.visit('https://google.com') // yup all good
})
```

Although Cypress tries to enforce this limitation, it is possible for your application to bypass Cypress's ability to detect this.

#### Examples of test cases that will error due to superdomain limitations

1. [`.click()`](/api/commands/click) an `<a>` with an `href` to a different superdomain.
2. [`.submit()`](/api/commands/submit) a `<form>` that causes your web server to redirect to you a different superdomain.
3. Issue a JavaScript redirect in your application, such as `window.location.href = '...'`, to a different superdomain.

In each of these situations, Cypress will lose the ability to automate your application and will immediately error.

Read on to learn about [working around these common problems](/guides/guides/web-security#Common-Workarounds) or even [disabling web security](/guides/guides/web-security#Disabling-Web-Security) altogether.

### Cross-origin iframes

If your site embeds an `<iframe>` that is a cross-origin frame, Cypress will not be able to automate or communicate with this `<iframe>`.

#### Examples of uses for cross-origin iframes

- Embedding a Vimeo or YouTube video.
- Displaying a credit card form from Stripe or Braintree.
- Displaying an embedded login form from Auth0.
- Showing comments from Disqus.

It's actually _possible_ for Cypress to accommodate these situations the same way Selenium does, but you will never have _native_ access to these iframes from inside of Cypress.

As a workaround, you may be able to use [`window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to directly communicate with these iframes and control them (if the 3rd party iframe supports it).

Other than that, you'll have to wait for us to implement APIs to support this (check our [open issue](https://github.com/cypress-io/cypress/issues/136)), or you can [disable web security](/guides/guides/web-security#Disabling-Web-Security).

### Insecure Content

Because of the way Cypress is designed, if you are testing an HTTPS site, Cypress will error anytime you attempt to navigate back to an HTTP site. This behavior helps highlight a _pretty serious security problem_ with your application.

#### Example of accessing insecure content

```javascript
// Test code
cy.visit('https://app.corp.com')
```

In your application code, you set `cookies` and store a session on the browser. Now let's imagine you have a single `insecure` link (or JavaScript redirect) in your application code.

```html
<!-- Application code -->
<html>
  <a href="http://app.corp.com/page2">Page 2</a>
</html>
```

Cypress will immediately fail with the following test code:

```javascript
// Test code
cy.visit('https://app.corp.com')
cy.get('a').click() // will fail
```

Browsers refuse to display insecure content on a secure page. Because Cypress initially changed its URL to match `https://app.corp.com` when the browser followed the `href` to `http://app.corp.com/page2`, the browser will refuse to display the contents.

Now you may be thinking, _This sounds like a problem with Cypress because when I work with my application outside of Cypress it works just fine._

However, the truth is, Cypress is exposing a _security vulnerability_ in your application, and you _want_ it to fail in Cypress.

`cookies` that do not have their `secure` flag set to `true` will be sent as clear text to the insecure URL. This leaves your application vulnerable to session hijacking.

This security vulnerability exists **even if** your web server forces a `301 redirect` back to the HTTPS site. The original HTTP request was still made once, exposing insecure session information.

#### The solution

Update your HTML or JavaScript code to not navigate to an insecure HTTP page and instead only use HTTPS. Additionally make sure that cookies have their `secure` flag set to `true`.

If you're in a situation where you don't control the code, or otherwise cannot work around this, you can bypass this restriction in Cypress by [disabling web security](/guides/guides/web-security#Disabling-Web-Security).

### Same port per test

Cypress requires that the URLs navigated to have the same port (if specified) for the entirety of a single test. This matches the behavior of the browser's normal [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

## Common Workarounds

Let's investigate how you might encounter cross-origin errors in your test code and break down how to work around them in Cypress.

### External Navigation

The most common situation where you might encounter this error is when you click on an `<a>` that navigates to another superdomain.

```html
<!-- Application code that is served at `localhost:8080` -->
<html>
  <a href="https://google.com">Google</a>
</html>
```

```javascript
// Test code
cy.visit('http://localhost:8080') // where your web server + HTML is hosted
cy.get('a').click() // browser attempts to load google.com, Cypress errors
```

We do not recommend visiting a superdomain that you don't control in your tests which you can read more about [here](/guides/references/best-practices#Visiting-external-sites)

Instead, all you can test is that the `href` property is correct!

```javascript
// this test verifies the behavior and will run considerably faster
cy.visit('http://localhost:8080')
cy.get('a').should('have.attr', 'href', 'https://google.com') // no page load!
```

Okay but let's say you're worried about `google.com` serving up the right HTML content. How would you test that? We can make a [`cy.request()`](/api/commands/request) directly to it. [`cy.request()`](/api/commands/request) is _NOT bound to CORS or same-origin policy_.

```javascript
cy.visit('http://localhost:8080')
cy.get('a').then(($a) => {
  // pull off the fully qualified href from the <a>
  const url = $a.prop('href')

  // make a cy.request to it
  cy.request(url).its('body').should('include', '</html>')
})
```

If you still require visiting a different origin URL then read about [disabling web security](/guides/guides/web-security#Disabling-Web-Security).

### Form Submission Redirects

When you submit a regular HTML form, the browser will follow the HTTP(s) request.

```html
<!-- Application code that is served at `localhost:8080`-->
<html>
  <form method="POST" action="/submit">
    <input type="text" name="email" />
    <input type="submit" value="Submit" />
  </form>
</html>
```

```javascript
cy.visit('http://localhost:8080')
cy.get('form').submit() // submit the form!
```

If your back end server handling the `/submit` route does a `30x` redirect to a different superdomain, you will get a cross-origin error.

```javascript
// imagine this is some node / express code
// on your localhost:8080 server

app.post('/submit', (req, res) => {
  // redirect the browser to google.com
  res.redirect('https://google.com')
})
```

A common use case for this is Single sign-on (SSO). In that situation you may `POST` to a different server and are redirected elsewhere (typically with the session token in the URL).

If that's the case, you can still test this behavior with [`cy.request()`](/api/commands/request). [`cy.request()`](/api/commands/request) is **NOT bound to CORS or same-origin policy**.

In fact we can likely bypass the initial visit altogether and `POST` directly to your SSO server.

```javascript
cy.request('POST', 'https://sso.corp.com/auth', {
  username: 'foo',
  password: 'bar',
}).then((response) => {
  // pull out the location redirect
  const loc = response.headers['Location']

  // parse out the token from the url (assuming its in there)
  const token = parseOutMyToken(loc)

  // do something with the token that your web application expects
  // likely the same behavior as what your SSO does under the hood
  // assuming it handles query string tokens like this
  cy.visit('http://localhost:8080?token=' + token)

  // if you don't need to work with the token you can sometimes
  // visit the location header directly
  cy.visit(loc)
})
```

If you still want to be able to be redirected to your SSO server, you can read about [disabling web security](/guides/guides/web-security#Disabling-Web-Security).

### JavaScript Redirects

When we say JavaScript Redirects we are talking about any kind of code that does something like this:

```javascript
window.location.href = 'http://some.superdomain.com'
```

This is probably the hardest situation to test because it's usually happening due to another cause. You will need to figure out why your JavaScript code is redirecting. Perhaps you're not logged in, and you need to handle that setup elsewhere. Perhaps you're using a Single sign-on (SSO) server and you can read the previous section about working around that.

If you want to continue using the code to navigate to a different superdomain, then you might want to read about [disabling web security](/guides/guides/web-security#Disabling-Web-Security).

## Disabling Web Security

So if you cannot work around any of the issues using the suggested workarounds above, you may want to disable web security.

One last thing to consider here is that every once in a while we discover bugs in Cypress that lead to cross-origin errors that can otherwise be fixed. If you think you're experiencing a bug, [open an issue](https://github.com/cypress-io/cypress/issues/new/choose).

<Alert type="warning">

<strong class="alert-header">Chrome only</strong>

Disabling web security is only supported in Chrome-based browsers. Settings in `chromeWebSecurity` will have no effect in other browsers. We will log a warning in this case.

<DocsImage src="/img/guides/chrome-web-security-stdout-warning.jpg" alt='chromeWebSecurity warning in stdout'></DocsImage>

If you rely on disabling web security, you will not be able to run tests on browsers that do not support this feature.

</Alert>

### Set `chromeWebSecurity` to `false`

Setting `chromeWebSecurity` to `false` in Chrome-based browsers allows you to do the following:

- Display insecure content
- Navigate to any superdomain without cross-origin errors
- Access cross-origin iframes that are embedded in your application

One thing you may notice though is that Cypress still enforces visiting a single superdomain with [`cy.visit()`](/api/commands/visit), but there is an [issue open](https://github.com/cypress-io/cypress/issues/944) to change this restriction.

Still here? That's cool, let's disable web security!

#### Set `chromeWebSecurity` to `false` in your [configuration file (`cypress.json` by default)](/guides/references/configuration)

```json
{
  "chromeWebSecurity": false
}
```
