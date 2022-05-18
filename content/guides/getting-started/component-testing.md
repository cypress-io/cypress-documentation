---
title: Testing Your Components with Cypress
---

Cypress Component Testing provides a **testable component workbench** for you to
quickly build and test any component — no matter how simple or complex.

<!-- TODO: Simple example of icons and percy -->
<!-- TODO: Complex, heavy with business domain -->

Our test runner is browser-based, which allows you to test-drive your
component's **styles and API** and **isolate your component away from the page
it'll be rendered in**. Isolating your components out of your website enables
you to further break down work into more manageable chunks and ultimately
results in components built mindfully.

<video loop="true" controls autoplay="true" style="border-radius: 8px; border: 1px solid #eaeaea;">
  <source src="/img/vuetify-color-picker-example.webm" type="video/webm">
</video>

<p style="font-size: 0.85rem; text-align: center;"><a href="https://vuetifyjs.com/en/components/color-pickers/">Vuetify's</a> VColorPicker tests, after being moved to Cypress from Jest.</p>

For additional reading, we encourage folks to check out the
[Component Driven](https://componentdriven.org) organization, which talks about
the pros of component-driven development and may aide you when trying to figure
out if you should be taking a page-based or component-based approach to building
and testing a given feature.

### Component vs. End-to-End in a Nutshell

We cover the differences between component and end-to-end testing in-depth in
the ["Choosing your testing type"]() guide.

But in short, Cypress Component Testing uses the same Cypress test runner,
commands, and API to test components instead of pages.

The primary technical difference is that your components are built using a
development server, instead of rendered within the context of a complete
website. This results in tests that are faster and have fewer dependencies on
infrastructure than end-to-end tests that cover the same code paths.

Lastly, Cypress's API is user-centric and built for testing things that render
in the web. Therefor, many of your tests will appear framework-agnostic and
**approachable for developers coming from any background**.

### Next Steps

Learn the mount syntax.
