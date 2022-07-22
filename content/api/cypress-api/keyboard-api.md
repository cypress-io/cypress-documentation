---
title: Cypress.Keyboard
---

The Keyboard API allows you set the default values for how the
[.type()](/api/commands/type) command is executed.

## Syntax

```javascript
Cypress.Keyboard.defaults(options)
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

An object containing the following:

| Option           | Default | Description                                                                                                                                                    |
| ---------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keystrokeDelay` | `10`    | The delay, in milliseconds, between keystrokes while typing with [.type()](/api/commands/type). Set to `0` to remove the delay. Must be a non-negative number. |

## Examples

### Slow down typing by increasing the keystroke delay

```javascript
Cypress.Keyboard.defaults({
  keystrokeDelay: 20,
})
```

### Remove the keystroke delay

```javascript
Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
})
```

## Notes

### Where to put Keyboard configuration

::include{file=partials/support-file-configuration.md}

### Set the keystroke delay in test configuration

The keystroke delay can also be set via
[test configuration](/guides/core-concepts/writing-and-organizing-tests#Test-Configuration),
which can be useful when setting it for a single test or a subset of tests.

```javascript
it('removes keystroke delay for all typing in this test', { keystrokeDelay: 0 }, () => {
  cy.get('input').eq(0).type('fast typing')
  cy.get('input').eq(1).type('more fast typing')
})

describe('removes keystroke delay in all tests in this suite', { keystrokeDelay: 0 }, () => {
  it('types fast in the first input', () => {
    cy.get('input').eq(0).type('fast typing')
  })

  it('types fast in the second input', () => {
    cy.get('input').eq(1).type('more fast typing')
  })
}))
```

## See also

- [.type()](/api/commands/type)
