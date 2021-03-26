---
title: Cypress.minimatch
---

Cypress automatically includes [minimatch](https://github.com/isaacs/minimatch) and exposes it as `Cypress.minimatch`.

Use `Cypress.minimatch` to test out glob patterns against strings.

## Syntax

```javascript
Cypress.minimatch(target: string, pattern: string, options?: MinimatchOptions);
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.minimatch('/users/1/comments/2', '/users/*/comments', {
  matchBase: true,
})
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.minimatch() // Errors, cannot be chained off 'cy'
```

## Examples

By default Cypress uses `minimatch` to test glob patterns against request URLs.

If you're struggling with writing the correct pattern you can iterate much faster by testing directly in your Developer Tools console.

```javascript
// test that the glob you're writing matches the request's url

// returns true
Cypress.minimatch('/users/1/comments', '/users/*/comments', {
  matchBase: true,
})

// returns false
Cypress.minimatch('/users/1/comments/2', '/users/*/comments', {
  matchBase: true,
})
```

We're adding the `{ matchBase: true }` option because under the hood Cypress actually uses that option by default.

Now let's test out `**` support.

```javascript
// ** matches against all downstream path segments

// returns true
Cypress.minimatch('/foo/bar/baz/123/quux?a=b&c=2', '/foo/**', {
  matchBase: true,
})

// whereas * matches only the next path segment

// returns false
Cypress.minimatch('/foo/bar/baz/123/quux?a=b&c=2', '/foo/*', {
  matchBase: false,
})
```

## See also

- [Bundled Tools](/guides/references/bundled-tools)
