---
title: 'Vue API'
---

## Methods

### mount

```js
// Vue 3
import { mount } from 'cypress/vue'

// Vue 2
import { mount } from 'cypress/vue2'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Used for mounting Vue components in isolation. It is
      responsible for rendering the component within Cypress's sandboxed iframe and
      handling any framework-specific cleanup.
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>mount(originalComponent: { new (...args: any[]): {}; __vccOpts: any; }, options?: <a href="#MountOptions">MountOptions</a>): Cypress.Chainable&lt;VueWrapper&gt;</td>
  </tr>
</table>

#### Parameters

<table class="api-table">
  <caption>originalComponent</caption>
  <tr>
    <td>Description</td>
    <td>The component to mount in test</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>React.ReactNode</td>
  </tr>
</table>

<table class="api-table">  
  <caption>options</caption>
  <tr>
    <td>Description</td>
    <td>The options for mounting the component</td>
  </tr>
  <tr>
    <td>Type</td>
    <td> <a href="#MountOptions">MountOptions</a> (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

#### Returns

A Cypress
[chainable](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands) of
VueWrapper.

## Interfaces

### MountOptions

Union of [StyleOptions](#StyleOptions) &
([Vue 3 MountingOptions](https://test-utils.vuejs.org/api/#mount) or
[Vue 2 MountingOptions](https://v1.test-utils.vuejs.org/api/options.html)) from
[Vue Test Utils](https://test-utils.vuejs.org/)

### StyleOptions

<table class="api-table">
  <caption>cssFile / cssFiles</caption>
  <tr>
    <td>Description</td>
    <td>Creates &lt;style&gt;...&lt;/style&gt; element and inserts given CSS.</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string (optional) | string[] (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

<table class="api-table">
  <caption>style / styles</caption>
  <tr>
    <td>Description</td>
    <td>Creates &lt;style&gt;...&lt;/style&gt; element and inserts given CSS.</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string (optional) | string[] (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

<table class="api-table">
  <caption>stylesheet / stylesheets</caption>
  <tr>
    <td>Description</td>
    <td>Creates &lt;link href="..." /&gt; element for each stylesheet</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string (optional) | string[] (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>
