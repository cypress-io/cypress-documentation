---
title: 'React Component Testing'
---

## Framework Support

Cypress Component Testing supports React 16+ in a variety of different
frameworks:

- Create React App
- Next.js
- React with Vite
- React with Webpack

## Tutorial

Visit the [React Quickstart Guide](/guides/component-testing/quickstart-react)
for a step-by-step tutorial.

## Installation

To get up and running with Cypress Component Testing in React, install Cypress
into your project:

```bash
npm i cypress -D
```

Open Cypress:

```bash
npx cypress open
```

<DocsImage 
  src="/img/guides/component-testing/select-test-type.jpg" 
  caption="Choose Component Testing"> </DocsImage>

The Cypress Launchpad will guide you through configuring your project.

For a step-by-step guide through the installation wizard, refer to the
[Configure Component Testing](/guides/component-testing/quickstart-react#Configuring-Component-Testing)
section of the React quickstart guide.

## Usage

### What is the Mount Function?

We ship a `mount` function that is imported from the `cypress` package. It is
responsible for rendering components within Cypress's sandboxed iframe and
handling any framework-specific cleanup.

```js
// React 18
import { mount } from 'cypress/react18'

// React 16, 17
import { mount } from 'cypress/react'
```

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```ts
import { mount } from 'cypress/react'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command, as well as customizing it to fit
your needs. For more info, visit the
[Custom Mount Commands](/guides/component-testing/examples-react#Custom-Mount-Commands)
section in the React examples.

### Using `cy.mount()`

To mount a component with `cy.mount()`, import the component and pass it to the
method:

```ts
import { Stepper } from './stepper'

it('mounts', () => {
  cy.mount(<Stepper />)
})
```

### Passing Data to a Component

You can pass props to a component by setting them on the JSX passed into
`cy.mount()`:

```ts
it('mounts', () => {
  cy.mount(<Stepper initial={100} onChange={() => {}} />)
})
```
