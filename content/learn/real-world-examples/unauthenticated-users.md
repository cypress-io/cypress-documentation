# Unauthenticated Users

Let's write a test to make sure that unauthenticated users are automatically redirected to the sign in page.

The RWA comes with lots of tests already, which we are going to leave alone so we can go over them in later lessons. Since we don't want to touch these tests, let's create a new directory specifically for these lessons.

Create a new directory inside of the `cypress/tests` called `rwt` .

![Unauthenticated%20Users%207f2c29640de44aca82dd15e71c32640a/Screen_Shot_2021-06-28_at_1.28.50_PM.png](Unauthenticated%20Users%207f2c29640de44aca82dd15e71c32640a/Screen_Shot_2021-06-28_at_1.28.50_PM.png)

Let's create a new file called `auth.spec.ts` inside of our `cypress/tests/rwt` directory.

We are using the `.ts` extension instead of `.js` because the RWA uses Typescript. If you are not familiar with Typescript, don't worry, as you don't need any prior experience with it to follow along.

First we will create a describe function that describes what the tests in this file are doing. All of the tests we will be writing are related to User Authentication, so we can create our describe function like this:

```jsx
describe('User Authentication', () => {})
```

Now, let's write our test.

```jsx
it('should redirect unauthenticated user to signin page', () => {})
```

Now let's navigate to a protected route to make sure our redirect is working as expected.

```jsx
cy.visit('/')
```

We can simply tell Cypress to go to the root route, which should only be accessible to users that are logged in.

We can verify that the redirect is working by writing an assertion that the url has changed to /signin

```jsx
cy.location('pathname').should('equal', '/signin')
```

Make sure you have the app running locally with

```bash
yarn dev
```

Then in another terminal window open cypress with the command

```bash
yarn cypress:open
```

Next click on the `auth.spec.ts` file within the `rwt` directory.

![Unauthenticated%20Users%207f2c29640de44aca82dd15e71c32640a/Screen_Shot_2021-06-28_at_1.34.08_PM.png](Unauthenticated%20Users%207f2c29640de44aca82dd15e71c32640a/Screen_Shot_2021-06-28_at_1.34.08_PM.png)

![Unauthenticated%20Users%207f2c29640de44aca82dd15e71c32640a/Screen_Shot_2021-06-28_at_1.35.44_PM.png](Unauthenticated%20Users%207f2c29640de44aca82dd15e71c32640a/Screen_Shot_2021-06-28_at_1.35.44_PM.png)

This is a very simple test, but it is testing some very important functionality. We do not want unauthorized users to gain access to our application and now we be confident that any unauthorized users will be automatically redirected to the Sign in page.

# Final Code

---

```jsx
describe('User Authentication', () => {
  it('should redirect unauthenticated user to signin page', () => {
    cy.visit('/')
    cy.location('pathname').should('equal', '/signin')
  })
})
```
