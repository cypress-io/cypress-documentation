# Installing Cypress and writing our first test

## Installing Cypress

Before we can begin writing our tests, we first need to install Cypress into our project. You can find more details about the installation process [here](https://docs.cypress.io/guides/getting-started/installing-cypress).

We can add Cypress to our project with npm:

```bash
npm install cypress -D
```

Next we will add a custom npm script so we can launch cypress easily. Within the `package.json` file add the following to the `"scripts"` object.

```json
"cypress:open": "cypress open"
```

The entire `"scripts"` object should look like this:

```json
"scripts": {
  "cypress:open": "cypress open",
  "start": "http-server -p 8888 -c-1"
},
```

Before we run our new script, make sure to also have the application running in a separate terminal window.

```jsx
npm run start
```

Let's now run this script so that Cypress can create the necessary directories and files within our project.

```bash
npm run cypress:open
```

Make sure to keep Cypress running through the duration of this lesson.

When Cypress first launches, it will display a screen like this:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_9.47.49_AM.png"
alt="cypress get started screen"></DocsImage>

Click on the green "Ok, got it!" to close the modal.

Cypress will automatically create several example test files which are a great way to see Cypress in action. If this is your first time ever using Cypress, we highly recommend that you click on some of them to see the Cypress test runner in action.

It would also be a good idea to take a look at some of these test files within your editor, to see how they are written. You can find them within `cypress/integration/examples` . Don't worry if you don't understand them yet or feel a bit overwhelmed. We are going to be writing our own tests shortly and explain every line of code along the way.

## Aside

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_9.56.26_AM.png"
alt="cypress browser selection dropdown"></DocsImage>

You can select which browser Cypress should use in the upper right hand corner. Cypress will automatically detect all of the installed browsers on your machine, so select whichever you would like for it to use.

## Writing our first test

Now that we have Cypress installed and working, let's write our first test for our todo application.

Create a new file called `app.spec.js` within the `cypress/integration` directory.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.02.58_AM.png"
alt="creating the app.spec.js file"></DocsImage>

Each test file, sometimes referred to as a "spec" file must contain at least one `describe()` block. The describe block is simply a function that gives a description for a group of tests.

Let's now create our describe block and call it "React TodoMVC"

```jsx
describe('React TodoMVC', () => {})
```

Within this function we will write our individual tests using the `it()` function. For our first test, let's write a test to make sure we can add a single todo.

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {})
})
```

Within the body of our `it()` function is where we write the code necessary for our test. Before we begin to do that, let's take a step back and think through all of the steps necessary to add a single todo.

Open the app in your browser and make note of all of the steps you need to perform to add a single todo.

1. We need to click on the input field.
2. We need to enter in the name of our todo.
3. We need to press the enter key to add our todo.

Now let's write out these steps into our test.

Before we can have Cypress click into the input field, we first need to grab the input field element from the DOM so Cypress knows which element to click on.

If we inspect the element with our browser's dev tools, we will notice that the input field has a class of `new-todo` . Therefore we can `get` this element like so:

```jsx
cy.get('.new-todo')
```

So our entire test file should now look like this:

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.get('.new-todo')
  })
})
```

Make sure to have the application running in another terminal window before you open Cypress. We need to have our application running and being served by our local http server so that Cypress can execute our tests against our application.

When Cypress launches, you will see a bunch of example files, so toggle the small arrow to the left of the `examples` folder to collapse it. You can also click the "COLLAPSE ALL" button.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.20.05_AM.png"
alt="cypress app.spec.js file in the test runner"></DocsImage>

Now click on the `app.spec.js` file to launch our test.

You should get an error like this:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.20.58_AM.png"
alt="cypress assertion error screen"></DocsImage>

Cypress is telling us that it is unable to `get` our input element with the class of `.new-todo` . If you look at the right side of Cypress you will see a message that says "This is the default blank page." This is just a default blank page that Cypress opens when it doesn't know where to go, but we want Cypress to open our todo application. Let's go back to our test and tell Cypress how to `navigate` to our app.

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo')
  })
})
```

Cypress provides a really excellent developer experience in that each time we save our test file, the runner will automatically re-run all of our tests. So after saving our file, you should now see the following:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.25.30_AM.png"
alt="todo mvc app with passing test"></DocsImage>

The green check mark means that Cypress has successfully found the input with the class of `new-todo` .

Next, we need to enter in the name of our todo. We can do that like so:

```jsx
cy.get('.new-todo').type('Buy Milk')
```

After saving our file, Cypress will re-run our test and you should see the following:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.27.18_AM.png"
alt="todo mvc app with buy milk todo"></DocsImage>

Next we need to simulate the user pressing the `enter` key to add the todo.

```jsx
cy.get('.new-todo').type('Buy Milk{enter}')
```

By adding `{enter}` inside of our `.type()` function, Cypress is smart enough to know that we want it to press the enter key after it has finished typing "Buy Milk"

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.29.13_AM.png"
alt="todo mvc app with buy milk todo"></DocsImage>

So our entire test file should like this so far:

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo').type('Buy Milk{enter}')
  })
})
```

With just a few lines of code we have written our first test that confirms that we are able to add a single todo to our application.

Before we wrap this up, however, I want you to think about this question, "How do we know only a single todo has been added?" Our test is confirming that we can add a single todo, but how do we know for certain, that only a single todo exists. We need a way to `assert` that only a single todo has been added. Let's see how we can do this.

First let's use our dev tools to inspect our newly added todo.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.37.43_AM.png"
alt="todo mvc app with chrome dev tools open"></DocsImage>

We can see that our todos are added as `<li>` elements. Knowing this, we can make an assertion that only a single `<li>` element exists within our todo app like so:

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo').type('Buy Milk{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })
})
```

Cypress should now listen our passing assertion.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.39.45_AM.png"
alt="cypress with passing test"></DocsImage>

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.40.23_AM.png"
alt="cypress passing test assertion"></DocsImage>

Let's break down what this line of code is doing.

```jsx
cy.get('.todo-list li')
```

First, we are getting all of the `<li>` child elements of the `.todo-list` element. This will return an `array` of all of the child elements that it finds, which in our case should only be 1.

We then make an assertion that this array should have a length of 1 element.

```jsx
cy.get('.todo-list li').should('have.length', 1)
```

Let's update our test to add two todos to see if our assertion now fails.

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo').type('Buy Milk{enter}')
    cy.get('.new-todo').type('Pay Rent{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })
})
```

Our assertion does indeed fail, as it should. It should only pass when we have a single todo.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.48.50_AM.png"
alt="cypress failing test assertion"></DocsImage>

We can also simplify this code by chaining both of our `.type()` functions together like so:

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo').type('Buy Milk{enter}').type('Pay Rent{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })
})
```

This is just a handy way of not having to get the same element multiple times and cleans up our test a little bit.

Now let's update our test so that we are only adding a single todo and so that everything passes.

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo').type('Buy Milk{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })
})
```

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/installing-cypress-and-writing-our-first-test/Screen_Shot_2021-06-25_at_10.51.41_AM.png"
alt="todo mvc app with all tests passing"></DocsImage>

## Wrap Up

We learned how to install Cypress into our project and how to interact with the Cypress test runner. We also learned how to create `spec` files and how to write our first test. We learned how to tell Cypress to `navigate` to a specific page, to `get` and element, to `type` into that element the name of our todo and how to simulate the pressing of the `enter` key. Finally, we learned how to write an `assertion` which makes sure that only a single todo has been added to our application.

Within a short period of time, we have actually learned quite a lot and covered a lot of ground. In the next lesson we will write additional tests for our app and learn some new Cypress functions and APIs.
