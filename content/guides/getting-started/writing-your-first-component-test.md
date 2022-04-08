---
title: Writing Your First Component Test
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to run spec files in the Cypress app.
- How to mount a component and test that it renders correctly.
- How to query the DOM, spy on functions, and write assertions.
- How to use the Command Log to help debug test results.
- Best practices for writing and organizing tests.

</Alert>

## Getting Started

In order to get the most out of this guide, we recommend that you follow along.
Clone the
[cypress-component-testing-examples](https://github.com/cypress-io/cypress-component-testing-examples)
repo and then follow the instructions at the top of the `README` of either of
the following folders to get started:

- React version:
  [guide-getting-started-react](https://github.com/cypress-io/cypress-component-testing-examples/tree/main/guide-getting-started-react)
- Vue version:
  [guide-getting-started-vue](https://github.com/cypress-io/cypress-component-testing-examples/tree/main/guide-getting-started-vue)

If you want to use your own project, follow the steps in the
[Framework Configuration Guide](/guides/getting-started/component-framework-configuration)
before continuing.

## The example component

In this guide, we'll be testing a `LoginForm` component. This component is
similar to many of the components you will be testing in your application, in
that it accepts props and renders elements into the DOM that a user can interact
with.

More specifically, the `LoginForm` component:

- is a login form, with a title, input fields for the user name and password,
  and a submit button.
- has a `title` prop with a default value, that can be overridden.
- has an `onLogin` function prop that will be called with the entered `username`
  and `password` when the user clicks the "Login" button or presses `{enter}` in
  one of the input fields.
- has per-field validation error messages that display if either field is left
  empty when submitting, but only after the user has attempted to submit the
  form.

Here's the component (styles omitted for brevity):

<code-group-react-vue>
<template #react>

```js
import { useState } from 'react'

const LoginForm = ({ onLogin, title = 'Log In' }) => {
  const [submitted, setSubmitted] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const formSubmit = (event) => {
    event.preventDefault()
    if (username && password) {
      onLogin({ username, password })
    }
    setSubmitted(true)
  }

  return (
    <form className="login-form" onSubmit={formSubmit}>
      <fieldset>
        <legend>{title}</legend>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {submitted && !username && (
            <span className="error">Username is required</span>
          )}
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {submitted && !password && (
            <span className="error">Password is required</span>
          )}
        </label>
        <button type="submit">Login</button>
      </fieldset>
    </form>
  )
}

export default LoginForm
```

</template>
<template #vue>

```vue
<template>
  <form @submit.prevent="formSubmit" class="login-form">
    <fieldset>
      <legend>{{ title }}</legend>
      <label>
        Username:
        <input type="text" name="username" v-model="username" />
        <span v-if="submitted && !username" class="error">
          Username is required
        </span>
      </label>
      <label>
        Password:
        <input type="password" name="password" v-model="password" />
        <span v-if="submitted && !password" class="error">
          Password is required
        </span>
      </label>
      <button type="submit">Login</button>
    </fieldset>
  </form>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'LoginForm',
  props: {
    title: String,
    onLogin: Function,
  },
  setup(props) {
    const title = computed(() => props.title || 'Log In')
    const username = ref('')
    const password = ref('')
    const submitted = ref(false)

    const formSubmit = () => {
      if (username.value && password.value) {
        props.onLogin({ username: username.value, password: password.value })
      }
      submitted.value = true
    }
    return { formSubmit, title, username, password, submitted }
  },
}
</script>
```

</template>
</code-group-react-vue>

## Adding your first spec file

Assuming you've successfully
[installed the Cypress app](/guides/getting-started/installing-cypress#Installing)
and
[configured your framework](/guides/getting-started/component-framework-configuration),
now it's time to add your first spec file.

In order to test any component, there needs to be a corresponding spec file.
Just like the component file is used by the application to render the component,
the spec file is used by Cypress to test the component.

### Naming the spec file

Components are typically written in a modular fashion, with code, styling and
spec files existing alongside one another in the same folder.

Spec files should be named similarly to the component file being tested, but
need to have a slightly different file extension so that Cypress can find and
load them automatically. By default, this extension is either `.cy.js`,
`.cy.jsx`, `.cy.ts`, or `.cy.tsx`. For example, if your component file was named
`MyComponent.js` or `MyComponent.vue`, you'd typically create a spec file called
`MyComponent.cy.js`.

Note that you can change the
[`specPattern`](/guides/references/configuration#component) configuration option
to customize how Cypress looks for spec files.

### Creating the spec file

If you haven't already done so,
[open the Cypress app](/guides/getting-started/installing-cypress#Opening-Cypress).

- If you're using React, create an empty `LoginForm.cy.js` spec file next to the
  `src/components/LoginForm.js` component file and open it in your editor.
- If you're using Vue, create an empty `LoginForm.cy.js` spec file next to the
  `src/components/LoginForm.vue` component file and open it in your editor.

The Cypress app should update to show the newly-created file in its list of
specs.

<DocsImage src="/img/guides/getting-started/ct/v10/spec-file-list.png" alt="Cypress spec file list"></DocsImage>

If you have any issues getting the spec file to appear in the Cypress app,
please see the [Troubleshooting](#Troubleshooting) section of this guide.

Now select the spec file in the Cypress app. Cypress will tell you that no tests
could be found, which is to be expected, since we haven't yet written any tests.

<DocsImage src="/img/guides/getting-started/ct/v10/no-tests-message.png" alt="Cypress app with no tests message"></DocsImage>

Now that we've created our first spec file and have confirmed that Cypress can
load it, let's write our first test.

## Writing your first test

<Alert type="info">

If you've written tests before, feel free to skip ahead to the
[Testing components](#Testing-components) section, where we get into the
specifics of component testing with Cypress.

</Alert>

Spec files contain one or more tests, which each contain one or more assertions.

### Using the `it()` function

All tests are written as an `it()` function call, which Cypress provides as a
global for use in your spec files. In its most basic form, the `it()` function
accepts two arguments:

- The first argument is a string, known as the test name. This string will
  appear in the [Command Log](/guides/core-concepts/cypress-app#Command-Log) so
  that you can easily see per-test results and differentiate between the results
  of multiple tests.
- The second argument is the test function, also called the "test body."
  Assertions and other setup code are written inside the test body.

<Alert type="info">

[Assertions](/guides/references/assertions) are conditions that must succeed in
order for tests to pass, and usually consist of code that compares something
observed in the component (often referred to as the "actual" value) to a known
"expected" value that is coded into the test.

Usually, assertions are written so that the actual value comes first, followed
by the expected value. For example:

```js
expect(actualValue).to.equal(expectedValue)
```

For more information, see the [Assertions guide](/guides/references/assertions).

</Alert>

### The "hello world" test

This test is about as simple as a test can possibly be: It has a name and a test
body containing a single assertion. While this assertion doesn't help us test
our component, it will at least show us that Cypress is correctly loading and
executing the tests in the spec file, and will help us get more familiar with
the Cypress app.

First, let's start with a failing test.

Add this test to your spec file, and save it:

```js
it('should work', () => {
  expect(false).to.equal(true)
})
```

If everything is working as-expected, as soon as you save your spec file,
Cypress should load the spec file and re-run all the tests in it.

<Alert type="info">

Cypress automatically reloads and re-runs all tests in a spec file when it
detects changes to that file or in any files loaded into the spec file with
`import` or `require`.

</Alert>

In this case, because we've written a failing test, we should see a red X next
to the test name in the
[Command Log](/guides/core-concepts/cypress-app#Command-Log), along with a
failing assertion of `expected false to equal true` in the test body, and a few
options for getting more information about the failing test.

<DocsImage src="/img/guides/getting-started/ct/v10/failing-hello-world-test.png" alt="Cypress failing hello world test"></DocsImage>

### Updating a failing test

Normally, we write assertions that we expect to pass, and refactor our code
whenever we see an error. However, in this case, the test itself needs to be
refactored in order for it to pass. Change your existing "should work" test to
this, and save the spec file:

```js
it('should work', () => {
  expect(true).to.equal(true)
})
```

Now, the test should pass, and should have a green check mark next to the test
name, along with a passing assertion of `expected true to equal true` in the
test body.

<DocsImage src="/img/guides/getting-started/ct/v10/passing-hello-world-test.png" alt="Cypress passing hello world test"></DocsImage>

Congratulations! You've written your first test using Cypress component testing.
Now let's write some meaningful component tests.

## Testing components

In order to test components, we will use the custom
[`cy.mount()`](/api/commands/mount) command that is scaffolded during
[setup](/guides/getting-started/component-framework-configuration) to mount our
components. Mounting the component will allow us to write tests against its
rendered output.

### Importing the Component

Because our example `LoginForm` component is exported as a default export, we
will import it into our spec file like so (if the component was exported as a
named export, we would surround `LoginForm` with curly braces like
`{ LoginForm }`):

```js
import LoginForm from './LoginForm'
```

### Mounting the component

Now we can begin to write our first component test.

Replace the contents of your spec file with this, and then save it:

<code-group-react-vue>
<template #react>

```js
import LoginForm from './LoginForm'

it('should mount the component', () => {
  cy.mount(<LoginForm />)
})
```

</template>
<template #vue>

```js
import LoginForm from './LoginForm'

it('should mount the component', () => {
  cy.mount(LoginForm)
})
```

</template>
</code-group-react-vue>

Just like in the previous section, we should see one passing test. However, this
time, because we're mounting a component, we should also see the component
rendering in the Cypress app.

<DocsImage src="/img/guides/getting-started/ct/v10/mounted-component.png" alt="Cypress app showing mounted component"></DocsImage>

If you have any issues getting the component to mount or render properly, please
see the [Troubleshooting](#Troubleshooting) section of this guide.

## Testing the DOM

Mounting a component in a test can be useful as a baseline assertion that a
component doesn't error when mounted. However, we'll usually want to assert more
specific things about the component.

### Writing smart tests

How can we assert that the password field has a `type` attribute of `password`,
so we can be sure that the password is concealed as the user enters it?

The [`cy.get()`](/api/commands/get) command both gets a DOM element from the
rendered component, and implicitly asserts that it was found. So, we could do
this to assert that there is an `input` element with a `type` attribute of
`password`:

<code-group-react-vue>
<template #react>

```js
it('should have password input', () => {
  cy.mount(<LoginForm />)
  cy.get('input[type="password"]')
})
```

</template>
<template #vue>

```js
it('should have password input', () => {
  cy.mount(LoginForm)
  cy.get('input[type="password"]')
})
```

</template>
</code-group-react-vue>

However, this only asserts that there is an `input` element with a `type`
attribute of `password` somewhere in the rendered component, which would give us
false confidence that our component was working as-intended in the case where we
accidentally swapped the username and password fields.

Instead of trying to get the password field in a programmer-centric way, let's
get the password field in a user-centric way. Instead of getting the `input`
element by its attributes, let's get the `label` element by its text using
[`cy.contains()`](/api/commands/contains) and then use
[`cy.find()`](/api/commands/find) to find the descendant `input` element
underneath it, which we will then assert has a `type` attribute of `password`
using [`.should()`](/api/commands/should).

After your last test, add this test and save the spec file:

<code-group-react-vue>
<template #react>

```js
it('should have password input of type password', () => {
  cy.mount(<LoginForm />)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

</template>
<template #vue>

```js
it('should have password input of type password', () => {
  cy.mount(LoginForm)
  cy.contains('Password').find('input').should('have.attr', 'type', 'password')
})
```

</template>
</code-group-react-vue>

<Alert type="success">

<strong class="alert-header">Notes about the Cypress app</strong>

- When there's more than one test, each passing test listed in the
  [Command Log](/guides/core-concepts/cypress-app#Command-Log) will be collapsed
  by default. You can click any of them to show more details.
- Hovering over commands like `mount`, `contains` or `find` in the expanded test
  details should highlight the relevant elements in the rendered component.

</Alert>

## Testing props

Let's assert that the default value of the `title` prop is being rendered
properly, by using the [`cy.get()`](/api/commands/get) command to get the
`legend` element from the rendered output, and by using the
[`.should()`](/api/commands/should) command to assert that the element's text is
equal to expected default value of "Log In".

After your last test, add this test and save the spec file:

<code-group-react-vue>
<template #react>

```js
it('should render title with default text', () => {
  cy.mount(<LoginForm />)
  cy.get('legend').should('have.text', 'Log In')
})
```

</template>
<template #vue>

```js
it('should render title with default text', () => {
  cy.mount(LoginForm)
  cy.get('legend').should('have.text', 'Log In')
})
```

</template>
</code-group-react-vue>

Asserting that a custom prop value is being rendered properly should also work
the same way. For example, let's assert that a custom value for the `title` prop
is being rendered properly.

After your last test, add this test and save the spec file:

<code-group-react-vue>
<template #react>

```js
it('should render title with specified text', () => {
  const title = 'Please Authenticate'
  cy.mount(<LoginForm title={title} />)
  cy.get('legend').should('have.text', title)
})
```

</template>
<template #vue>

```js
it('should render title with specified text', () => {
  const title = 'Please Authenticate'
  cy.mount(LoginForm, {
    propsData: {
      title,
    },
  })
  cy.get('legend').should('have.text', title)
})
```

</template>
</code-group-react-vue>

<Alert type="success">

<strong class="alert-header">Notes about the Cypress app</strong>

- By default, the rendered component shows the state of the last-run test.
  Because our last test changed the title, we should currently see that
  reflected in the rendered component.
- Hovering over commands like `mount`, `contains`, `find` or `get` in the
  expanded test details always shows the state of the rendered component at the
  time that command was run. We call this feature
  [Time travel](/guides/core-concepts/cypress-app#Time-travel).

</Alert>

## Organizing tests

Before writing any more tests, we should talk about test organization.

Up until now, all of our tests have been written at the top level of the spec
file. This works for smaller numbers of tests, but as your spec files grow, it
can be helpful, or even necessary, to provide some
[structure](/guides/core-concepts/writing-and-organizing-tests#Test-Structure)
to your spec file.

### The `describe()` function

Tests can be grouped inside a `describe()` function call, also called a
"describe block" or just "block," which Cypress provides as a global for use in
your spec files. In its most basic form, the `describe()` function accepts two
arguments:

- The first argument is a string. This string will appear in the Cypress app so
  that you can easily see how multiple tests are grouped.
- The second argument is a function. Any number of tests or describe blocks can
  exist inside this function, allowing tests to be organized.

### Top-level grouping

Right now, we have a few tests at the top level of our spec file. Let's put them
all inside a describe block. While this isn't strictly necessary, it will help
make the spec file output more clear.

Surround the tests in your spec file with this, and then save it:

```js
describe('LoginForm', () => {
  // your tests
})
```

Your tests should now look something like this:

<code-group-react-vue>
<template #react>

```js
describe('LoginForm', () => {
  it('should mount the component', () => {
    cy.mount(<LoginForm />)
  })

  it('should have password input of type password', () => {
    cy.mount(<LoginForm />)
    cy.contains('Password')
      .find('input')
      .should('have.attr', 'type', 'password')
  })

  it('should render title with default text', () => {
    cy.mount(<LoginForm />)
    cy.get('legend').should('have.text', 'Log In')
  })

  it('should render title with specified text', () => {
    const title = 'Please Authenticate'
    cy.mount(<LoginForm title={title} />)
    cy.get('legend').should('have.text', title)
  })
})
```

</template>
<template #vue>

```js
describe('LoginForm', () => {
  it('should mount the component', () => {
    cy.mount(LoginForm)
  })

  it('should have password input of type password', () => {
    cy.mount(LoginForm)
    cy.contains('Password')
      .find('input')
      .should('have.attr', 'type', 'password')
  })

  it('should render title with default text', () => {
    cy.mount(LoginForm)
    cy.get('legend').should('have.text', 'Log In')
  })

  it('should render title with specified text', () => {
    const title = 'Please Authenticate'
    cy.mount(LoginForm, {
      propsData: {
        title,
      },
    })
    cy.get('legend').should('have.text', title)
  })
})
```

</template>
</code-group-react-vue>

And the Cypress app should look like this:

<DocsImage src="/img/guides/getting-started/ct/v10/describe-block.png" alt="Cypress app showing test describe block"></DocsImage>

### Nested grouping

We're now going to add a number of tests related to the login form itself.
However, before we do this, let's add another describe block after all the other
tests inside the "LoginForm" describe block.

Update your spec file, adding a new "form tests" describe block after all the
tests in the "LoginForm" block like so, and save it:

```js
describe('LoginForm', () => {
  // existing tests

  describe('form tests', () => {
    // nothing here yet
  })
})
```

The Cypress app should update to show the new describe block, but there won't be
anything inside it, because we haven't written any tests yet.

## Testing user interactions

While it's important to test that components render correctly, it's also
important to test that they behave correctly when the user interacts with them.
In this section, we're going to test how our `LoginForm` component behaves when
the form is submitted.

### Spying on functions

Many components accept function props, which allows the component to notify its
parent whenever a particular event occurs. For example, it may be necessary for
a parent component to pass an `onClick` function, also known as a "callback" or
"handler," into a child `Button` component to allow the parent to do something
whenever the user clicks the button.

In order to allow testing components outside their parent, we'll use the
[`cy.spy()`](/api/commands/spy) command, which creates a function that can be
passed into a component as a prop, which can be asserted on using
[`.should()`](/api/commands/should) to see that it was called (or not), or
called with specific arguments.

### Testing form submit

The next test is going to be a bit more involved than our previous tests,
because we're going to be entering text into form fields, submitting the form,
and verifying that a callback is getting called.

<Alert type="info">

In spec files with many tests, it can be helpful to "focus" a test while writing
it, so only that test is run and shown in the Cypress app. In order to do so,
just update your test to use `it.only()` instead of `it()`. Describe blocks can
also be focused by using `describe.only()` to run only certain groups of tests.

Focusing tests and saving your spec files as you're adding tests and assertions
can help you catch errors early, which will make debugging easier. Just be sure
to remove any `.only`s you've added after you've finished writing your tests, so
the other tests are shown again!

See the guide on
[Excluding and Including Tests](/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests)
for more examples.

</Alert>

First, let's create the new test. Inside the "form tests" block, add this test
(which we're focusing with `.only` as described above) and save the spec file:

```js
it.only('should call onLogin with username and password on login', () => {
  // nothing here yet
})
```

Inside the test, we first need to create a spy that we can pass into the
`LoginForm` component, so that when we click the Login button, the component has
a function to execute. After we create the spy, we need to mount the component,
passing in the spy as the `onLogin` prop.

<code-group-react-vue>
<template #react>

```js
it.only('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  cy.mount(<LoginForm onLogin={onLoginSpy} />)
})
```

</template>
<template #vue>

```js
it.only('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  cy.mount(LoginForm, {
    propsData: {
      onLogin: onLoginSpy,
    },
  })
})
```

</template>
</code-group-react-vue>

In the Cypress app, you should now see that the test details has an expandable
"Spies / Stubs" panel showing details about the spy, including the number of
calls.

<DocsImage src="/img/guides/getting-started/ct/v10/spies-stubs-panel.png" alt="Cypress app showing spies and stubs panel"></DocsImage>

Now that the component is mounted inside the test, we can then instruct Cypress
to find the Username field and type a username into it, find the Password field
and type a password into it, and then click the Login button. Note that we're
using the technique outlined in the [Writing smart tests](#Writing-smart-tests)
section above to get these form controls.

<code-group-react-vue>
<template #react>

```js
it.only('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  cy.mount(<LoginForm onLogin={onLoginSpy} />)
  cy.contains('Username').find('input').type('testuser123')
  cy.contains('Password').find('input').type('s3cret')
  cy.get('button').contains('Login').click()
})
```

</template>
<template #vue>

```js
it.only('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy()
  cy.mount(LoginForm, {
    propsData: {
      onLogin: onLoginSpy,
    },
  })
  cy.contains('Username').find('input').type('testuser123')
  cy.contains('Password').find('input').type('s3cret')
  cy.get('button').contains('Login').click()
})
```

</template>
</code-group-react-vue>

In the Cypress app, you should now see that the rendered component has filled-in
Username and Password fields, and that all of the Cypress commands are listed
under the test body. You should also be able to hover over the commands to see
exactly which element it operated on, and even see before and after states for
the [`.type()`](/api/commands/type) command.

You should also see that the spy was called after the button click, and the
number of calls has been updated to 1 in the "Spies / Stubs" panel.

<DocsImage src="/img/guides/getting-started/ct/v10/spies-stubs-panel-and-rendered-component.png" alt="Cypress app showing spies and stubs panel with rendered component"></DocsImage>

While visually confirming that the spy was called is helpful, we should actually
assert this in our test.

Using [`.as()`](/api/commands/as), we can assign the `onLoginSpy`
[alias](/api/commands/as) to our spy, and then refer to it later as
`@onLoginSpy`. This way, we can assert that it was called with an object with
`username` and `password` properties containing the values that were typed into
the form.

<code-group-react-vue>
<template #react>

```js
it.only('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy().as('onLoginSpy')
  cy.mount(<LoginForm onLogin={onLoginSpy} />)
  cy.contains('Username').find('input').type('testuser123')
  cy.contains('Password').find('input').type('s3cret')
  cy.get('button').contains('Login').click()
  cy.get('@onLoginSpy').should('have.been.calledWith', {
    username: 'testuser123',
    password: 's3cret',
  })
})
```

</template>
<template #vue>

```js
it.only('should call onLogin with username and password on login', () => {
  const onLoginSpy = cy.spy().as('onLoginSpy')
  cy.mount(LoginForm, {
    propsData: {
      onLogin: onLoginSpy,
    },
  })
  cy.contains('Username').find('input').type('testuser123')
  cy.contains('Password').find('input').type('s3cret')
  cy.get('button').contains('Login').click()
  cy.get('@onLoginSpy').should('have.been.calledWith', {
    username: 'testuser123',
    password: 's3cret',
  })
})
```

</template>
</code-group-react-vue>

Ok, great. Our test is done!

Now that we've finished writing our test, we can remove the `.only` so that the
test is no longer focused, and we can see the results from all the other tests
in the spec file. Remember that you can always view a test's details by clicking
on the test name in the Cypress app.

At this point, you know everything you need to know in order to write basic
component tests with Cypress. However, there are a few more things you should
consider.

## Using test hooks

In the previous section, we tested that the component "should call onLogin with
username and password on login", but "on login" is too vague, because there are
multiple ways a user can login. The user can click the "Login" button, but they
can also press the "enter" key while typing in an input. We should really have
two tests:

- it should call `onLogin` with `username` and `password` when the Login button
  is clicked
- it should call `onLogin` with `username` and `password` when enter is pressed
  in an input

If we think about what these two tests will need to do, we can see that most of
the tests will be identical, with very few differences. Additionally, we still
need to test that form validation works as expected, which will also require
much of the same setup code.

Specifically, in each form-related test:

- We need to mount the component.
- We need a spy so that we can assert that the `onLogin` function was called (or
  not called).
- We need to interact with one or more of the Username input, Password input,
  and Login button elements.

### Writing better tests with beforeEach

Fortunately, `describe()` is useful both for grouping tests, and also for
creating a place where we can define test hooks.

<Alert type="info">

[Test Hooks](/guides/core-concepts/writing-and-organizing-tests#Hooks) can be
used to set conditions or perform actions that you want to run before or after
each test in a spec file or describe block.

Cypress commands inside test hooks behave as if they were written inside the
tests, while reducing unnecessary duplication.

- `before()` runs once, before any test has run
- `beforeEach()` runs before each test
- `afterEach()` runs after each test
- `after()` runs once, after all tests are done running

The most commonly used hook is `beforeEach()`, because it ensures that a new
component instance is mounted for each test.

</Alert>

In this case, we'll add a `beforeEach()` hook inside our "form tests" describe
block to run some commands that will be shared across all tests in the block,
that will behave as if they were written at the top of each test.

We'll do this in a few steps. First, let's focus the test using `it.only()`.

Now, let's update our spec file to add the `beforeEach()` hook, before the
existing "should call onLogin with username and password on login" test, and
then move the spy creation and component mounting code into it, like so:

<code-group-react-vue>
<template #react>

```js
describe('form tests', () => {
  beforeEach(() => {
    const onLoginSpy = cy.spy().as('onLoginSpy')
    cy.mount(<LoginForm onLogin={onLoginSpy} />)
  })

  it.only('should call onLogin with username and password on login', () => {
    cy.contains('Username').find('input').type('testuser123')
    cy.contains('Password').find('input').type('s3cret')
    cy.get('button').contains('Login').click()
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username: 'testuser123',
      password: 's3cret',
    })
  })
})
```

</template>
<template #vue>

```js
describe('form tests', () => {
  beforeEach(() => {
    const onLoginSpy = cy.spy().as('onLoginSpy')
    cy.mount(LoginForm, {
      propsData: {
        onLogin: onLoginSpy,
      },
    })
  })

  it.only('should call onLogin with username and password on login', () => {
    cy.contains('Username').find('input').type('testuser123')
    cy.contains('Password').find('input').type('s3cret')
    cy.get('button').contains('Login').click()
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username: 'testuser123',
      password: 's3cret',
    })
  })
})
```

</template>
</code-group-react-vue>

The Cypress app should run the test exactly like before, however you should now
see that the `cy.mount` command has moved from the "test body" section to a
separate "before each" section.

In order to get the most out of the `beforeEach()` hook, we should also separate
the DOM element "getting" logic from the asserting logic. That means instead of
doing this kind of thing all at once inside our tests:

```js
cy.contains('Username').find('input').type('testuser123')
```

We'll split it into two separate steps, using [`.as()`](/api/commands/as) and an
[alias](/api/commands/as):

```js
// Create an alias for the element in beforeEach
cy.contains('Username').find('input').as('usernameInput')

