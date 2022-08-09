---
title: Mounting Components
---

Many tests, regardless of framework or type, follow a similar format: **Arrange,
Act, and Assert**. This pattern "Arrange, Act, Assert" was first coined in 2001
by Bill Wilke and is explained thoroughly in his blog post
["3A - Arrange, Act, Assert"](https://xp123.com/articles/3a-arrange-act-assert/).

When it comes to component testing, mounting your component is where we
**Arrange** our component under test. It is analogous to visiting a page in an
end-to-end test.

## What is the Mount Function?

We ship a `mount` function for each front-end framework Cypress supports, which
is imported from the `cypress` package. It is responsible for rendering
components within Cypress's sandboxed iframe and handling any framework-specific
cleanup.

```ts
import { mount } from 'cypress/angular'
```

### Using `cy.mount()` Anywhere

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.ts** file:

<code-group>
<code-block label="cypress/support/component.ts" active>

```ts
import { mount } from 'cypress/angular'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command.

You can customize `cy.mount()` to fit your needs. For instance, if you are using
providers, declarations, or modules your Angular app, you can configure them
here. For more info, see the
[Customizing cy.mount() guide for Angular](/guides/component-testing/custom-mount-angular).

### Your First Component Test

Now that you have a component let's write a spec that mounts the component.

To get started, create a spec file in the same directory as the
`stepper.component.ts` component and name it **stepper.component.cy.ts**. Then
paste the following into it:

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
import { StepperComponent } from './stepper.component'

describe('StepperComponent', () => {
  it('mounts', () => {
    cy.mount(StepperComponent)
  })
})
```

</code-block>
</code-group>

Here, we have a single test that ensures that our component mounts.

## Running the Test

Now it's time to see the test in action. Open up Cypress if it is not already
running:

```bash
npx cypress open --component
```

> The `--component` flag will launch us directly into component testing

And launch the browser of your choice. In the spec list, click on
**stepper.component.cy.ts** and you will see the stepper component mounted in
the test area.

<DocsImage 
  src="/img/guides/component-testing/first-test-run-angular.png" 
  caption="Stepper Mount Test"> </DocsImage>

A basic test that mounts a component in its default state is an excellent way to
start testing. Since Cypress renders your component in a real browser, you have
a lot of advantages, such as seeing that the component renders as it should,
interacting with the component in the test runner, and using the browser dev
tools to inspect and debug both your tests and the component's code.

Feel free to play around with the `StepperComponent` by interacting with the
increment and decrement buttons.

### Configuring Your Component

Angular applications are modular by nature. In fact, Angular has its own
modularity system called `NgModules`. NgModules are containers for a cohesive
block of code dedicated to an application domain, workflow, or a closely related
set of capability. They can contain components, service providers, and other
code files whose scope is defined by the containing NgModule. To summarize, an
NgModule provides a _compilation context_ for it's components. In order to
`mount` your component under test with cypress, you will use the
`MountConfig<T>`, which is an interface that extends
[TestModuleMetadata](https://angular.io/api/core/testing/TestModuleMetadata).
You will find mounting your components with Cypress will feel very ergonomically
Angular.

### Optional Template Support

The mount command has support for Component Class syntax as well as Angular's
template syntax. Generally, we find the template syntax easier to work with and
recommend it for most cases.

For example, we could mount the stepper component from above using the template
syntax like so:

```ts
import { StepperComponent } from './stepper.component'

describe('StepperComponent', () => {
  it('mounts', () => {
    cy.mount(`<app-stepper></app-stepper>`, {
      declarations: [StepperComponent],
    })
  })
})
```

Using the template syntax allows us to write specs in a more succinct way and
feels more natural in Angular. The rest of this guide will use template syntax
when mounting Angular components.

<Alert type="info">

When using template syntax, components will need to be passed in the config's
declarations as shown above. This can be set up globally in a custom
`cy.mount()` command to avoid having to do it in each test. See the
[custom mount commands guide](/guides/component-testing/custom-mount-angular)
for more info.

</Alert>

## Next Steps

Now that we have our component mounted, next we will learn how to write tests
against it.

<NavGuide prev="/guides/component-testing/quickstart-angular" next="/guides/component-testing/testing-angular" />
