# Sign-up, Login, Create Bank Account and Logout

If you have a pre-existing application with little to no tests, it can often be difficult to know how to get started. When trying to determine which tests to write, it is a good idea to first start by asking yourself this question, "What are the most important parts of my application?" Figure out which portions of your application, should they go down, would cause the most damage, stress and financial loss. These are the areas which you need to be writing tests for first.

In the case of the RWA, it is essential that a user be able to sign up for a new account, to log in to that newly created account, create a bank account and finally log out. At first, you might be thinking that we should write one test for each step, which in this case would be four tests. However, we need to think about it from the actual user's perspective. These steps do not happen in isolation from one another, rather they are very much dependent upon each other.

For example, a user cannot log in to an account that they are unable to create, nor can they log out of an account which they cannot log into. If we write a separate test for each, we will not be able to properly test the relationship and dependency between each step, as they would be isolated from one another.

Instead, we should write a single test that makes sure a user can create a new account, log into that new account, add a bank account and log out. This sequence of steps or events taken by the user is often referred to as a "user journey." Testing user journey's simulates the behavior of what our user's will actually be doing within our application, and this is precisely what we need to be testing.

So now that we know what we need to test, let's go through all of the steps one of our users would in order to sign up, log in, create a bank account and log out.

# Sign Up

Let's create a new `it()` block and call it `should allow a user to signup, log in, create a bank account & log out`

```jsx
it('should allow a user to signup, log in, create a bank account & log out', () => {})
```

The first thing we want the test to do is to open a browser to our apps root route, which in our case is the sign in page.

The app should automatically redirect to the sign in page so we can just tell it to go to the root route.

By doing this, we are also confirming that our redirects are working as well.

```jsx
cy.visit('/')
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.19.09_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.19.09_PM.png)

The next thing we need to test is clicking on the "Sign Up" button. If we open the dev tools and inspect the Sign Up button, we will see that it has an attribute called `data-test="signup"`

This is a Cypress best practice.

Rather using an ID or class name, it is best to create specific attributes that are used exclusively for testing. Since UI's change over time, you don't want to use an ID or classname which might change at some point in the future and would therefore break your tests.

```jsx
cy.get('[data-test="signup"]').click()
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.20.07_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.20.07_PM.png)

It might also be a good idea, to make an assertion that will make sure that after we click on the Sign Up link, we are correctly routed to the Sign Up page. We can do this by making sure the url matches what we expect.

```jsx
cy.location('pathname').should('eq', '/signup')
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.20.58_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.20.58_PM.png)

Our entire test so far:

```jsx
it.only('should allow a user to signup, log in, create a bank account & log out', () => {
  cy.visit('/')
  cy.get('[data-test="signup"]').click()
  cy.location('pathname').should('eq', '/signup')
})
```

# Sign Up Form

Now let's write the steps to fill out our signup form.

```jsx
cy.get('[data-test="signup-first-name"]').type('Bob')
cy.get('[data-test="signup-last-name"]').type('Ross')
cy.get('[data-test="signup-username"]').type('PainterJoy90')
cy.get('[data-test="signup-password"]').type('s3cret')
cy.get('[data-test="signup-confirmPassword"]').type('s3cret')
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.21.41_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.21.41_PM.png)

Finally we just need to click the Sign Up button to create our new user account.

```bash
cy.get('[data-test="signup-submit"]').click();
```

Now let's make another assertion that we are redirected back to the /signin page

```bash
cy.location("pathname").should("eq", "/signin");
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.22.15_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.22.15_PM.png)

Great, now we have a test that confirms that our signup form is working as expected and our redirects are also working as expected.

# Cypress Commands

---

Now that we know our users can create an account, we need to make sure they are able to login with their newly created accounts.

Before we test the sign in form and functionality, I want to introduce you to something called Cypress commands.

Cypress commands allow you to create your own custom commands which are attached to the `cy` object.

For example, take a look at the verbose syntax we have to write in order to `get()` our `data-test` attributes. Wouldn't it be nice if we could just supply the name? Let's see how to do that by using a custom Cypress command that is included with the RWA.

Within the `cypress/support` directory, open the `commands.ts` file.

Around line `35` you should see the following command.

```jsx
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})
```

This simple command takes in a selector and then returns the cy.get command to get our data attribute.

Now instead of having to write

```jsx
cy.get('[data-test="signup-first-name"]').type('Bob')
```

We can simply write

```jsx
cy.getBySel('signup-first-name').type('Bob')
```

Let's refactor our test to use this new command.

```jsx
it('should allow a user to signup, log in, create a bank account & log out', () => {
  cy.visit('/')
  cy.getBySel('signup').click()
  cy.location('pathname').should('eq', '/signup')

  // Sign Up Form
  cy.getBySel('signup-first-name').type('Bob')
  cy.getBySel('signup-last-name').type('Ross')
  cy.getBySel('signup-username').type('PainterJoy90')
  cy.getBySel('signup-password').type('s3cret')
  cy.getBySel('signup-confirmPassword').type('s3cret')
  cy.getBySel('signup-submit').click()
  cy.location('pathname').should('eq', '/signin')
})
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.26.58_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.26.58_PM.png)

