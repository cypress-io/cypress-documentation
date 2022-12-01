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

<table class="api-table table-list">
  <tr>
    <td>Description</td>
    <td>
      Mounts a React component into the DOM.
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>mount(jsx: React.ReactNode, options?: MountOptions, rerenderKey?: string): Cypress.Chainable&lt;MountReturn&gt;</td>
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
    <td>jsx</td>
    <td>React.JSX.Element</td>
    <td>The React component to mount.</td>
  </tr>
  <tr>
    <td>options</td>
    <td>MountOptions (optional)</td>
    <td>The options for mounting the component</td>
  </tr>
  <tr>
    <td>rerenderKey</td>
    <td>string (optional)</td>
    <td>A key to use to force a rerender.</td>
  </tr>
</table>

#### Example

```jsx
import { mount } from '@cypress/react'
import { Stepper } from './Stepper'

it('mounts', () => {
  mount(<StepperComponent />)
  cy.get('[data-cy=increment]').click()
  cy.get('[data-cy=counter]').should('have.text', '1')
}
```

### getContainerEl

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Gets the root element used to mount the component.
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>() => HTMLElement</td>
  </tr>
  <tr>
    <td>Returns</td>
    <td>HTMLElement</td>
  </tr>
</table>

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
    <td>alias</td>
    <td>string (optional)</td>
    <td></td>
  </tr>
  <tr>
    <td>ReactDom</td>
    <td>MountReactComponentOptions.ReactDom (optional)</td>
    <td></td>
  </tr>
  <tr>
    <td>log</td>
    <td>boolean (optional)</td>
    <td>Log the mounting command into Cypress Command Log, true by default</td>
  </tr>
  <tr>
    <td>strict</td>
    <td>boolean (optional)</td>
    <td>Render component in React <a href="https://reactjs.org/docs/strict-mode.html">strict mode</a>
    It activates additional checks and warnings for child components.</td>
  </tr>
</table>

### MountReturn

Type that the `mount` function yields

<table class="api-table">
  <caption>members</caption>
  <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>component</td>
    <td>React.ReactNode</td>
    <td>Render component in React <a href="https://reactjs.org/docs/strict-mode.html">strict mode</a>
    It activates additional checks and warnings for child components.</td>
  </tr>
  <tr>
    <td>rerender</td>
    <td>(component: React.ReactNode) => globalThis.Cypress.Chainable&lt;MountReturn&gt;</td>
    <td>The component that was rendered.</td>
  </tr>
</table>
