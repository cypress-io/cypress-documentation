---
title: Opening the App
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to start the Cypress app from the command line
- How to start your testing journey with the Launchpad
- How to choose a testing type
- How to launch a browser

</Alert>

## `cypress open`

If you used `npm` to install, Cypress has now been installed to your
`./node_modules` directory, with its binary executable accessible from
`./node_modules/.bin`.

Now you can open Cypress from your **project root** one of the following ways:

**The long way with the full path**

```shell
./node_modules/.bin/cypress open
```

**Or with the shortcut using `npm bin`**

```shell
$(npm bin)/cypress open
```

**Or by using `npx`**

**note**: [npx](https://www.npmjs.com/package/npx) is included with `npm > v5.2`
or can be installed separately.

```shell
npx cypress open
```

**Or by using `yarn`**

```shell
yarn run cypress open
```

After a moment, the Cypress App will launch.

## The Launchpad

TODO Welcome to the Launchpad.

### Choosing a Testing Type

<DocsImage src="/img/guides/getting-started/choose-testing-type.png" alt="Launchpad showing test type selector"></DocsImage>

Now the Launchpad presents you with your first decision: what type of testing
shall I do? <strong>End-to-end testing</strong>, where I run my whole
application and visit pages to test them? Or <strong>component testing</strong>,
where I mount individual components of my app and test them in isolation? For
more background on this critical decision, read
[Testing Types](/guides/core-concepts/testing-types). Alternatively, if you're
not sure which type you want and just want to get on with your testing journey,
just choose End-to-end for now - you can always change this later!

### Quick Configuration

TODO Screenshot & summary of config/scaffolding step.

### Launching a Browser

TODO Screenshot & brief mention of browser selection with link to
/guides/launching-browsers.

## Next Steps

Time to get testing! If you want
[to write your first E2E test, go here](/guides/end-to-end-testing/writing-your-first-end-to-end-test).
Alternatively,
[to get started with component testing go here](/guides/component-testing/testing-your-components-with-cypress).
