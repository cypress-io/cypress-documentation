---
title: 'Svelte API'
---

## Methods

### mount

```js
import { mount } from 'cypress/svelte'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Mounts a Svelte component inside the Cypress browser
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>mount&lt;T extends SvelteComponent&gt;(Component: SvelteConstructor&lt;T&gt;, options?: <a href="#MountOptions">MountOptions</a>&lt;T&gt;): Cypress.Chainable&lt;<a href="#MountReturn">MountReturn</a>&lt;T&gt;&gt;;</td>
  </tr>
  <tr>
    <td>Generic Param T</td>
    <td>
      The component type
    </td>  
  </tr>
  <tr>
    <td>Returns</td>
    <td><a href="/guides/core-concepts/introduction-to-cypress#Chains-of-Commands"
    >Cypress.Chainable</a>&lt;<a href="#MountReturn">MountReturn</a>&gt;</td>
  </tr>
</table>

#### Parameters

<table class="api-table">
  <caption>component</caption>
  <tr>
    <td>Description</td>
    <td>Svelte component being mounted</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>SvelteConstructor<T></td>
  </tr>
</table>

<table class="api-table">  
  <caption>options</caption>
  <tr>
    <td>Description</td>
    <td>options to customize the component being mounted</td>
  </tr>
  <tr>
    <td>Type</td>
    <td> <a href="#MountOptions">MountOptions&lt;T&gt;</a> (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
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

```js
import { MountOptions } from 'cypress/svelte'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Options to customize the component being mounted
    </td>  
  </tr>
  <tr>
    <td>Generic Param T</td>
    <td>
      The component type
    </td>  
  </tr>
</table>

#### Properties

<table class="api-table">
  <caption>anchor</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>Element (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>  
</table>

<table class="api-table">
  <caption>context</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>Map&lt;any, any&gt; (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>  
</table>

<table class="api-table">
  <caption>intro</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>boolean (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>  
</table>

<table class="api-table">
  <caption>log</caption>
  <tr>
    <td>Description</td>
    <td>Log the mounting command into Cypress Command Log, true by default</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>boolean (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>true</td>
  </tr>
</table>

<table class="api-table">
  <caption>props</caption>
  <tr>
    <td>Description</td>
    <td>props to pass into the component</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>Record&lt;string any&gt; (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>  
</table>

### MountReturn

```js
import { MountReturn } from 'cypress/svelte'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Type that the `mount` function returns
    </td>  
  </tr>
  <tr>
    <td>Generic Param T</td>
    <td>
      The component type
    </td>  
  </tr>
</table>

#### Properties

<table class="api-table">
  <caption>component</caption>
  <tr>
    <td>Description</td>
    <td>The instance of the component class</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>T</td>
  </tr>
</table>
