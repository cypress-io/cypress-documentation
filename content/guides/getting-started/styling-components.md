---
title: Styling Components
---

<CtBetaAlert></CtBetaAlert>

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to load CSS libraries like Tailwind or Bootstrap
- How to render icon fonts like Font Awesome
- Where to import your application's global stylesheets
- How to use `indexHtmlFile` to define a custom DOM mounting point

</Alert>

# Rendering Components Correctly

The first time you mount _any_ new component, you may notice that the component
doesn't look like it should. Unless your application is written _exclusively_
using Component-scoped CSS (e.g. Styled Components or Vue's Scoped Styles) you
will need to follow this guide in order to get your component looking **and
behaving** like it will in production.

<Alert type="success">
Ensure that whatever you're doing in production is happening within either the Component HTML file or the Component Support File.
</Alert>

## Component Support File

When you load a component or end-to-end spec file, it will first load
something called a supportFile. By default, this is created for you during
first-time setup of Cypress Component Testing and is located at
`cypress/support/component.js`. This file gives you the opportunity to set up
your spec's environment.

For component specs, you use this file to set up page-level concerns that would
usually exist by the time you mount the component. Some examples include:

1. Run-time JavaScript code (state management, routers, UI libraries)
2. Global styles (style resets, Tailwind)

As a rule, your Component Support File should look **very similar** to your
application's `main.js` and `main.css` files.

## 3rd Party CSS Libraries (Tailwind, Bootstrap, PopperJS)

<!--
What you would see is classes being applied in the inspector, but no styles. e.g. bg-red-500 wouldn't do anything, but it would show up in Chrome.

PopperJS (Floating UI) is probably a better example because the UI is malformed -- not just missing. e.g. the :after CSS being semi-visible
-->

Components can have three parts: markup, styles, and script logic. All three of
these work together in order to deliver a working component.

Styles are business logic, too.

<!--
Demonstrate cypress.get('element').should('be.visible')
OR
cy.get('element').click().get('something-else').should('be.visible')

// Demonstrate before and after import of main.css
// in the user's support/component.js file
// and how 'element' becomes visible/not visible
// and how that breaks the test

// What's a good example?
Overlays + Modals are usually really good.
1. Parent covers child (prevents click due to overflow)
2. Child height issues
3. Child visibility issues (opacity)

<template>
  <div class="overlay absolute w-screen h-screen bg-red-500 z-1000">
    <button>X</button>
  </div>
  <div>
    Page content
  </div>
</template>
-->

1. Tailwind
2. CSS Modules
3. Scoped Styled
4. Styled Components
5. Regular Stylesheets
6. UI Libraries

This guide will help you setup your test infrastructure to render your
component's styles properly. Solving certain runtime errors, such as those with
ThemeProviders or Material UI, is covered on the
"[Getting Components to Work](/guides/getting-started/getting-components-to-work)"
page.

Depending on how your application is built, the first time your mount a new
component, it may be completely or somewhat unstyled.

This makes sense. Many applications have some amount of one-time setup that is
run outside of the component file.

We build our applications within the context that they're supposed to run in,
and we make assumptions that our components will always be rendered within a
root-level component (such as an `<App>`) or a top-level selector with style
rules (such as `#app { /* styles in here */ }` )

When we attempt to isolate our component to put it under test, we need to put
that environment back together. We'll go into that in a moment. First, let's
talk about stylesheets, testing, and one of Cypress's biggest differences in
contrast to other component testing tools.

## Why Test Your Component's Styles?

Stylesheets are a critical part of your component's business logic. One of the
best examples of this is a modal component. Common modal bugs include: z-index
issues, inability to dismiss the overlay, and inability to interact with the
parent page _after_ dismissing the modal.

Node-based test runners like Jest or Vitest can't catch these kinds of issues
because they render your styles in **emulated DOM environments** like JSDom.
JSDom doesn't have a box model and certain kinds of assertions, such as if a
parent is covering a child and preventing clicks, are not possible to test
without a more realistic environment.

On the other hand, browser-based runners like Cypress allow you to render your
application's styles and components and allow Cypress's Driver to take advantage
of the real box-model and style rendering engine. Cypress's commands like
`cy.click` and assertions like `should('be.visible')` have business logic that
makes sure the UI you're trying to assert on and interact with is visible and
interactible for your end users. This is a benefit unique to browser-based test
runners.

## Importing Stylesheets

Each application or component library imports styles a little differently. We'll
go over a few methods and describe how you can quickly restructure your
components to become more testable. If you do not follow this guide, your
components will mount, but they won't look correct and you may not be able to
benefit from some of the most valuable parts of Cypress. Namely, implicit checks
for width, height, and overflow to ensure that your components not only exist in
the page's HTML but are also visible.

## Rules for Setting Up Your Styles

All of your Application's styles need to end up in Cypress so that when your
component mounts, it looks right.

We expose two hooks for you to configure your styles:

1. An HTML file called `cypress/support/component-index.html`
2. A JavaScript support file called `cypress/support/component.js`

When creating a production-like test environment, you should _always_ mimic your
own application's setup. If your application has multiple `<link>` tags to load
fonts or other stylesheets within the `head`, ensure that the
`cypress/support/component-index.html` file contains the same `<link>` tags. The
same logic follows for any styles loaded in your Application's `main.js` file.
If you import a `./styles.css` at the top of your `main.js` file, make sure to
import it in your `cypress/support/component.js` file.

For this reason, it's strongly suggested to make a `src/setup.js` file that will
be re-used in your `main.js` entrypoint as well as in your test setup. An
example project structure would look like so:

```
> /cypress
>   /support
>    /component.js
> /src
>  /main.js
>  /main.css
>  /setup.js
```

The contents of **setup.js** may look like so:

```js
import '~normalize/normalize.css'
import 'font-awesome'
import './main.css'

export const createStore = () => {
  return /* store */
}

export const createRouter = () => {
  return /* router */
}

export const createApp = () => {
  return <App router={createRouter()} store={createStore()}></App>
}
```

and its usage in `main.js` could look like so:

```js
import { createApp } from './setup.js'

ReactDOM.render(createApp())
```

and Cypress would re-use it in its support file

```js
/* And that's it! */
import '../../src/setup.js'
```

The rest of this section is dedicated to discussing specific style problems you
may have, including: Fonts, Icon Fonts, Style Resets, Global App Styles, and 3rd
party component library styles.

### Global App Styles

Your global application styles are usually in one of the following places:

1. A `styles.css` file you import within the `head` of your application.

This should be loaded within your Cypress Index HTML file.

2. Within a root-level component like `App.jsx`, `App.vue`, `App.svelte`, etc.

Decouple your Root CSS from your App or Entrypoint component by pulling out
these global styles into a top-level stylesheet. Both Vue and Svelte embed
global application styles into the main entry point components. The rest of your
application expects to be rendered _within_ those components, and so any
assumptions you made when writing those components must be replicated in your
test environment or else your components won't look right.

```vue
<style>
/* In certain scaffolds, the App.vue file does not have a separate styles file */

#app {
  font-family: Sans-serif;
}
</style>
```

Should become

```vue
/* App.vue */
<style src="./app.css" />
```

and

```vue
/* cypress/support/component.js */ import '../../src/app.css'
```

3. Within the `main.js` file of your application (which subsequently mounts your
   root-level component).

Re-using stylesheets that are imported in the beginning of your application was
covered in the last section.

```js
import './main.css'
```

4. Within a configuration file like `next.config.js` or `nuxt.config.js`.

You're usually providing public paths to these stylesheets. You can import the
same paths within your `cypress/support/component-index.html` file.

### CSS Reset or Normalize isn't applied

Are you importing your normalize file within
`cypress/support/component-index.html` or within `cypress/support/component.js`?

### Fonts: Everything is rendering in Times New Roman

Most applications handle fonts in one of two ways.

1. Your `index.html` loads external fonts in the `head` tag.

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&family=Roboto&display=swap"
    rel="stylesheet"
  />
</head>
```

Or via an `@import` statement

```html
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&family=Roboto&display=swap');
  </style>
</head>
```

2. Your main stylesheet loads fonts

```css
/* main.css */
@font-face {
  font-family: 'Fira Sans';
  src: url('fonts/fira/eot/FiraSans-Regular.eot');
  src: url('fonts/fira/eot/FiraSans-Regular.eot') format('embedded-opentype'), url('fonts/fira/woff2/FiraSans-Regular.woff2')
      format('woff2'),
    url('fonts/fira/woff/FiraSans-Regular.woff') format('woff'), url('fonts/fira/woff2/FiraSans-Regular.ttf')
      format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

### Icon Fonts: None of my icons are rendering

### Theme Providers: My components don't look right/compile because they can't access providers

Theme Provider or other application-level wrappers like I18n or Material UI work
by injecting themselves around your application. When you're component testing,
you haven't rendered the component hierarchy surrounding your component.

TO solve issues like these, people review the Custom Commands and Wrappers

---

To first explain why it's not right, you first have to explain what
production-like even means.

So we have this before & after up, and now our job is to step through the
component under test and try to figure out where the differences between
Production and Test are.

Sometimes these are as simple as colors or fonts not lining up. Other times, the
entire component or sections of it may not compile.

The reason this doesn't look right is because:

1. My browser supports dark mode
2. The <App> component provides its own styles
