---
title: Component Troubleshooting
---

<CtBetaAlert></CtBetaAlert>

This guide covers some common issues specific to Cypress Component Testing.

For more general troubleshooting of Cypress, visit the main
[Troubleshooting Guide](/guides/references/troubleshooting). For information on
migrating to Cypress v10.0, visit the
[Migration Guide](/guides/references/migration-guide#Migrating-to-Cypress-version-10-0).

## Common Issues

### Spec File Doesn't Appear in the Spec Explorer

If something appears missing from the spec list, make sure the files have the
[proper extension and the `specPattern` is correctly defined](/guides/component-testing/component-framework-configuration#Spec-Pattern-for-Component-Tests).

### ESLint Global Errors

You may experience ESLint errors in your code editor after migrating to Cypress
`v10.0.0` or while using a framework (e.g. Create React App) that has ESLint
rules which cause the Cypress globals to error.

Installing and configuring the
[`eslint-plugin-cypress`](https://www.npmjs.com/package/eslint-plugin-cypress)
often helps to solve this.

### The TypeScript Types for `cy.mount` is Not Working in Component Tests

In some instances, TypeScript might not recognize the custom `cy.mount()`
command in Cypress spec files not located in the _cypress_ directory. You will
get a compiler error specifying that the type is not found in this case.

A quick way to fix this is to include the _cypress_ directory in your
_tsconfig.json_ options like so:

```json
"include": [
  "src",
  "cypress"
]
```

TypeScript will now monitor all files in the _cypress_ folder and pick up the
typings defined in the _cypress/support/component.ts_ file.

Alternatively, you can move your typings to an external file and include that
file in your _tsconfig.json_ file. See our
[TypeScript Configuration](guides/tooling/typescript-support#Using-an-External-Typings-File)
guide for more info on doing this.

### Cypress Types Conflict with Jest

For frameworks that include Jest out of the box (like Create React App), you
might run into issues where the Cypress global types for TypeScript conflict
with Jest global types (`describe`, `test`, `it`, etc..). In this case, other
Cypress globals like `Cypress` and `cy` might not be working properly either.

We are currently investigating better ways to handle this, but for the time
being, we recommend using a
[triple slash references directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-)
to instruct the TypeScript compiler to look at the Cypress global types in each
of your affected spec files:

```
/// <reference types="cypress" />
```

<!--
Some frameworks or libraries are strongly opinionated about TypeScript
configuration. For example, Create React App assumes the root level
`tsconfig.json` is the source of truth for compiling your application. CRA comes
with Jest integrated, but does not support additional tsconfig files.

<Alert type="info">

**⚠️ There is currently an open CRA issue about this:**

- [Multiple TS compiler settings in CRA](https://github.com/facebook/create-react-app/issues/6023)
- [How this affects users of Cypress, Storybook, etc](https://github.com/facebook/create-react-app/issues/6023#issuecomment-1121363489)

</Alert>
-->

**Alternatively, Relocate Component Specs**

You can also group your Cypress tests and Jest tests inside separate folders
(not co-located with components).

You will need to add a `tsconfig.json` to the folder and specify the types the
files inside that folder should use.

Don't forget to update your
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
[example Next.js application](https://github.com/cypress-io/cypress-component-testing-apps/blob/v10-complete/react-next12-ts/next.config.js)
for a demonstration of this configuration.

</Alert>
