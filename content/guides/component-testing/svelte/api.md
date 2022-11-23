---
title: 'Svelte API'
---

## Methods

### mount

```js
import { mount } from 'cypress/svelte'
```

<table class="api-table table-list">
  <tr>
    <td>Description</td>
    <td>
      Mounts a Svelte component inside the Cypress browser
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>mount&lt;T extends SvelteComponent&gt;(Component: SvelteConstructor&lt;T&gt;, options?: MountOptions&lt;T&gt;): Cypress.Chainable&lt;MountReturn&lt;T&gt;&gt;</td>
  </tr>
  <tr>
    <td>Generic Param T</td>
    <td>
      The component type
    </td>  
  </tr>
  <tr>
    <td>Returns</td>
    <td>Cypress.Chainable&lt;MountReturn&gt;</td>
  </tr>
</table>

<table class="api-table">
  <caption>mount Parameters</caption>
    <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>component</td>
    <td>SvelteConstructor<T></td>
    <td>Svelte component being mounted</td>
  </tr>
  <tr>
    <td>options</td>
    <td>MountOptions&lt;T&gt; (optional)</td>
    <td>options to customize the component being mounted</td>
  </tr>
</table>

#### Example

```js
import Counter from './Counter.svelte'
import { mount } from 'cypress/svelte'

it('should render', () => {
  mount(Counter, { props: { count: 42 } })
  cy.get('button').contains(42)
})
```

## Interfaces

### MountOptions

<table class="api-table">
  <caption>members</caption>
    <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>anchor</td>
    <td>Element (optional)</td>
    <td></td>
  </tr>
  <tr>
    <td>context</td>
    <td>Map&lt;any, any&gt; (optional)</td>
    <td></td>
  </tr>
  <tr>
    <td>intro</td>
    <td>boolean (optional)</td>
    <td></td>
  </tr>
  <tr>
    <td>log</td>
    <td>boolean (optional)</td>
    <td></td>
  </tr>
  <tr>
    <td>props</td>
    <td>Record&lt;string any&gt; (optional)</td>
    <td></td>
  </tr>
</table>

### MountReturn

Type that the `mount` function returns

<table class="api-table">
  <caption>members</caption>
    <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>component</td>
    <td>T</td>
    <td></td>
  </tr>
</table>
