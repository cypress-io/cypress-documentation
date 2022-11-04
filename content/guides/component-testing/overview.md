---
title: Cypress Component Testing
---

Cypress Component Testing provides a **testable component workbench** for you to
quickly build and test components from multiple front-end UI libraries — no
matter how simple or complex.

## Quick Example

This is a minimal test to assert a button has the correct text in each of our
supported frameworks ([React](/guides/component-testing/react/overview),
[Angular](/guides/component-testing/angular/overview),
[Vue](/guides/component-testing/vue/overview), and
[Svelte](/guides/component-testing/svelte/overview)). For more in-depth tutorial
and examples, view each guides section.

<code-group>
<code-block label="React" active>

```ts
import Button from './Button'

it('uses custom text for the button label', () => {
  cy.mount(<Button>Click me!</Button>)
  cy.get('button').should('contains.text', 'Click me!')
})
```

</code-block>
<code-block label="Angular">

```ts
import ButtonComponent from './button.component'

it('uses custom text for the button label', () => {
  cy.mount('<app-button>Click me!</app-button>', {
    declarations: [ButtonComponent],
  })
  cy.get('button').should('contains.text', 'Click me!')
})
```

</code-block>
<code-block label="Vue">

```ts
import Button from './Button.vue'

it('uses custom text for the button label', () => {
  cy.mount(Button, {
    slots: {
      default: 'Click me!',
    },
  })
  cy.get('button').should('contains.text', 'Click me!')
})
```

</code-block>
<code-block label="Svelte">

```ts
import Button from './Button.svelte'

it('uses custom text for the button label', () => {
  cy.mount(Button, { props: { msg: 'Click me!' } })
  cy.get('button').should('contains.text', 'Click me!')
})
```

</code-block>
</code-group>

Our Test Runner is browser-based, which allows you to test-drive your
component's **styles and API** and **isolate your component away from the page
Cypress will render it in**. Separating the components of your website enables
you to further break down work into more manageable chunks and ultimately
results in components built mindfully.

<video loop="true" controls autoplay="true" style="border-radius: 8px; border: 1px solid #eaeaea;">
  <source src="/img/vuetify-color-picker-example.webm" type="video/webm">
</video>
<p style="font-size: 0.85rem; text-align: center;"><a href="https://vuetifyjs.com/en/components/color-pickers/">Vuetify's</a> VColorPicker tests, after being moved to Cypress from Jest.</p>

## Supported Frameworks

Cypress currently has official mounting libraries for
[React](/guides/component-testing/react/overview),
[Angular](/guides/component-testing/angular/overview),
[Vue](/guides/component-testing/vue/overview), and
[Svelte](/guides/component-testing/svelte/overview).

We currently have support for the following development servers and frameworks:

| Framework                                                                                                            | UI Library  | Bundler    |
| -------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| [Create React App 4+](/guides/component-testing/react/overview#Create-React-App-CRA)                                 | React 16+   | Webpack 4+ |
| [Next.js 11+](/guides/component-testing/react/overview#Next-js)                                                      | React 16+   | Webpack 5  |
| [React with Vite](/guides/component-testing/react/overview#React-with-Vite)                                          | React 16+   | Vite 2+    |
| [React with Webpack](/guides/component-testing/react/overview#React-with-Webpack)                                    | React 16+   | Webpack 4+ |
| [Vue CLI](/guides/component-testing/vue/overview#Vue-CLI)                                                            | Vue 2+      | Webpack 4+ |
| [Nuxt 2](/guides/component-testing/vue/overview#Nuxt) <Badge type="info">Beta</Badge>                                | Vue 2+      | Webpack 4+ |
| [Vue with Vite](/guides/component-testing/vue/overview#Vue-with-Vite)                                                | Vue 2+      | Vite 2+    |
| [Vue with Webpack](/guides/component-testing/vue/overview#Vue-with-Webpack)                                          | Vue 2+      | Webpack 4+ |
| [Angular](/guides/component-testing/angular/overview#Framework-Configuration)                                        | Angular 13+ | Webpack 5  |
| [Svelte with Vite](/guides/component-testing/svelte/overview#Svelte-with-Vite) <Badge type="info">Beta</Badge>       | Svelte 3+   | Vite 2+    |
| [Svelte with Webpack](/guides/component-testing/svelte/overview#Svelte-with-Webpack) <Badge type="info">Beta</Badge> | Svelte 3+   | Webpack 4+ |

## Component Testing vs. End-to-End Testing

We cover the differences between component and end-to-end testing in-depth in
the [Choosing a Testing Type](/guides/core-concepts/testing-types) guide.

But in short, Cypress Component Testing uses the same test runner, commands, and
API to test components instead of pages.

The primary difference is that Cypress Component Testing builds your components
using a development server instead of rendering within a complete website, which
results in faster tests and fewer dependencies on infrastructure than end-to-end
tests covering the same code paths.

Cypress's API is user-centric and built for testing anything that renders on the
web. Therefore, many of your tests will appear framework-agnostic and
**approachable for developers coming from any background**.

For additional reading, we encourage folks to check out the
[Component Driven](https://componentdriven.org) organization, which talks about
the pros of component-driven development and may aid you when trying to figure
out if you should be taking a page-based or component-based approach to building
and testing a given feature.
