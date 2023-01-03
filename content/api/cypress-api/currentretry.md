---
title: Cypress.currentRetry
---

`Cypress.currentRetry` is a number representing the current
[test retry](/guides/guides/test-retries) count.

<Alert type="warning">

Note that `Cypress.currentRetry` may only be used inside tests and
[test hooks](/guides/core-concepts/writing-and-organizing-tests#Hooks), and will
be `null` outside of tests and test hooks.

</Alert>

## Syntax

```javascript
Cypress.currentRetry
```

## Examples

### Get current test retry

```javascript
it('example', () => {
  expect(Cypress.testRetry).to.eq(0)
})
```

## History

| Version                                       | Changes                      |
| --------------------------------------------- | ---------------------------- |
| [12.3.0](/guides/references/changelog#12-3-0) | Added `Cypress.currentRetry` |
