---
title: 'Quickstart: Vue'
---

<CtBetaAlert></CtBetaAlert>

To follow along with the docs, you'll need a Vue 3 or Vue 2 application.

The quickest way to get started writing component tests for Vue is to use Vue's
own project scaffolding tool, and then to install and open Cypress. If you
choose to add Cypress during Vue's CLI setup wizard, skip to
["Launch the Cypress App"](#Launch-the-Cypress-App).

This will launch Cypress's Launchpad and create all the necessary files for
getting started.

1. Run the scaffold command

```bash
npm create vue
```

<!-- TODO: Show video of terminal running this command -->

2. Add Cypress if you didn't select it in the Vue scaffolding options

```bash
npm install cypress -D
```

3. Open it and follow the Launchpad's prompts!

```bash
npx cypress open
```

<!-- TODO: while it's nice to have this photo, it'd be even better to have a video! -->

<img src="/img/component-testing-automatic-configuration.png" style="border: none; box-shadow: none; margin-bottom: 1rem;" />
<p style="font-size: 0.85rem; text-align: center;">The Cypress Launchpad will scaffold all of these files for you.</p>

At this point, your project is setup, but has no example spec files. If you were
to create a new file and run Cypress headlessly using `npx cypress run`, you'd
have a passing test!

```js
// src/smoke.cy.js
it('works', () => {
  expect(true).to.be.true
})
```

## Launch the Cypress App

Whenever you run `npx cypress open` for the first time in a project that's been
setup, you'll be dropped into the "Browser Selection" screen.

<!-- TODO: Browser Selection screen with lots of browsers -->

<!-- Extraneous, belongs somewhere else: This page displays all of the browsers on your computer that we support. This generally means you'll see all Chromium-based browsers, Electron, and Firefox that are on your computer.  -->

Pick your favorite and click "Launch" to open the Cypress App.

### In an Empty Project

In an empty project, we'll prompt you to use one of our new spec generators to
create a file that matches your project's `specPattern`.

<!-- TODO: Video of Generator -->

### If You Have Existing Specs

Certain Vue templates will have already set you up with your first component
spec! Awesome.

<!-- TODO: Video of file list, (modifying file and seeing git change?) -->

If that's the case, you'll see the App Spec List instead of the New Spec page.
The App Spec List page shows you all of the specs in your project, as well as
when they were last modified, and their `git` status.

<!-- TODO: link to framework configuration section of the documentation -->

<!-- A detailed walk-through of the Cypress App is available within the [Framework Configuration]() section of the docs. -->

## Next Steps

Learn about the mount command!

<NavGuide next="/guides/getting-started/mounting-vue" />
