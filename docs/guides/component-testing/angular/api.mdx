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
    <td>mount&lt;T&gt;(component: Type&lt;T&gt; | string, config?: <a href="#MountConfig">MountConfig</a>&lt;T&gt;): <a href="/guides/core-concepts/introduction-to-cypress#Chains-of-Commands">Cypress.Chainable</a>&lt;<a href="#MountResponse">MountResponse</a>&lt;T&gt;&gt;</td>
  </tr>
  <tr>
    <td>Generic Param T</td>
    <td>
      The component type
    </td>  
  </tr>
  <tr>
    <td>Returns</td>
    <td><a href="/guides/core-concepts/introduction-to-cypress#Chains-of-Commands">Cypress.Chainable</a>&lt;<a href="#MountResponse">MountResponse</a>&gt;</td>
  </tr>
</table>

#### Parameters

<table class="api-table">
  <caption>component</caption>
  <tr>
    <td>Description</td>
    <td>Angular component being mounted or its template</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>Type<T> | string</td>
  </tr>
</table>

<table class="api-table">  
  <caption>config</caption>
  <tr>
    <td>Description</td>
    <td>configuration used to configure the TestBed</td>
  </tr>
  <tr>
    <td>Type</td>
    <td> <a href="#MountConfig">MountConfig&lt;T&gt;</a> (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>
</table>

#### Example

```ts
import { HelloWorldComponent } from 'hello-world/hello-world.component'
import { MyService } from 'services/my.service'
import { SharedModule } from 'shared/shared.module'
import { mount } from '@cypress/angular'
it('can mount', () => {
  mount(HelloWorldComponent, {
    providers: [MyService],
    imports: [SharedModule],
  })
  cy.get('h1').contains('Hello World')
})

or

it('can mount with template', () => {
  mount('<app-hello-world></app-hello-world>', {
    declarations: [HelloWorldComponent],
    providers: [MyService],
    imports: [SharedModule],
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

#### Parameters

<table class="api-table">
  <caption>alias</caption>
  <tr>
    <td>Description</td>
    <td>name you want to use for your cy.spy() alias</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>string</td>
  </tr>
</table>

## Interfaces

### MountConfig

```js
import { MountConfig } from 'cypress/angular'
```

<table class="api-table">
  <tr>
    <td>Description</td>
    <td>
      Additional module configurations needed while mounting the component, like providers, declarations, imports and even component @Inputs()
    </td>  
  </tr>
  <tr>
    <td>Generic Param T</td>
    <td>
      The component type
    </td>  
  </tr>
  <tr>
    <td>Extends</td>
    <td><a href="https://angular.io/api/core/testing/TestModuleMetadata" target="_blank">TestModuleMetadata</a></td>
  </tr>
</table>

#### Properties

<table class="api-table">
  <caption>autoSpyOutputs</caption>
  <tr>
    <td>Description</td>
    <td>flag to automatically create a cy.spy() for every component @Output() property</td>
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

Example:

```ts
export class ButtonComponent {
  @Output clicked = new EventEmitter()
}

cy.mount(ButtonComponent, { autoSpyOutputs: true })
cy.get('@clickedSpy).should('have.been.called')
```

<table class="api-table">
  <caption>autoDetectChanges</caption>
  <tr>
    <td>Description</td>
    <td>flag defaulted to true to automatically detect changes in your components</td>
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
  <caption>componentProperties</caption>
  <tr>
    <td>Description</td>
    <td>Inputs and Outputs to pass into the component</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>Partial&lt;{[P in keyof T]: T[P];}&gt; (optional)</td>
  </tr>
  <tr>
    <td>Default</td>
    <td>undefined</td>
  </tr>  
</table>

Example:

```ts
import { ButtonComponent } from 'button/button.component'
it('renders a button with Save text', () => {
  cy.mount(ButtonComponent, { componentProperties: { text: 'Save' }})
  cy.get('button').contains('Save')
})

it('renders a button with a cy.spy() replacing EventEmitter', () => {
  cy.mount(ButtonComponent, {
    componentProperties: {
      clicked: cy.spy().as('mySpy)
    }
  })
  cy.get('button').click()
  cy.get('@mySpy').should('have.been.called')
})
```

### MountResponse

```js
import { MountResponse } from 'cypress/angular'
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
  <caption>fixture</caption>
  <tr>
    <td>Description</td>
    <td>Fixture for debugging and testing a component.</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>ComponentFixture&lt;T&gt;</td>
  </tr>
</table>

<table class="api-table">
  <caption>component</caption>
  <tr>
    <td>Description</td>
    <td>The instance of the root component class</td>
  </tr>
  <tr>
    <td>Type</td>
    <td>T</td>
  </tr>
</table>

See
[https://angular.io/api/core/testing/ComponentFixture#componentInstance](https://angular.io/api/core/testing/ComponentFixture#componentInstance)