// Get the element by its alias in the test
cy.get('@usernameInput').type('testuser123')
```

Now, update the spec file, using the above approach for the Username input,
Password input, and Login button, like so:

<code-group-react-vue>
<template #react>

```js
describe('form tests', () => {
  beforeEach(() => {
    const onLoginSpy = cy.spy().as('onLoginSpy')
    cy.mount(<LoginForm onLogin={onLoginSpy} />)
    cy.contains('Username').find('input').as('usernameInput')
    cy.contains('Password').find('input').as('passwordInput')
    cy.get('button').contains('Login').as('loginButton')
  })

  it.only('should call onLogin with username and password on login', () => {
    cy.get('@usernameInput').type('testuser123')
    cy.get('@passwordInput').type('s3cret')
    cy.get('@loginButton').click()
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username: 'testuser123',
      password: 's3cret',
    })
  })
})
```

</template>
<template #vue>

```js
describe('form tests', () => {
  beforeEach(() => {
    const onLoginSpy = cy.spy().as('onLoginSpy')
    cy.mount(LoginForm, {
      propsData: {
        onLogin: onLoginSpy,
      },
    })
    cy.contains('Username').find('input').as('usernameInput')
    cy.contains('Password').find('input').as('passwordInput')
    cy.get('button').contains('Login').as('loginButton')
  })

  it.only('should call onLogin with username and password on login', () => {
    cy.get('@usernameInput').type('testuser123')
    cy.get('@passwordInput').type('s3cret')
    cy.get('@loginButton').click()
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username: 'testuser123',
      password: 's3cret',
    })
  })
})
```

</template>
</code-group-react-vue>

Finally, we can refactor the test into two separate tests, like we outlined
above. While doing so, let's also store the `username` and `password` values as
`const` values, so they can be easily reused across all tests, and remove the
`.only` so we can see all of our tests run normally:

<code-group-react-vue>
<template #react>

```js
describe('form tests', () => {
  const username = 'testuser123'
  const password = 's3cret'

  beforeEach(() => {
    const onLoginSpy = cy.spy().as('onLoginSpy')
    cy.mount(<LoginForm onLogin={onLoginSpy} />)
    cy.contains('Username').find('input').as('usernameInput')
    cy.contains('Password').find('input').as('passwordInput')
    cy.get('button').contains('Login').as('loginButton')
  })

  it('should call onLogin with username and password when the Login button is clicked', () => {
    cy.get('@usernameInput').type(username)
    cy.get('@passwordInput').type(password)
    cy.get('@loginButton').click()
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username,
      password,
    })
  })

  it('should call onLogin with username and password when enter is pressed in an input', () => {
    cy.get('@usernameInput').type(username)
    cy.get('@passwordInput').type(password).type('{enter}')
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username,
      password,
    })
  })
})
```

</template>
<template #vue>

```js
describe('form tests', () => {
  const username = 'testuser123'
  const password = 's3cret'

  beforeEach(() => {
    const onLoginSpy = cy.spy().as('onLoginSpy')
    cy.mount(LoginForm, {
      propsData: {
        onLogin: onLoginSpy,
      },
    })
    cy.contains('Username').find('input').as('usernameInput')
    cy.contains('Password').find('input').as('passwordInput')
    cy.get('button').contains('Login').as('loginButton')
  })

  it('should call onLogin with username and password when the Login button is clicked', () => {
    cy.get('@usernameInput').type(username)
    cy.get('@passwordInput').type(password)
    cy.get('@loginButton').click()
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username,
      password,
    })
  })

  it('should call onLogin with username and password when enter is pressed in an input', () => {
    cy.get('@usernameInput').type(username)
    cy.get('@passwordInput').type(password).type('{enter}')
    cy.get('@onLoginSpy').should('have.been.calledWith', {
      username,
      password,
    })
  })
})
```

</template>
</code-group-react-vue>

Now that this is done, we can very easily test all of the component's validation
scenarios by adding a few more tests inside our "form tests" describe block.

We can test that validation errors appear when the user tries to login without
first entering a username or password:

```js
it('should show both validation errors if login is attempted without entering username or password', () => {
  cy.get('@loginButton').click()
  cy.contains('Username is required')
  cy.contains('Password is required')
  cy.get('@onLoginSpy').should('not.have.been.called')
})
```

We can test that specific validation errors appear when the user tries to login
without first entering one of the username or password values:

```js
it('should only show password validation error if login is attempted without entering password', () => {
  cy.get('@usernameInput').type(username)
  cy.get('@loginButton').click()
  cy.contains('Username is required').should('not.exist')
  cy.contains('Password is required')
  cy.get('@onLoginSpy').should('not.have.been.called')
})

