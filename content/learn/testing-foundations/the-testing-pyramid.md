# The testing pyramid

> It’s not important what you call it, but what it does - Gojko Adzic

Source: [https://web.archive.org/web/20150104002755/http://gojko.net/2011/01/12/the-false-dichotomy-of-tests](https://web.archive.org/web/20150104002755/http://gojko.net/2011/01/12/the-false-dichotomy-of-tests)

The testing pyramid is a way of illustrating the various types of tests and their relationship to one another.

# Unit tests

---

At the base of the pyramid are unit tests. They are the at the bottom, because they are the foundation upon which your other tests rest upon.

As you can see, they take up the largest amount of space of the pyramid and are typically the tests that you will write the most.

Unit tests are intended to test a single "unit" within an application. This means that they should not be dependent upon other parts of the system or application. Think of testing a single function for example.

When writing unit tests, you want to think of the function you are testing as a black box. You are not concerned with the logic inside of the function, you are only concerned that given a specific type of input, you expect a specific type of output. This way you can always refactor the internals or body of the function without breaking your tests.

So again you are simply testing that given a set of inputs into this function we expect this specific output. How that works internally is irrelevant for your testing purposes.

# Integration tests

---

The point of integration testing is to make sure that individual pieces, or units, within an application work together as expected.

Unlike unit tests, that should always be independent, integration tests are fundamentally dependent. In fact that is their entire purpose, to test the dependencies of pieces within a system are working together correctly.

So the distinction between a unit test and an integration test is that unit tests are intended to test things in isolation, and integration tests, are testing portions of your application that are related to one another, never in isolation.

Think of testing how several classes work and rely upon each other or how several functions work and rely upon each other.

Integration tests are great for when you are building a new application from scratch, or an application or feature that does not have a UI yet. Once you have a UI, however, that is when you should be writing end to end (E2E) tests.

# End to End tests

---

These types of tests are written to test anything that runs in the browser. The purpose of these tests is to imitate what a real user would do.

For example, you might write a single test that registers a new account, logs in to that newly created account, purchases a product, and then logs out. This way you can ensure that all the layers within your application are working together properly.

End to end tests will often replace your integration tests, as they are essentially testing the same thing. However, E2E tests have an ever greater advantage and value over integration tests, as they are testing real user interactions within your application.
