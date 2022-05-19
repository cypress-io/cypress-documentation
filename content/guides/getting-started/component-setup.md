---
title: Configuring Component Testing
---

Cypress offers **automatic configuration** for supported front-end frameworks
and bundlers.

For first-time setup of React of Vue apps, we strongly recommend using automatic
configuration to create all of the necessary configuration files. If you're
using Angular, Svelte, or another framework with Cypress, you may need to click
"skip" on certain screens during setup, but you'll still be able to scaffold all
of the necessary files to get a basic test running.

Advanced usage: You can _always_ manually configure component testing using the
`devServer` key's function signature.

# Automatic Configuration (Recommended)

You should use the Cypress Launchpad to configure Component Testing for the
first time. To start the setup wizard, simply open
Cypress and choose "Component Testing".

<!-- TODO: Video -->

```shell
cypress open
```

The Launchpad's setup wizard will do the following things:
1. Determine what changes need to be merged into your Cypress Config file.
<!-- see GitHub comment-->
2. Create a component support file for [configuring global styles]() and
   installing component libraries.
3. Globally register the correct `cy.mount` command based on your framework.
4. Create `component-index.html` to let you add your application's fonts and global
   CDN downloads.
5. Add any framework-specific setup to your support files.

<!-- TODO: pic of all the files we make, collapsed -->

Once you click through all of the prompts, you'll be asked to choose a browser
and launch the Cypress App.

<!-- TODO: start cypress, take a pic of Choose a Browser -->

## Creating a file

Cypress has **generators** to help you create specs with ease. Component Testing
currently supports the Blank Spec generator, but a Story Spec generator and
Component Spec generator are both in the works!

Go ahead and click through the UI to create a blank spec at `src/Stepper.cy.js`
(or `src/Stepper.cy.jsx` if you're using JSX.)

```js
it('renders', () => {
  expect(true).to.be.true
})
```

<!-- TODO: photo of running test! -->

At this point, your dev server (Webpack or Vite) will have started in the
background and is compiling your new blank spec.

Cypress re-uses your dev server configuration, so when you add build tooling
like sass, JSX, or autoprefixer to your build configuration, those tools will be
applied to your tests the same way they are to your source code.

If your dev server has compiled your `Stepper.cy.js` spec correctly, you'll get
a passing test. If not, read the [Dev Server Troubleshooting]() section.

<Alert>

**For existing end-to-end projects**

Your first time running Cypress 10, you'll be asked if you want to setup
Component Testing. You can do this now or later.

To configure Component Testing at a later time, click **"Switch Testing Type"**
at the bottom of the Launchpad whenever Cypress is open or choose **"Setup
Component Testing"** before selecting a Testing Type.

<!-- TODO: start cypress, take a pic of Switch Testing Type -->

</Alert>

# Manual Configuration

The minimum number of files required to configure Cypress component testing are:

1. The Cypress Config File

```js
export default {
  component: {},
}
```

<Alert type="warning">

**Troubleshooting Tip**

When there are issues compiling your specs with your build config, for instance
if you're missing a webpack loader, or using JSX syntax if you haven't
configured Vite or Vue CLI properly, this is the point at which you will see
failures.

Try removing all code and re-add your imports in line-by-line.

</Alert>
