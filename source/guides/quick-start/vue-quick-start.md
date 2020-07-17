# Vue Quick Start Guide

{% note info %}
**What You'll Learn**
- What Cypress is
- How to set up Cypress with a Vue.js application
- Essential concepts and techniques 
{% endnote %}

## Introduction

In this guide, we will be covering how to set up Cypress in your {% url "Vue CLI" https://cli.vuejs.org/ %} application.

### What is Cypress?

Cypress is an end-to-end (E2E) testing framework that helps you validate your application by replicating real user actions with a browser environment. In other words, it allows you to write tests from the perspective of the user and aims to replicate a user's expected journey throughout your application. As a result, this can provide a higher degree of confidence that your application will function properly when deployed to production.

### Installation

This guide assumes that you are using {% url "Vue CLI" https://cli.vuejs.org/ %}, if you would like to see documentation on how Cypress should be run with a CDN version of Vue, be sure to visit this issue and give it a thumbs up.

The easiest way to install Cypress is through Vue CLI's plugin. This will not only add Cypress as a dependency to your project, but will also help create a scaffold in your project. 

Once you open up your project in your terminal, run the following command:

```jsx
vue add e2e-cypress
```

### Getting Started

To start Cypress, run:

```jsx
npm run test:e2e
```

This will do two things:

1. Serve a production version of your app at a localhost port address (typically 8080)
2. Start up an instance of Cypress

With that said and done, let's dive into what's going on here.

## Core Concepts

### Cypress Instance

When Cypress starts up, you should be greeted with the following window:

{% imgTag /img/guides/vue-quick-start/vue-quick-start-01.png "Cypress Open Modal" %}

While there are lots of features packed in this window, the main area to pay attention to is where you can interact with your tests:

{% imgTag /img/guides/vue-quick-start/vue-quick-start-02.png "Cypress Open Modal with Area Markings" %}

There are three main areas to pay attention to:

1. **Integration Tests** - This area lists out all of your tests that are being tracked by Cypress and allows you to run tests individually
2. **Filter Integration Tests** - This search bar allows you to filter the tests displayed in the Integration Tests area
3. **Run All Specs Button** - This button allows you to run all of your tests rather than running them individually

Now that we understand these key areas in a Cypress instance, let's run our first test by clicking on `test.js`!

### Cypress Test Runner

After clicking on `test.js`, Cypress will open up an instance of Chrome that should look like the following screenshot:

{% imgTag /img/guides/vue-quick-start/vue-quick-start-03.png "Screenshot of Cypress e2e test in action" %}

One of the best features about Cypress is that the Test Runner has a graphical user interface (UI) that makes it easy for you to get the information you need.

{% imgTag /img/guides/vue-quick-start/vue-quick-start-04.png "Screenshot of Cypress e2e test in action with area marked off" %}

There are two primary sections to pay attention to:

1. **Command Log** - This will contain information about the steps being run in each test and empowers you with additional abilities we will show you later
2. **Live Preview** - This contains a live instance of your application being run in the browser and will allow you to see what is happening during each step of the test

While there's more to unpack in each section, let's dive into how you will be writing your tests.

### Test Fundamentals

#### Folder & File Convention

Vue CLI Cypress Plugin scaffolds your tests inside the `tests/e2e/specs` directory. Each test is a standard JavaScript file that can be identified by one of two popular conventions:

- `myTest.js`
- `myTest.spec.js`

Though both are perfectly viable syntax, it is generally considered a best practice to use the `.spec.js` prefix in order to clearly indicate test files from other JavaScript files that may share similar names.

#### Test Structure

At its core, Cypress tests follow the standard `describe()` / `beforeEach()` / `it()` pattern.

```jsx
describe('Bank transactions', () => {
  beforeEach(() => {
    // Run script to log user in before every test
  })

  it('allows user to see their recent bank transactions', () => {
    // Check whether the bank transaction table contains recent data
  })

  it('allows user to see their past bank transactions', () => {
    // Check whether the bank transaction table contains past data
  })
})
```

In its essence, the `describe()` / `beforeEach()` / `it()` pattern allows you to organize your tests in a way that uses natural language so that every test's purpose can be easily understood by anyone regardless of their technical background. 

Using our example above, we see that:

- `it()` allows you to define an individual test that can either pass or fail
- `beforeEach()` is a convention that allows you to make your code more concise by allowing you to run a set of actions prior to each `it()` block. It is one of several hooks that can be used in your test's lifecycle
- `describe()` allows you to group related tests together

In other words, by providing each `describe()` and `it()` block a human readable scenario, it makes it much easier to debug later on when trying to figure out what part of the application had errors.

And with that, you are now ready to dive into how to write end-to-end (E2E) tests with Cypress!

## Essentials

### Navigating your application

The first step to any application test is visiting the page you want to test. To do this, we invoke Cypress by using the `cy` library to call the `.visit()` function which takes a URL.

```jsx
// Visit a standard website
cy.visit('https://docs.cypress.io')

// Visit local Vue app server
cy.visit('https://localhost:8080')

// Visit Vue app's dashboard board
cy.visit('https://localhoost:8080/dashboard')

// Visit Vue app's user page
cy.visit('https://localhost:8080/user/123')
```

However, since we will primarily be working inside of our Vue application, it would be great if we could use relative paths instead of having to type `localhost:8080` every single time. Fortunately for us, Cypress provides an easy way to configure this by giving us a `baseUrl` option inside of our root `cypress.json` file. 

Since we used the `vue-cli-e2e-cypress` plugin, you will notice that this has already been taken care of for us. With this, we can write more succinct URLs as follows:

```jsx
// Visit home page, i.e., http://localhost:8080
cy.visit('/')

// Visit dashboard page, i.e., http://localhost:8080/dashboard
cy.visit('/dashboard')

// Visit user page, i.e., http://localhost:8080/user/123
cy.visit('/user/123')
```

### Getting elements

Now that we can navigate to any page in our application, the next step is for us to learn how to get the elements we want to use in our test. Just like the `.visit()` method, Cypress provides us the `.get()` method for this very purpose. It takes a single argument which can be any standard CSS selector.

```jsx
// Get article title by its HTML element
cy.get('h1')

// Get app div by id
cy.get('#id')

// Get article content by its CSS class
cy.get('.article-content')

// Get list items in the article content with a chained selector
cy.get('.article-content li')

// Get about links through an attribute selector
cy.get('a[href="/about"]')
```

It is common to use `class` and `id` attributes for DOM selection; however, these attributes are prone to change as CSS styles or the implementation of the UI are refactored in a growing codebase. A {% url "recommended practice" best-practices#Selecting-Elements %} to overcome this issue is to add a dedicated `data-test` attribute to desired elements for the sole purpose of testing.

Following this best practice, assuming we add the appropriate `data-test` attributes in our HTML, we could rewrite the examples above as follows:

```jsx
// Get article title by its HTML element
cy.get('[data-test="article-title"]')

// Get app div by id
cy.get('[data-test="app-container"]')

// Get article content by its CSS class
cy.get('[data-test="article-content"]')

// Get list items in the article content with a chained selector
cy.get('[data-test="article-list-item"]')

// Get about links through an attribute selector
cy.get('[data-test="about-link"]')
```

### Verifying element properties

Now that you are able to get the desired DOM element, it is time to learn how to test whether or not certain element properties meet certain criteria. These are known as **assertions**. For example, in our scaffolded Vue.js application, we may want to test whether or not the page's `h1` element contains the text `Welcome to Your Vue.js App`. In order to do this, we chain the `.should()` command onto our element.

```jsx
// Verify whether the URL path name is correct
cy.location('pathname').should('eq', '/signin')

// Verify whether our app's h1 has the correct text
cy.get('h1').should('have.text', 'Welcome to your Vue.js App')

// Verify whether our app's logo is visible
cy.get('img').should('be.visible')

cy.get('img').should('have.attr', 'src', 'coolpic.jpg')
cy.get('a').should('have.attr', 'href', 'coolpic.jpg')

// Verify length of list elements
cy.get('li').should('have.length', 8)
```

In the event you want to verify multiple properties, Cypress makes this easy for you to do by allowing you to chain the `.and()` method to add additional assertions.

```jsx
// Verify that password helper text is visible and contains the correct text
cy.get('#password-helper-text')
  .should('be.visible')
  .and('contain', 'Password must contain at least 4 characters')
```

### Interacting with elements

When you need to interact with an element, Cypress provides commands for interacting with the it. These commands will allow you to perform command user interactions such as:

- click
- focus
- hover
- type

Consider the following `LoginForm` component that provides a user with four typical inputs:

1. Username text input field
2. Password input field
3. Checkbox input to indicate remembering this user
4. Button to submit the login form

```html
<template>
  <form data-test="login-form">
    <label>
      Username
      <input
        name="username"
        type="text"
        v-model="username"
        data-test="login-username"
      />
    </label>
    <label>
      Password
      <input
        name="password"
        type="password"
        v-model="password"
        data-test="login-password"
      />
    </label>
    <label>
      Remember Me:
      <input
        name="rememberUser"
        type="checkbox"
        v-model="rememberUser" 
        data-test="login-remember-user"
      />
    </label>
    <button type="submit" data-test="login-submit">Login</button>
  </form>
</template>
```

To interact or fill this form, we can take the same actions a user would. With Cypress, we can use the `.type()`, `.check()`, and `.click()` to quickly do this:

```jsx
it('user can login', function () {
  cy.visit('/login')

  // Fill in form
  cy.get('[data-test="login-username"]').type('jane')
  cy.get('[data-test="login-password"]').type('Pa$sW0rd')
  cy.get('[data-test="login-remember-user"]').check()

  // Submit form
  cy.get('[data-test="login-submit"]').click()
})
```

Now that we know how to interact with elements, it is time we learned how to handle a common scenario for E2E tests: handling network requests.

### Monitoring network requests

A common scenario that many developers encounter is the need to observe and test against network requests such as API calls. Some reasons for needing to monitor or spy on network activity include:

- Awaiting a network response before making an assertion
- Validating the data going in and out of the app
- Ensuring the app is not making extraneous network requests

To accomplish this, we need to do two things:

1. Inform Cypress that we want to track network requests in this test
2. Register the routes we want Cypress to track through a concept known as aliases.

To instruct Cypress to track network requests, this can be done with the `cy.server()` command. 

Once Cypress has begun tracking network requests, we can register our routes using the `.route()` command and passing it two arguments: the type of request (i.e., `GET`, `POST`, etc.) and the URL we want to track.

```jsx
cy.route('GET', '/api/transactions')
```

Once we have defined our route, we will need a way to refer to our route again through an alias which acts like a variable name. We do this by chaining on the `.as()` command and passing in the alias we want it to have.

```jsx
cy.route('GET', '/api/transactions').as('transactionsRequest')
```

Consider an example where we have a user login component that making a POST request to a back end API endpoint at `/api/login`. After a successful login, the login component will display a success message.

```jsx
it('show login success message', function () {
  // Spy on POST /api/login
  cy.server()
  cy.route('POST', '/api/login').as('loginRequest')

  cy.visit('https://example/login')

  // ...Submit login form with correct user credentials

  cy.wait('@loginRequest')

  cy.contains('[data-test="login-success"]', 'Login Successful')
    .should('be.visible')
})
```

### Mocking network requests

While being able to monitor your network requests can be helpful, there are also situations where it is important to mock or stub network requests. Some of these include:

- Simulate problematic scenarios by delaying network response or receiving error status codes
- Simulate hard to produce edge cases
- The back end API is not available or is being developed at a different pace than the front end
- Making requests to third-party APIs that are out of your control

To accomplish this we can explicitly define the response through a configuration object and pass the desired values for the response.

```jsx
// Normal login route
cy.route('POST', '/api/login').as('loginRequest')

// Stubbing login route response
cy.route({
  method: 'POST',
  url: '/api/login',
  status: 200, // respond with success status
  delay: 1000, // delay response by 1 second
  response: [] // respond with empty data
}).as('loginRequestSuccess')
```

### Capture screenshots

Another benefit that you get by using Cypress is the ability to automate screenshot captures of  your app. While the immediate benefit of this often comes with being able to see how your app looks during certain points of time for debugging purposes, this also means that it can help with automating things such as documentation as well.

To capture screenshots, Cypress offers the command: {% url "`.screenshot()`" screenshot %}

Using the example of a login form, here is what the code might look like if we wanted to take a screenshot of the form before and after it is submitted.

```jsx
it('displays errors with incorrect credentials', () => {
  cy.visit('/login')

  cy.get('[data-cy="username"]').type('tony')
  cy.get('[data-cy="password"]').type('infinity')

  cy.screenshot()
  cy.get('[data-cy="submit"').click()
  cy.screenshot()
})
```

## Debugging Tests

Modern web applications are highly visual, interactive, and stateful thanks to frameworks like Vue.js that ease the creation of advanced UIs. As a result, Cypress enables workflows with helpful feedback loops for writing and running tests.

For example, even though the ability to preview your app while Cypress is running is a convenience, there are times where the test goes too quickly for us to understand what happened.

{% video local /img/guides/vue-quick-start/vue-quick-start-debugging-01.mp4 %}

In this example, in the event we want to verify the state of our application, the test completes before we can register what happened. Fear not though, for Cypress' Command Log has another ability that we have not discussed yet: time travel.

### Time Travel

To help visually see the states of an app throughout a test, Cypress takes a DOM snapshot after each test command. This allows you to see how the state of the UI changed after every interaction or even toggle between how things looked at the time of a network request and at the moment of receiving a response. 

In our example above, time traveling allows you to hover over individual steps in the testing process to see what is happening in your app.

{% imgTag /img/guides/vue-quick-start/vue-quick-start-05.png "Screenshot of Cypress showing which element is hovered over" %}

And if you click on the step, it will pin the DOM Snapshot so you can analyze it further.

{% imgTag /img/guides/vue-quick-start/vue-quick-start-06.png "Screenshot of Cypress pinning a DOM snapshot" %}

In addition, Cypress logs it to the console for further analysis!

{% imgTag /img/guides/vue-quick-start/vue-quick-start-07.png "Screenshot of Cypress output when test step is clicked on" %}

Here's a short clip of the time travel in action!

{% video local /img/guides/vue-quick-start/vue-quick-start-debugging-02.mp4 %}

With these automatic DOM snapshots, you'll have the {% url "ability to time-travel" test-runner#Hovering-on-Commands %} through the states of your UI for quick debugging or concisely understanding the behavior of your app.

## Next Steps

In this guide, we have covered the essentials you need for getting started, but there is much more in the world of Cypress.

Thanks for reading our guide and hope it has helped you create more trust in your app.
