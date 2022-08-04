---
title: Custom Mount Commands for Angular
---

In some instances you may find yourself doing repetitive work during mounting.
In order to reduce boilerplate you may find it useful to create a custom mount
command. Here is an example of defaulting `autoSpyOutputs` for every mounted
component:

### autoSpyOutputs

<code-group>
<code-block label="support/component.ts" active>

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      mount<T>(
        component: Type<T> | string,
        config?: MountConfig<T>
      ): Chainable<MountResponse<T>>
    }
  }
}

Cypress.Commands.add('mount', (component: Type<unknown> | string, config) => {
  return mount(component, {
    ...config,
    autoSpyOutputs: true,
  })
})
```

</code-block>
</code-group>

## Conclusion

At this point, you should be able to setup a complex application and mount
components that use all of Angular's language features.

Congrats! Happy building. 🎉

<NavGuide prev="/guides/component-testing/slots-angular" />
