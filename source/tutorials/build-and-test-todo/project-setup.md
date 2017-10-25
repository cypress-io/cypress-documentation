---
title: Project Setup
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- Setting up the project from a starter repository
- How to run Cypress from an `npm` script.
- How to visit a page with Cypress
{% endnote %}

VIDEO HERE

# {% fa fa-terminal %} Setup the starter project

Things will go faster if we start with a project that is pre-configured and already has some of the more tedious bits of code written.

We'll get started by:

1. Cloning the starter project from github
2. Installing our dependencies with `npm`
3. Taking a look at the dependencies and scripts
4. Building the app and running the local server

## Clone the repository

Start by cloning the [starter project from github](https://github.com/cypress-io/build-app-cypress-tutorial-starter).

```sh
git clone https://github.com/cypress-io/build-app-cypress-tutorial-starter
```

{% img /img/tutorials/build-todo-github-clone-starter.png "Clone the starter project" %}

## Install dependencies

Now that the project has been cloned, we can `cd` into the project directory and install the dependencies by running

```sh
npm install
```

## Review of `package.json`

Let's take a look at our `package.json` file and see what the application we're building will consists of.

### Scripts

- `build` - Builds our application.
- `watch` - Builds the application and watches for file changes and rebuilds when changes are made.
- `serve` - Runs the application server.
- `dev` - Runs both the `watch` and `serve` scripts together.

### Dependencies

We'll be building this application with React and React Router. We'll also use the axios library to make API calls.

We'll also use `json-server` to serve the application and the API for it. The API is handled via an in-memory database that is backed by the `db.json` file, so there are no requirements for a database solution in order to run this locally as we work through the steps in the tutorial.

{% note info %}

Cypress tests anything that runs in a browser. You don't need to be using any of these tools specifically to use Cypress. In order to to create a tutorial, we had to choose a set of tools to work with. If you prefer building applications with other tools, Cypress will work just as well with the applications you build with those.

{% endnote %}

### Dev dependencies

Aside from Cypress, all of the dev dependencies for this project are here to build our application. Webpack and babel will handle building our JavaScript and JSX and putting the required output in the `build` directory.
## Build and serve the application

Now it's time to fire up this application and see what we'll be working with. In a terminal, we can run

```sh
npm run dev
```

This will run the webpack build process as well as the server that will host our application. As we work on our application, webpack will watch for changes to our application files so updates are just a `visit()` away.


## {% fa fa-globe %} Open the project in a browser

With the server running, we can open this in a browser by visiting `http://localhost:3030`, and we'll be presented with a simple todoMVC application.

{% img /img/tutorials/build-todo-todo-mvc-first-run.png "Running the starter version of todoMVC" %}

The styling and markup are in place, but none of the functionality has been implemented yet.

We'll be implementing the functionality for this application throughout this tutorial, taking it from an empty shell, to a fully functioning and well tested application.

# {% fa fa-terminal %} Run Cypress with an `npm` script

Cypress is installed as a dev dependency of our project and we could run it by targeting the Cypress binary under `node_modules/.bin` but it would be much easier if we could run Cypress with `npm` like we do our `build` and `serve` tasks.

We can accomplish this by adding the following line in the `scripts` section of our `package.json` file.

```json
"cypress": "cypress open"
```

{% note info %}

When run from an `npm` script, we don't need to specify the path to `node_modules/.bin` because `npm` will look for our binary there by default.
{% endnote %}

Now that we have a script to run Cypress, we can run it from a new terminal window with:

```sh
npm run cypress
```

Since this is our first run for this project, Cypress will seed the project with some sample files.

{% img /img/tutorials/build-todo-seed-dialog.png "Cypress seeding the project" %}

We will be creating our own spec files, so we can safely remove the seeded spec and fixture files listed:

- `cypress/integration/example_spec.js`
- `cypress/fixtures/example.json`


# {% fa fa-check-square-o %} Create the first spec file

In your favorite editor, create a file under `cypress/integration` called `input-form.spec.js`.

{% img /img/tutorials/build-todo-create-file.png "Creating a new spec file" %}

In this file, we'll add a `describe` block and inside that, we'll start to define our first test with an `it`. 

```js
describe('Input form', () => {
  it('focuses input on load', () => {
    
    })
})
```

This `describe` block will help us group related tests and will provide context in the Cypress command log. The `it` function defines a test. In this case, we're going to test that the input field receives focus when the page loads.

Before we can write the code to test that behavior, we need to open the page. We'll do that with the `cy.visit()` command. Update your code to look like this:

```js
describe('Input form', () => {
  it('focuses input on load', () => {
    cy.visit('http://localhost:3030')
  })
})
```

Once you save this file, you will see it show up in the spec list in Cypress

{% img /img/tutorials/build-todo-spec-list.png "Spec list in Cypress" %}

Clicking the spec will run our new test and you will see the Cypress runner open and our todo application should be displayed in the application preview.

{% img /img/tutorials/build-todo-first-test-run.png "Todo MVC in the App Preview of the Cypress runner" %}







