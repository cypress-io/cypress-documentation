---
title: Component Testing FAQ
---

## General Questions

### What is component testing?

Many modern front-end UI libraries encourage writing applications using small,
reusable building blocks known as components. Components start small (think
buttons, images, inputs, etc.) and can be composed into larger components (order
forms, date pickers, menus, etc.) and even entire pages.

Component testing is about testing an individual component in isolation from the
rest of the app. This allows only having to worry about the component's
functionality and not how it fits into an entire page.

### What frameworks does component testing support?

We support [Angular](/guides/component-testing/angular/overview),
[React](/guides/component-testing/react/overview),
[Svelte](/guides/component-testing/svelte/overview), and
[Vue](/guides/component-testing/vue/overview) currently for component testing.

We also support several meta-frameworks like Next.js, Create React App, and
Nuxt, as well as Webpack and Vite for bundling. Check each framework's overview
guide for more info.

### How does Cypress do component testing?

Cypress will take a component and mount it into a blank canvas. When doing so,
you have direct access to the component's API, making it easier to pass in props
or data and put a component in a certain state. From there, you can use the same
Cypress commands, selectors, and assertions to write your tests.

Cypress supports multiple frameworks and development servers for component
testing.

### When should I use component testing vs end-to-end testing?

The biggest difference between end-to-end testing and component testing is that
an end-to-end test "visits" an entire page, and a component test "mounts"
individual components. You set up a component test by passing any
data/props/events to the component directly versus trying to manipulate a page
UI. Because of this, component tests are typically easier to write, have less
setup, and execute faster.

Use component testing during development to help build out a component's
functionality in a test-driven manner. Feel free to write many tests and cover
all the edge cases.

Use end-to-end testing to validate user journey's through your application as a
whole. Don't repeat the same tests in the component tests; instead, focus on how
an actual user will use the application.

### How does Cypress component testing compare to other options?

When Cypress mounts a component, it does so in an actual browser and not a
simulated environment like jsdom. This allows you to visually see and interact
with the component as you work on it. You can use the same browser-based
developer tools that you are used to when building web applications, such as
element inspectors, modifying CSS, and source debugging.

Cypress Component Testing is built around the same tools and APIs that
end-to-end testing uses. Anyone familiar with Cypress can immediately hop in and
feel productive writing component tests without a large learning curve.
Component tests can also use the vast Cypress ecosystem, plugins, and services
(like [Cypress Dashboard](https://www.cypress.io/dashboard) already available to
complement your component tests.

## Technical Questions

### Why isn't my component rendering as it should?

Any global styles and fonts must be imported and made available to your
component, just like in the application. See our guide on
[Styling Components](/guides/component-testing/styling-components) for more
information on doing so.

### Why doesn't my spec show in the spec explorer?

If something appears missing from the spec list, make sure the files have the
[proper extension and the `specPattern` is correctly defined](/guides/component-testing/component-framework-configuration#Spec-Pattern-for-Component-Tests).

### How do I fix ESLint errors for things like using the global Cypress objects?

If you experience ESLint errors in your code editor around Cypress globals,
install the
[`eslint-plugin-cypress`](https://www.npmjs.com/package/eslint-plugin-cypress)
ESLint plugin.

### Why isn't TypeScript recognizing the global Cypress objects or custom cypress commands (eg: `cy.mount`)?

In some instances, TypeScript might not recognize the custom `cy.mount()`
command in Cypress spec files not located in the **cypress** directory. You will
get a compiler error specifying that the type is not found in this case.

A quick way to fix this is to include the **\_**cypress**\_** directory in your
**\_**tsconfig.json**\_** options like so:

```json
"include": [
  "src",
  "cypress"
]
```

TypeScript will monitor all files in the **cypress** folder and pick up the
typings defined in the **cypress/support/component.ts** file.

Alternatively, you can move your typings to an external file and include that
file in your **tsconfig.json** file. See our
[TypeScript Configuration](guides/tooling/typescript-support#Using-an-External-Typings-File)
guide for more info on doing this.

### How do I get TypeScript to recognize Cypress types and not Jest types?

For frameworks that include Jest out of the box (like Create React App), you
might run into issues where the Cypress global types for TypeScript conflict
with Jest global types (`describe`, `test`, `it`, etc..). In this case, other
Cypress globals like `Cypress` and `cy` might not be working properly either.

We are currently investigating better ways to handle this, but for the time
being, we recommend using a
[triple slash references directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-)
to instruct the TypeScript compiler to look at the Cypress global types in each
of your affected spec files:

```
/// <reference types="cypress" />
```

<!--
Some frameworks or libraries are strongly opinionated about TypeScript
configuration. For example, Create React App assumes the root level
`tsconfig.json` is the source of truth for compiling your application. CRA comes
with Jest integrated but does not support additional tsconfig files.

<Alert type="info">

**⚠️ There is currently an open CRA issue about this:**

- [Multiple TS compiler settings in CRA](https://github.com/facebook/create-react-app/issues/6023)
- [How this affects users of Cypress, Storybook, etc](https://github.com/facebook/create-react-app/issues/6023#issuecomment-1121363489)

</Alert>
-->

**Alternatively, Relocate Component Specs**

You can also group your Cypress and Jest tests inside separate folders (not
co-located with components).

You will need to add a `tsconfig.json` to the folder and specify the types the
files inside that folder should use.

Don't forget to update your
[`specPattern`](https://docs.cypress.io/guides/references/configuration#component)
to include the new file location.
