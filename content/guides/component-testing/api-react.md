---
title: 'React API'
---

## Methods

### mount

```js
// React 18
import { mount } from 'cypress/react18'

// React 16, 17
import { mount } from 'cypress/react'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Used for mounting React components in isolation. It is
      responsible for rendering the component within Cypress's sandboxed iframe and
      handling any framework-specific cleanup.
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>mount(jsx: React.ReactNode, options?: <a href="#MountOptions">MountOptions</a>, rerenderKey?: string): Cypress.Chainable&lt;<a href="#MountReturn">MountReturn</a>&gt;</td>
  </tr>
  <tr>
    <td>Returns</td>
    <td><a href="/guides/core-concepts/introduction-to-cypress#Chains-of-Commands"
    >Cypress.Chainable</a>&lt;<a href="#MountReturn">MountReturn</a>&gt;</td>
  </tr>
</table>

#### Parameters

<table class="api-table">
  <caption>jsx</caption>
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

<table class="api-table">
  <caption>rerenderKey</caption>
  <tr>
    <td>Description</td>
    <td>..</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

### unmount

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Used for unmounting previously mounted React components.
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>unmount(options?: UnmountArgs): Cypress.Chainable&lt;undefined&gt;;</td>
  </tr>
  <tr>
    <td>Returns</td>
    <td><a href="/guides/core-concepts/introduction-to-cypress#Chains-of-Commands"
    >Cypress.Chainable</a>&lt;undefined&gt;</td>
  </tr>
</table>

#### Parameters

<table class="api-table">
  <caption>options</caption>
  <tr>
    <td>Description</td>
    <td>The options to pass into unmount</td>
  </tr>
  <tr>
    <td>Type</td>
    <td><a href="#UnmountArgs">UnmountArgs</a> (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

## Interfaces

### MountOptions

Union of [StyleOptions](#StyleOptions) &
[MountReactComponentOptions](#MountReactComponentOptions)

### MountReactComponentOptions

<table class="api-table">
  <caption>alias</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

<table class="api-table">
  <caption>ReactDom</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>MountReactComponentOptions.ReactDom (optional)</td>
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
  <caption>strict</caption>
  <tr>
    <td>Description</td>
    <td> Render component in React <a href="https://reactjs.org/docs/strict-mode.html">strict mode</a>
    It activates additional checks and warnings for child components.</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>boolean (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>false</td>
  </tr>
</table>

### MountReturn

<table class="api-table">
  <caption>component</caption>
  <tr>
    <td>Description</td>
    <td>The component that was rendered</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>React.ReactNode</td>
  </tr>
</table>

<table class="api-table">
  <caption>rerender</caption>
  <tr>
    <td>Description</td>
    <td>Rerenders the specified component with new props. This allows testing of components that store state (`setState`) or have asynchronous updates (`useEffect`, `useLayoutEffect`).</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>(component: React.ReactNode) => Cypress.Chainable&lt;<a href="#MountReturn">MountReturn</a>&gt;</td>
  </tr>
</table>

<table class="api-table">
  <caption>unmount</caption>
  <tr>
    <td>Description</td>
    <td>Removes the mounted component.</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>(payload: <a href="#UnmountArgs">UnmountArgs</a>) => void;</td>
  </tr>
</table>

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

### UnmountArgs

<table class="api-table">
  <caption>log</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>boolean</td>
  </tr>
</table>

<table class="api-table">
  <caption>boundComponentMessage</caption>
  <tr>
    <td>Description</td>
    <td></td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>
