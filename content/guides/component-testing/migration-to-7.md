---
title: Migrate from 6.X to 7.0
containerClass: component-testing
---

⚠️ The Cypress Component Testing library is still in **Alpha**. We are rapidly developing and expect that the API may undergo breaking changes. Contribute to its development by submitting feature requests or issues [here](https://github.com/cypress-io/cypress/).

## New architecture

In 7.0, Cypress component testing has changed architecture.
When upgrading Cypress to 7.0, if you are using the flag `experimentalComponentTesting` to run component tests, you will see an error.

```md
**TODO insert error**
```

When you are done migrating the setup, most tests will work out of the box.

## Migration Steps

### Plugins file

### Support file

Here is a piece of good news: You do not need to add anything to the support file anymore.

If you find the following line in your support file, remove it, it is not used anymore.

```js
import 'cypress-react-unit-test/hooks' // OR import '@cypress/react/hooks'
```

## Breaking changes

- Coverage
- Fetch polyfill
- React cypress selector
- Cleanup after each tests
