---
title: Network Requests
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How Cypress enables you to stub out the back end with {% url `cy.intercept()` intercept %}
- What tradeoffs we make when we stub our network requests
- How Cypress visualizes network management in the Command Log
- How to use Aliases to refer back to requests and wait on them
- How to write declarative tests that resist flake
{% endnote %}

{% note info %}
**Note:** If you're looking for a resource to make an HTTP request take a look at {% url "`cy.request()`" request %}
{% endnote %}
# Testing Strategies

Cypress helps you test the entire lifecycle of HTTP requests within your application. Cypress provides you access to the objects with information about the request, enabling you to make assertions about its properties. Additionally you can even stub and mock a request's response.

***Common testing scenarios:***

- Asserting on a request's body
- Asserting on a request's url
- Asserting on a request's headers
- Stubbing a response's body
- Stubbing a response's status code
- Stubbing a response's headers
- Delaying a response
- Waiting for a response to happen

Within Cypress, you have the ability to choose whether to stub responses or allow them to actually hit your server. You can also mix and match within the same test by choosing to stub certain requests, while allowing others to hit your server.

Let's investigate both strategies, why you would use one versus the other, and why you should regularly use both.

## Use Server Responses

Requests that are not stubbed actually reach your server. By *not* stubbing your responses, you are writing true *end-to-end* tests. This means you are driving your application the same way a real user would.

> When requests are not stubbed, this guarantees that the *contract* between your client and server is working correctly.

In other words, you can have confidence your server is sending the correct data in the correct structure to your client to consume. It is a good idea to have *end-to-end* tests around your application's *critical paths*. These typically include user login, signup, or other critical paths such as billing.

***There are downsides to not stubbing responses you should be aware of:***

- Since no responses are stubbed, that means **your server has to actually send real responses**. This can be problematic because you may have to *seed a database* before every test to generate state. For instance, if you were testing *pagination*, you'd have to seed the database with every object that it takes to replicate this feature in your application.
- Since real responses go through every single layer of your server (controllers, models, views, etc) the tests are often **much slower** than stubbed responses.

If you are writing a traditional server-side application where most of the responses are HTML you will likely have few stubbed responses. However, most modern applications that serve JSON can take advantage of stubbing.

{% note success Benefits %}
- More likely to work in production
- Test coverage around server endpoints
- Great for traditional server-side HTML rendering
{% endnote %}

{% note danger Downsides %}
- Requires seeding data
- Much slower
- Harder to test edge cases
{% endnote %}

{% note info Suggested Use %}
- Use sparingly
- Great for the *critical paths* of your application
- Helpful to have one test around the *happy path* of a feature
{% endnote %}

## Stub Responses

Stubbing responses enables you to control every aspect of the response, including the response `body`, the `status`, `headers`, and even network `delay`. Stubbing is extremely fast, most responses will be returned in less than 20ms.

> Stubbing responses is a great way to control the data that is returned to your client.

You don't have to do any work on the server. Your application will have no idea its requests are being stubbed, so there are *no code changes* needed.

{% note success Benefits %}
- Control of response bodies, status, and headers
- Can force responses to take longer to simulate network delay
- No code changes to your server or client code
- Fast, < 20ms response times
{% endnote %}

{% note danger Downsides %}
- No guarantee your stubbed responses match the actual data the server sends
- No test coverage on some server endpoints
- Not as useful if you're using traditional server side HTML rendering
{% endnote %}

{% note info Suggested Use %}
- Use for the vast majority of tests
- Mix and match, typically have one true end-to-end test, and then stub the rest
- Perfect for JSON APIs
{% endnote %}

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example