Everything still works and our test is passing.

Now let's test our sign in form.

# Sign In Form

---

After we are redirected to the /signin page the user will need to enter their username and password and click the Sign In button.

```jsx
cy.getBySel('signin-username').type('PainterJoy90')
cy.getBySel('signin-password').type('s3cret')
cy.getBySel('signin-submit').click()
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.27.51_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.27.51_PM.png)

# beforeEach() & Cypress tasks

---

It would be nice to have a fresh clean database each time our test runs so that we are not working with stale or bad data.

We can do this quite easily be adding a `beforeEach()` function, just beneath our `describe()` block. Anything that is included inside of this function will be executed before each test is run. This is a great way to set things up and/or tear things down between tests.

```jsx
describe("User Authentication", () => {
  beforeEach(function () {

  });

// ...
```

Within our beforeEach, we are going to use a Cypress task which will reseed our database.

```jsx
beforeEach(function () {
  cy.task('db:seed')
})
```

This is a custom task we have created within the RWA and can be found in `cypress/plugins/index.ts` on line `53`. This task simply hits an api endpoint that is responsible for reseeding the database.

Now each time our test is run, we will have a fresh clean database to work with.

# Create a Bank Account

---

After logging in, we are presented with a modal that walks the user through how to create a bank account. Let's write some tests to make sure this functionality is working as well.

First, we will write an assertion to make sure the modal is visible.

```jsx
cy.getBySel('user-onboarding-dialog').should('be.visible')
```

Next, we will need to click the Next button to create our bank account.

```jsx
cy.getBySel('user-onboarding-next').click()
```

Now let's fill out the create bank account form and make sure our users can create new bank accounts.

```jsx
cy.getBySelLike('bankName-input').type('The Best Bank')
cy.getBySelLike('routingNumber-input').type('987654321')
cy.getBySelLike('accountNumber-input').type('123456789')
cy.getBySelLike('submit').click()
```

Finally let's make sure their bank account is created successfully by making sure they are presented with the last page of the modal.

```jsx
cy.getBySel('user-onboarding-dialog-title').should('contain', 'Finished')
cy.getBySel('user-onboarding-dialog-content').should(
  'contain',
  "You're all set!"
)
cy.getBySel('user-onboarding-next').click()
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.31.44_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.31.44_PM.png)

Great. Now we are confident that users can create an account, log in and create new bank accounts.

# Logout

---

Now the only thing left to test is to make sure our users can log out. Once they do we will also write an assertion to make sure they are redirected to the /signin page.

```jsx
cy.getBySel('sidenav-signout').click()
cy.location('pathname').should('eq', '/signin')
```

![Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.36.27_PM.png](Sign-up,%20Login,%20Create%20Bank%20Account%20and%20Logout%2098100447749b4927a298c0fe61a67d27/Screen_Shot_2021-06-28_at_2.36.27_PM.png)

# Wrap Up

---

In summary, we now have a single test that makes sure a user can create a new account, log into that new account, create a new bank account and finally log out. This sequence of steps or events taken by the user is often referred to as a "user journey." Testing user journeys is one of the best ways to ensure various pieces of your application are integrated and working together properly.

# Final Code

---

```jsx
it('should allow a user to signup, log in, create a bank account & log out', () => {
  cy.visit('/')
  cy.getBySel('signup').click()
  cy.location('pathname').should('eq', '/signup')

  // Sign Up Form
  cy.getBySel('signup-first-name').type('Bob')
  cy.getBySel('signup-last-name').type('Ross')
  cy.getBySel('signup-username').type('PainterJoy90')
  cy.getBySel('signup-password').type('s3cret')
  cy.getBySel('signup-confirmPassword').type('s3cret')
  cy.getBySel('signup-submit').click()
  cy.location('pathname').should('eq', '/signin')

  // Sign In
  cy.getBySel('signin-username').type('PainterJoy90')
  cy.getBySel('signin-password').type('s3cret')
  cy.getBySel('signin-submit').click()

  // Create a Bank Account
  cy.getBySel('user-onboarding-dialog').should('be.visible')
  cy.getBySel('user-onboarding-next').click()
  cy.getBySelLike('bankName-input').type('The Best Bank')
  cy.getBySelLike('routingNumber-input').type('987654321')
  cy.getBySelLike('accountNumber-input').type('123456789')
  cy.getBySelLike('submit').click()
  cy.getBySel('user-onboarding-dialog-title').should('contain', 'Finished')
  cy.getBySel('user-onboarding-dialog-content').should(
    'contain',
    "You're all set!"
  )
  cy.getBySel('user-onboarding-next').click()

  // Logout
  cy.getBySel('sidenav-signout').click()
  cy.location('pathname').should('eq', '/signin')
})
```
