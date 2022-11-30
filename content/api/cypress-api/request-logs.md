---
title: RequestLogs
---

By default, Cypress logs all XMLHttpRequests, fetches, and
[`cy.intercept()`](/api/commands/intercept) requests to the
[Command Log](/guides/core-concepts#Command-Log). The `Cypress.RequestLogs` API
can be used to fine-tune which logs are displayed.

## Syntax

```typescript
// disable logging of all XMLHttpRequests and fetches
Cypress.RequestLogs.showAllXhrFetch = false

// show all requests to the API server
Cypress.RequestLogs.showAllXhrFetch = false
Cypress.RequestLogs.filter = (request) => {
  return request.url.includes('api.my-site.com')
}

// show only XHRs/fetches to the current origin
Cypress.RequestLogs.showAllXhrFetch = false
Cypress.RequestLogs.filter = (request) => {
  return (
    request.url.startsWith(window.location.origin) &&
    ['xhr', 'fetch'].includes(request.resourceType)
  )
}

// show cy.intercepts, unless they're for an image
Cypress.RequestLogs.showAllIntercepts = false
Cypress.RequestLogs.filter = (request) => {
  return request.matchedIntercept && request.resourceType !== 'image'
}
```

## API

### `Cypress.RequestLogs.showAllXhrFetch`

By default, Cypress logs all XHRs and fetches. By setting this property to
`false`, you can disable this default behavior.

After changing this to `false`, you can selectively enable specific XHR/fetch
logs via `Cypress.RequestLogs.filter`.

Example usage:

```typescript
// disable logging of all XMLHttpRequests and fetches
Cypress.RequestLogs.showAllXhrFetch = false
```

### `Cypress.RequestLogs.showAllIntercepts`

By default, Cypress logs all request that match a
[`cy.intercept()`](/api/commands/intercept) rule. By setting this property to
`false`, you can disable this default behavior.

After changing this to `false`, you can selectively enable specific
[`cy.intercept()`](/api/commands/intercept) request logs via
`Cypress.RequestLogs.filter`.

Note: Setting this to `false` can make it a lot more difficult to debug issues
with [`cy.intercept()`](/api/commands/intercept), so be careful. It's good
practice to set a `Cypress.RequestLogs.filter` that will still show all matched
intercepts except for the undesired ones.

### `Cypress.RequestLogs.filter`

`RequestLogs.filter` can be used to set a custom filter function for request
logs. If the function returns `true`, the log will be displayed.

`RequestLogs.filter` is only called if the request does not get displayed via
`showAllXhrFetch` or `showAllIntercepts`.

Example usage:

```typescript
// show all <script> requests
Cypress.RequestLogs.filter = (request) => {
  return request.resourceType === 'script'
}
```

The `request` object passed to `RequestLogs.filter` has the following
properties:

| Property               | Type      | Description                                                                                                                                                                                                                 |
| ---------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `method`               | `string`  | HTTP method of the request.                                                                                                                                                                                                 |
| `url`                  | `string`  | URL of the request.                                                                                                                                                                                                         |
| `headers`              | `object`  | The request's HTTP headers.                                                                                                                                                                                                 |
| `matchedIntercept`     | `boolean` | `true` if the request matched a [`cy.intercept()`](/api/commands/intercept) route, `false` otherwise.                                                                                                                       |
| `resourceType`         | `string`  | The resource type being requested, as defined by the browser. Possible values are: `document`, `fetch`, `xhr`, `websocket`, `stylesheet`, `script`, `image`, `font`, `cspviolationreport`, `ping`, `manifest`, and `other`. |
| `originalResourceType` | `string`  | The browser's resource type string. May differ across browsers.                                                                                                                                                             |

## History

| Version | Changes                      |
| ------- | ---------------------------- |
| 12.0.0  | Added `Cypress.RequestLogs`. |
