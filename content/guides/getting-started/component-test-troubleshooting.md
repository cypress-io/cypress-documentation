---
title: Component Troubleshooting
---

<CtBetaAlert></CtBetaAlert>

This guide covers some common issues specific to Cypress Component Testing. For
more general troubleshooting of Cypress, visit the main
[Troubleshooting Guide](/guides/references/troubleshooting).

## Common Issues

### Spec File Doesn't Appear in the Cypress App

If something appears missing from the spec list, make sure the files have the
[proper extension and the `specPattern` is correctly defined](/guides/getting-started/writing-your-first-component-test#Naming-the-spec-file).

### ESLint Global Errors

You may experience ESLint errors in your code editor after migrating to Cypress
`v10.0.0` or while using a framework (e.g. Create React App) that has ESLint
rules which cause the Cypress globals to error.

Installing and configuring the
[`eslint-plugin-cypress`](https://www.npmjs.com/package/eslint-plugin-cypress)
often helps to solve this.

### TypeScript Types Conflict

Some frameworks or libraries are strongly opinionated about TypeScript
configuration. For example, Create React App assumes the root level
`tsconfig.json` is the source of truth for compiling your application. CRA comes
with Jest integrated, but does not support additional tsconfig files.

<Alert type="info">

**⚠️ There is currently an open CRA issue about this:**

- [Multiple TS compiler settings in CRA](https://github.com/facebook/create-react-app/issues/6023)
- [How this affects users of Cypress, Storybook, etc](https://github.com/facebook/create-react-app/issues/6023#issuecomment-1121363489)

</Alert>

Because isolating different tsconfigs for different purposes may not be possible
in your framework, a workaround is necessary to avoid type conflicts between
third party dependencies.

Below are two options that aren't pretty but necessary for some tools with
limited TypeScript support.

**1. Add Directives**

Add a
[TypeScript triple-slash-directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)
to each Cypress spec where type checking is desired. To have them type checked,
you will need to create a `tsconfig.json` for both Cypress and Jest that only
includes those files.

::include{file=partials/intellisense-code-completion.md}

**2. Relocate Component Specs**

Alternatively, you can group your Cypress tests and Jest tests inside separate
folders (not colocated with components).

You will need to add a `tsconfig.json` to the folder and specify the types the
files inside that folder should use.

Don't forget to udpate your
[`specPattern`](https://docs.cypress.io/guides/references/configuration#component)
to include the new file location.

### Next.js Global Style Error

If you import the Next `styles/globals.css` in `cypress/support/component.js` to
style your components, you'll get an error from Next about not allowing
importing global css from files other than your main app file.

To solve this, install the
[`next-global-css`](https://www.npmjs.com/package/next-global-css) package and
update the Next Webpack configuration.

<Alert type="info">

See our <Icon name="github"></Icon>
[example Next application](https://github.com/cypress-io/cypress-component-testing-apps/blob/v10-complete/react-next12-ts/next.config.js)
for a demonstration of this configuration.

</Alert>
