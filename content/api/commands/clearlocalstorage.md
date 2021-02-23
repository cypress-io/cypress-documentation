---
title: clearLocalStorage
---

Clear data in localStorage for current domain and subdomain.

<Alert type="warning">

Cypress automatically runs this command _before_ each test to prevent state from being shared across tests. You shouldn't need to use this command unless you're using it to clear localStorage inside a single test.

</Alert>

## Syntax

```javascript
cy.clearLocalStorage();
cy.clearLocalStorage(key);
cy.clearLocalStorage(options);
cy.clearLocalStorage(keys, options);
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.clearLocalStorage(); // clear all local storage
```

### Arguments

**<Icon name="angle-right"></Icon> keys** **_(String, RegExp)_**

Specify key to be cleared in localStorage.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.clearLocalStorage()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`cy.clearLocalStorage()` yields `null`.</li><li>`cy.clearLocalStorage()` cannot be chained further.</li></List>

## Examples

### No Args

#### Clear all localStorage

```javascript
cy.clearLocalStorage();
```

### Specific Key

#### Clear localStorage with the key 'appName'

```javascript
cy.clearLocalStorage("appName");
```

#### Clear all localStorage matching `/app-/` RegExp

```javascript
cy.clearLocalStorage(/app-/);
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.clearLocalStorage()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`cy.clearLocalStorage` cannot have any assertions chained.</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`cy.clearLocalStorage()` cannot time out.</li></List>

## Command Log

```javascript
cy.clearLocalStorage(/prop1|2/).then((ls) => {
  expect(ls.getItem("prop1")).to.be.null;
  expect(ls.getItem("prop2")).to.be.null;
  expect(ls.getItem("prop3")).to.eq("magenta");
});
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/clearlocalstorage/clear-ls-localstorage-in-command-log.png" alt="Command log for clearLocalStorage" ></DocsImage>

When clicking on `clearLocalStorage` within the command log, the console outputs the following:

<DocsImage src="/img/api/clearlocalstorage/local-storage-object-shown-in-console.png" alt="console.log for clearLocalStorage" ></DocsImage>

## See also

- [`cy.clearCookies()`](/api/commands/clearcookies)