The Cypress {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} end-to-end tests predominately rely on server responses, and only stub network responses {% url "on a few occasions" https://github.com/cypress-io/cypress-realworld-app/blob/07a6483dfe7ee44823380832b0b23a4dacd72504/cypress/tests/ui/notifications.spec.ts#L250-L264 %} to conveniently **create edge-case** or **hard-to-create application states**.

This practice allows the project to achieve full {% url code-coverage code-coverage %} for the front end *and back end* of the app, but this has also required creating intricate database seeding or test data factory scripts that can generate appropriate data in compliance with the business-logic of the app.

Check out any of the {% url "Real World App test suites" https://github.com/cypress-io/cypress-realworld-app/tree/develop/cypress/tests/ui %} to see Cypress network handling in action.

{% endnote %}

# Stubbing

Cypress enables you to stub a response and control the `body`, `status`, `headers`, or even delay.

{% url `cy.intercept()` intercept %} is used to control the behavior of HTTP requests. You can statically define the body, HTTP status code, headers, and other response characteristics.

{% note info %}
See {% url '`cy.intercept()`' intercept %} for more information and for examples on stubbing responses.
{% endnote %}

# Routing

```javascript
cy.intercept(
  {
    method: 'GET',      // Route all GET requests
    url: '/users/*',    // that have a URL that matches '/users/*'
  },
  [] // and force the response to be: []
)
```

When you use {% url `cy.intercept()` intercept %} to define a route, Cypress displays this under "Routes" in the Command Log.

{% imgTag /img/guides/server-routing-table.png "Routing Table" %}

When a new test runs, Cypress will restore the default behavior and remove all routes and stubs. For a complete reference of the API and options, refer to the documentation for {% url `cy.intercept()` intercept %}.

# Fixtures

A fixture is a fixed set of data located in a file that is used in your tests. The purpose of a test fixture is to ensure that there is a well known and fixed environment in which tests are run so that results are repeatable. Fixtures are accessed within tests by calling the {% url `cy.fixture()` fixture %} command.

With Cypress, you can stub network requests and have it respond instantly with fixture data.

When stubbing a response, you typically need to manage potentially large and complex JSON objects. Cypress allows you to integrate fixture syntax directly into responses.

```javascript
// we set the response to be the activites.json fixture
cy.intercept('GET', 'activities/*', { fixture: 'activities.json' })
```

## Organizing

Cypress automatically scaffolds out a suggested folder structure for organizing your fixtures on every new project. By default it will create an `example.json` file when you add your project to Cypress.

```text
/cypress/fixtures/example.json
```

Your fixtures can be further organized within additional folders. For instance, you could create another folder called `images` and add images:

```text
/cypress/fixtures/images/cats.png
/cypress/fixtures/images/dogs.png
/cypress/fixtures/images/birds.png
```

To access the fixtures nested within the `images` folder, include the folder in your {% url `cy.fixture()` fixture %} command.

```javascript
cy.fixture('images/dogs.png') // yields dogs.png as Base64
```

# Waiting

Whether or not you choose to stub responses, Cypress enables you to declaratively {% url `cy.wait()` wait %} for requests and their responses.

{% note info %}
This following section utilizes a concept known as {% url 'Aliasing' variables-and-aliases %}. If you're new to Cypress you might want to check that out first.
{% endnote %}

Here is an example of aliasing requests and then subsequently waiting on them:

```javascript
cy.intercept('activities/*', { fixture: 'activities' }).as('getActivities')
cy.intercept('messages/*', { fixture: 'messages' }).as('getMessages')

// visit the dashboard, which should make requests that match
// the two routes above
cy.visit('http://localhost:8888/dashboard')

// pass an array of Route Aliases that forces Cypress to wait
// until it sees a response for each request that matches
// each of these aliases
cy.wait(['@getActivities', '@getMessages'])

// these commands will not run until the wait command resolves above
cy.get('h1').should('contain', 'Dashboard')
```

If you would like to check the response data of each response of an aliased route, you can use several `cy.wait()` calls.

```javascript
cy.intercept({
  method: 'POST',
  url: '/myApi',
}).as('apiCheck')

cy.visit('/')
cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '1st API call has data')
})

cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '2nd API call has data')
})

cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '3rd API call has data')
})
```

Waiting on an aliased route has big advantages:

1. Tests are more robust with much less flake.
2. Failure messages are much more precise.
3. You can assert about the underlying request object.

Let's investigate each benefit.

## Flake

One advantage of declaratively waiting for responses is that it decreases test flake. You can think of {% url `cy.wait()` wait %} as a guard that indicates to Cypress when you expect a request to be made that matches a specific routing alias. This prevents the next commands from running until responses come back and it guards against situations where your requests are initially delayed.

***Auto-complete Example:***

What makes this example below so powerful is that Cypress will automatically wait for a request that matches the `getSearch` alias. Instead of forcing Cypress to test the *side effect* of a successful request (the display of the Book results), you can test the actual *cause* of the results.

```javascript
cy.intercept('/search*', [{ item: 'Book 1' }, { item: 'Book 2' }]).as('getSearch')

// our autocomplete field is throttled
// meaning it only makes a request after
// 500ms from the last keyPress
cy.get('#autocomplete').type('Book')

// wait for the request + response
// thus insulating us from the
// throttled request
cy.wait('@getSearch')

cy.get('#results')
  .should('contain', 'Book 1')
  .and('contain', 'Book 2')
```

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example

The Cypress {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} has various tests for testing an auto-complete field within a large user journey test that properly await requests triggered upon auto-complete input changes. Check out the example:
- {% fa fa-github %} {% url "Auto-complete test code" https://github.com/cypress-io/cypress-realworld-app/blob/07a6483dfe7ee44823380832b0b23a4dacd72504/cypress/tests/ui/new-transaction.spec.ts#L36-L50 %}
- {% fa fa-video-camera %} {% url "Auto-complete test run video recording" https://dashboard.cypress.io/projects/7s5okt/runs/2352/test-results/3bf064fd-6959-441c-bf31-a9f276db0627/video %} in Cypress Dashboard.

{% endnote %}

## Failures

In our example above, we added an assertion to the display of the search results.

***The search results working are coupled to a few things in our application:***

1. Our application making a request to the correct URL.
2. Our application correctly processing the response.
3. Our application inserting the results into the DOM.

In this example, there are many possible sources of failure. In most testing tools, if our request failed to go out, we would normally only ever get an error once we attempt to find the results in the DOM and see that there is no matching element. This is problematic because it's unknown *why* the results failed to be displayed. Was there a problem with our rendering code? Did we modify or change an attribute such as an `id` or `class` on an element? Perhaps our server sent us different Book items.

With Cypress, by adding a {% url `cy.wait()` wait %}, you can more easily pinpoint your specific problem. If the response never came back, you'll receive an error like this:

<!--
To reproduce the following screenshot:
it('test', () => {
  cy.intercept('foo/bar').as('getSearch')
  cy.wait('@getSearch')
})
-->

{% imgTag /img/guides/clear-source-of-failure.png "Wait Failure" %}

Now we know exactly why our test failed. It had nothing to do with the DOM. Instead we can see that either our request never went out or a request went out to the wrong URL.

## Assertions

Another benefit of using {% url `cy.wait()` wait %} on requests is that it allows you to access the actual request object. This is useful when you want to make assertions about this object.

In our example above we can assert about the request object to verify that it sent data as a query string in the URL. Although we're mocking the response, we can still verify that our application sends the correct request.

```javascript
// any request to "search/*" endpoint will automatically receive
// an array with two book objects
cy.intercept('search/*', [{ item: 'Book 1' }, { item: 'Book 2' }]).as('getSearch')

cy.get('#autocomplete').type('Book')

// this yields us the interception cycle object which includes
// fields for the request and response
cy.wait('@getSearch')
  .its('request.url').should('include', '/search?query=Book')

cy.get('#results')
  .should('contain', 'Book 1')
  .and('contain', 'Book 2')
```

***The interception object that {% url `cy.wait()` wait %} yields you has everything you need to make assertions including:***

- URL
- Method
- Status Code
- Request Body
- Request Headers
- Response Body
- Response Headers

**Examples**

```javascript
// spy on POST requests to /users endpoint
cy.intercept('POST', '/users').as('new-user')
// trigger network calls by manipulating web app's user interface, then
cy.wait('@new-user')
  .should('have.property', 'response.statusCode', 201)

// we can grab the completed interception object again to run more assertions
// using cy.get(<alias>)
cy.get('@new-user') // yields the same interception object
  .its('request.body')
  .should('deep.equal', JSON.stringify({
    id: '101',
    firstName: 'Joe',
    lastName: 'Black'
  }))

// and we can place multiple assertions in a single "should" callback
cy.get('@new-user')
  .should(({ request, response }) => {
    expect(request.url).to.match(/\/users$/)
    expect(request.method).to.equal('POST')
    // it is a good practice to add assertion messages
    // as the 2nd argument to expect()
    expect(response.headers, 'response headers').to.include({
      'cache-control': 'no-cache',
      expires: '-1',
      'content-type': 'application/json; charset=utf-8',
      location: '<domain>/users/101'
    })
  })
```

**Tip:** you can inspect the full request cycle object by logging it to the console

```javascript
cy.wait('@new-user').then(console.log)
```

# See also

- {% url "Network requests in Kitchen Sink example" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/examples/network_requests.spec.js %}
- {% url "See how to make a request with `cy.request()`" request %}
- {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} test suites to see Cypress network handling in action.
- Read {% url "Difference between cy.route and cy.route2" https://glebbahmutov.com/blog/cy-route-vs-route2/ %} blog post
- If you want to test the application in offline mode, read {% url "Testing an Application in Offline Network Mode" https://www.cypress.io/blog/2020/11/12/testing-application-in-offline-network-mode/ %}
