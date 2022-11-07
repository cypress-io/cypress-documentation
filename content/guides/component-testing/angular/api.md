---
title: 'Angular API'
---

## Methods

### mount

```js
import { mount } from 'cypress/angular'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Mounts an Angular component inside Cypress browser
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>mount&lt;T&gt;(component: Type&lt;T&gt; | string, config?: MountConfig&lt;T&gt;): Cypress.Chainable&lt;MountResponse&lt;T&gt;&gt;</td>
  </tr>
  <tr>
    <td>Returns</td>
    <td>Cypress.Chainable&lt;MountResponse&gt;</td>
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
    <td>Type<T> | string</td>
    <td>Angular component being mounted or its template</td>
  </tr>
  <tr>
    <td>config</td>
    <td></td>
    <td>MountConfig&lt;T&gt; (optional)</td>
  </tr>
</table>

#### Example

```ts
import { mount } from '@cypress/angular'
import { StepperComponent } from './stepper.component'
import { MyService } from 'services/my.service'
import { SharedModule } from 'shared/shared.module'
it('mounts', () => {
  mount(StepperComponent, {
    providers: [MyService],
    imports: [SharedModule],
  })
  cy.get('[data-cy=increment]').click()
  cy.get('[data-cy=counter]').should('have.text', '1')
})

// or

it('mounts with template', () => {
  mount('<app-stepper></app-stepper>', {
    declarations: [StepperComponent],
  })
})
```

### createOutputSpy

```js
import { createOutputSpy } from 'cypress/angular'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Creates a new Event Emitter and then spies on it's `emit` method
    </td>  
  </tr>
  <tr>
    <td>Signature</td>
    <td>(alias: string) => any</td>
  </tr>
  <tr>
    <td>Returns</td>
    <td>EventEmitter&lt;T&gt;</td>
  </tr>
</table>

<table class="api-table">
  <caption>createOutputSpy parameters</caption>
    <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>alias</td>
    <td>string</td>
    <td>alias name you want to use for your cy.spy() alias</td>
  </tr>
</table>

#### Example

```ts
import { StepperComponent } from './stepper.component'
import { mount, createOutputSpy } from '@cypress/angular'

it('Has spy', () => {
  mount(StepperComponent, { change: createOutputSpy('changeSpy') })
  cy.get('[data-cy=increment]').click()
  cy.get('@changeSpy').should('have.been.called')
})
```

## Interfaces

### MountConfig

Additional module configurations needed while mounting the component, like
providers, declarations, imports and even component @Inputs()

<table class="api-table">
  <caption>members</caption>
    <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>autoSpyOutputs</td>
    <td>boolean (optional)</td>
    <td>flag to automatically create a cy.spy() for every component @Output() property</td>
  </tr>
  <tr>
    <td>autoDetectChanges</td>
    <td>boolean (optional)</td>
    <td>flag defaulted to true to automatically detect changes in your components</td>
  </tr>
  <tr>
    <td>componentProperties</td>
    <td>Partial&lt;{[P in keyof T]: T[P];}&gt; (optional)</td>
    <td></td>
  </tr>
</table>

### MountResponse

Type that the `mount` function returns

<table class="api-table">
  <caption>members</caption>
    <thead>
    <td>Name</td>
    <td>Type</td>
    <td>Description</td>
  </thead>
  <tr>
    <td>fixture</td>
    <td>ComponentFixture&lt;T&gt;</td>
    <td>Fixture for debugging and testing a component.</td>
  </tr>
  <tr>
    <td>component</td>
    <td>T</td>
    <td>The instance of the root component class</td>
  </tr>
</table>

See
[https://angular.io/api/core/testing/ComponentFixture#componentInstance](https://angular.io/api/core/testing/ComponentFixture#componentInstance)
