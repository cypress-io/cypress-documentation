---
title: Component Testing Overview
---

<CtBetaAlert></CtBetaAlert>

Cypress Component Testing provides a **testable component workbench** for you to
quickly build and test components from multiple front-end UI libraries — no
matter how simple or complex.

Our Test Runner is browser-based, which allows you to test-drive your
component's **styles and API** and **isolate your component away from the page
Cypress will render it in**. Separating the components of your website enables
you to further break down work into more manageable chunks and ultimately
results in components built mindfully.

<video loop="true" controls autoplay="true" style="border-radius: 8px; border: 1px solid #eaeaea;">
  <source src="/img/vuetify-color-picker-example.webm" type="video/webm">
</video>
<p style="font-size: 0.85rem; text-align: center;"><a href="https://vuetifyjs.com/en/components/color-pickers/">Vuetify's</a> VColorPicker tests, after being moved to Cypress from Jest.</p>

### Supported Frameworks

We support the following frameworks for component testing:

- [React](/guides/component-testing/react/introduction)
- [Angular](/guides/component-testing/angular/introduction)
- [Vue](/guides/component-testing/vue/introduction)
- [Svelte](/guides/component-testing/svelte/introduction)

For additional reading, we encourage folks to check out the
[Component Driven](https://componentdriven.org) organization, which talks about
the pros of component-driven development and may aid you when trying to figure
out if you should be taking a page-based or component-based approach to building
and testing a given feature.

### Component vs. End-to-End in a Nutshell

We cover the differences between component and end-to-end testing in-depth in
the [Choosing a Testing Type](/guides/core-concepts/testing-types) guide.

But in short, Cypress Component Testing uses the same test runner, commands, and
API to test components instead of pages.

The primary difference is that Cypress Component Testing builds your components
using a development server instead of rendering within a complete website, which
results in faster tests and fewer dependencies on infrastructure than end-to-end
tests covering the same code paths.

Lastly, Cypress's API is user-centric and built for testing things that render
on the web. Therefore, many of your tests will appear framework-agnostic and
**approachable for developers coming from any background**.
