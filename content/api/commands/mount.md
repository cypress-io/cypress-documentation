---
title: mount
componentSpecific: true
---

<CtBetaAlert></CtBetaAlert>

Cypress does not have a built-in `cy.mount()` command. The command must be set
up in your support file. By default, when you use Cypress to
[configure](guides/component-testing/component-framework-configuration#Automatic-Configuration-Recommended)
your project, one will be automatically scaffolded for you.

This guide covers how to customize the `cy.mount()` command to fit the needs of
your app.

We recommend setting up a custom `cy.mount()` command instead of importing the
mount command from the mounting libraries. Doing so offers a few advantages:

- You don't need to import the mount command into every test as the `cy.mount()`
  command is available globally.
- You can set up common scenarios that you usually have to do in each test, like
  wrapping a component in a
  [React Provider](https://reactjs.org/docs/context.html) or adding
  [Vue plugins](https://vuejs.org/v2/guide/plugins.html).

Let's take a look at how to implement the command.

## Creating a New `cy.mount()` Command

::include{file=partials/import-mount-functions.md}

To use `cy.mount()`, add a [custom command](/api/cypress-api/custom-commands) to
the commands file using
[`Cypress.Commands.add()`](/api/cypress-api/custom-commands). Below are examples
to start with for your commands:

<code-group-react-vue2-vue3-angular>
<template #react>

```js
import { mount } from 'cypress/react'

Cypress.Commands.add('mount', (component, options) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{component}</MyProvider>, options)
  return mount(component, options)
})
```

</template>
<template #vue2>

```js
import { mount } from 'cypress/vue-2'

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.extensions = options.extensions || {}
  options.extensions.plugins = options.extensions.plugins || []
  options.extensions.components = options.extensions.components || {}

  /* Add any global plugins */
  // options.global.plugins.push({
  //   install(app) {
  //     app.use(MyPlugin);
  //   },
  // });

  /* Add any global components */
  // options.global.components['Button'] = Button;

  return mount(component, options)
})
```

</template>
<template #vue3>

```js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.stubs = options.global.stubs || {}
  options.global.stubs['transition'] = false
  options.global.components = options.global.components || {}
  options.global.plugins = options.global.plugins || []

  /* Add any global plugins */
  // options.global.plugins.push({
  //   install(app) {
  //     app.use(MyPlugin);
  //   },
  // });

  /* Add any global components */
  // options.global.components['Button'] = Button;

  return mount(component, options)
})
```

</template>
<template #angular>

```js
import { mount } from 'cypress/angular'

Cypress.Commands.add('mount', (component, config) => {
  return mount(component, config)
})
```

</template>
</code-group-react-vue2-vue3-angular>

## Adding TypeScript Typings for `cy.mount()` Commands

When working in
[TypeScript](https://docs.cypress.io/guides/tooling/typescript-support), you
will need to add custom typings for your commands to get code completion and to
avoid any TypeScript errors.

The typings need to be in a location that any code can access, therefore, we
recommend creating a `cypress.d.ts` file in the root directory, and use this
example as a starting point for customizing your own command:

<code-group-react-vue-angular>
<template #react>

```ts
import { mount } from 'cypress/react'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}
```

</template>
<template #vue>

```ts
import { mount } from 'cypress/vue'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1]

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}
```

</template>
<template #angular>

```ts
import { mount } from 'cypress/angular'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}
```

</template>
</code-group-react-vue-angular>

If your tests have trouble finding the types for the custom commands, manually
include the `cypress.d.ts` file in all your `tsconfig.json` files like so:

```json
"include": ["./src", "cypress.d.ts"]
```

## Additional Mount Command Examples

Visit the guides for scenarios in
[React](/guides/component-testing/custom-mount-react),
[Vue](/guides/component-testing/custom-mount-vue), and
[Angular](/guides/component-testing/custom-mount-angular) for customizing a
mount command.
