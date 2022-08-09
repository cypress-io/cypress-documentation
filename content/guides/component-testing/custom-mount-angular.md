---
title: Custom Mount Commands for Angular
---

In some instances you may find yourself doing repetitive work during mounting.
In order to reduce boilerplate you may find it useful to create a custom mount
command.

### Default Declarations, Providers, or Imports

If you find yourself registering a bunch of declarations, providers, or imports
in your individual tests, we recommend doing them all within a custom
`cy.mount()` command. The overhead is usually minimal for all your tests and it
helps keep your spec code clean.

Below is a sample that registers several default component declarations while
still allowing additional ones to be passed in via the config param. The same
pattern can also be applied to providers and module imports.

<code-group>
<code-block label="support/component.ts" active>

```ts
import { Type } from '@angular/core'
import { mount, MountConfig } from 'cypress/angular'
import { ButtonComponent } from 'src/app/button/button.component'
import { CardComponent } from 'src/app/card/card.component'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof customMount
    }
  }
}

const declarations = [ButtonComponent, CardComponent]

function customMount<T>(component: string | Type<T>, config?: MountConfig<T>) {
  if (!config) {
    config = { declarations }
  } else {
    config.declarations = [...(config?.declarations || []), ...declarations]
  }
  return mount<T>(component, config)
}

Cypress.Commands.add('mount', customMount)
```

</code-block>
</code-group>

This custom mount command will allow you to skip manually passing in the
`ButtonComponent` and `CardComponent` as declarations into each `cy.mount()`
call.

### autoSpyOutputs

Here is an example of defaulting `autoSpyOutputs` for every mounted component:

<code-group>
<code-block label="support/component.ts" active>

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add(
  'mount',
  (component: Type<unknown> | string, config: MountConfig<T>) => {
    return mount(component, {
      ...config,
      autoSpyOutputs: true,
    })
  }
)
```

</code-block>
</code-group>

<Alert type="warning">

The `autoSpyOutput` flag only works when passing in a component to the mount
function. It currently does not work with the template syntax.

</Alert>

## Conclusion

At this point, you should be able to setup a complex application and mount
components that use all of Angular's language features.

Congrats! Happy building. 🎉

<NavGuide prev="/guides/component-testing/slots-angular" />