it('should only show username validation error if login is attempted without entering username', () => {
  cy.get('@passwordInput').type(password)
  cy.get('@loginButton').click()
  cy.contains('Username is required')
  cy.contains('Password is required').should('not.exist')
  cy.get('@onLoginSpy').should('not.have.been.called')
})
```

And we can test that no validation error messages appear when the component is
first rendered:

```js
it('should not show any validation errors before login is attempted', () => {
  cy.contains('Username is required').should('not.exist')
  cy.contains('Password is required').should('not.exist')
})
```

<DocsImage src="/img/guides/getting-started/ct/v10/all-passing-tests.png" alt="Cypress app showing all passing tests"></DocsImage>

## Summary

At this point, you should have a better understanding of how to run spec files
in the Cypress app, along with a fully functional component testing spec file
with tests, grouped into describe blocks, that mount a component and use best
practices to select elements and make assertions.

<Alert type="success">

A working version of the spec file we created in this guide is also available in
the
[cypress-component-testing-examples](https://github.com/cypress-io/cypress-component-testing-examples)
repo.

- React version:
  [guide-getting-started-react-complete](https://github.com/cypress-io/cypress-component-testing-examples/tree/main/guide-getting-started-react-complete)
- Vue version:
  [guide-getting-started-vue-complete](https://github.com/cypress-io/cypress-component-testing-examples/tree/main/guide-getting-started-vue-complete)

</Alert>

## See also

- [React `mount()` examples](https://github.com/cypress-io/cypress/tree/develop/npm/react#api)
- [Vue `mount()` examples](https://github.com/cypress-io/cypress/tree/develop/npm/vue#what-is-cypressvue)
- The [Cypress App](/guides/core-concepts/cypress-app) UI

## Troubleshooting

(TODO: WRITE THIS SECTION)

specific issues

- spec file doesn't show up in the test runner
- spec file not loading
- spec file not automatically updating when it is changed -- ???
- spec file not working properly
- spec file not appearing properly

also

- explain some complexities of component testing: functionality-related issues
  vs styling-related issues
- The first time you import or mount ANY component it may not compile or look
  correct. This can be for many reasons and issues usually center around the
  following (and will be covered in depth in the next few pages of the guide):
  - functional dependencies that is loaded outside of your component (entry
    files or index.html)
  - any style dependencies that are loaded by parent components or entry files
    (main.ts
  - any dev-server compilation rules that are not configured to work with spec
    files (e.g. eslint rules)
    - note that this is a thing, but it's really dependent on the build setup,
      we won't cover it in this guide

### Getting Components to Work

- brief summary of that page with a link

### Rendering Components Correctly

- brief summary of that page with a link
