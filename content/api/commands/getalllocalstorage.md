---
title: getAllLocalStorage
---

Get data in localStorage for all origins with which the test has interacted.

## Syntax

```javascript
cy.getAllLocalStorage()
cy.getAllLocalStorage(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.getAllLocalStorage()
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of
`cy.getAllLocalStorage()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.getAllLocalStorage()` yields an object where the keys are origins and the
values are key-value pairs of localStorage data.

For example, if `key1` is set to `value1` on `https://example.com` and `key2` is
set to `value2` on `https://other.com`, `cy.getAllLocalStorage()` will yield:

```js
{
  'https://example.com': {
    key1: 'value1',
  },
  'https://other.com': {
    key2: 'value2',
  },
}
```

## Examples

### Get all localStorage

```javascript
cy.visit('https://example.com', {
  onBeforeLoad(win) {
    win.localStorage.setItem('key', 'value')
  },
})

cy.getAllLocalStorage().then((result) => {
  expect(result).to.deep.equal({
    'https://example.com': {
      key: 'value',
    },
  })
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.getAllLocalStorage()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.getAllLocalStorage()` will only run assertions you have chained
once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.getAllLocalStorage()` cannot time out.

## See also

- [`cy.clearAllLocalStorage()`](/api/commands/clearalllocalstorage)
- [`cy.clearAllSessionStorage()`](/api/commands/clearallsessionstorage)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [`cy.clearLocalStorage()`](/api/commands/clearlocalstorage)
- [`cy.getAllSessionStorage()`](/api/commands/getallsessionstorage)
