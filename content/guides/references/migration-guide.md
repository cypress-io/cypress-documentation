---
title: Migration Guide
---

<DocsVideo src="https://youtube.com/embed/mIqKNhLlPcU"></DocsVideo>

## Migrating to Cypress version 10.0

This guide details the changes and how to change your code to migrate to Cypress
version 10.0.
[See the full changelog for version 10.0](/guides/references/changelog#10-0-0).

### Cypress Changes

- The “Run all specs” and “Run filtered specs” functionality have been removed.
- The experimental "Cypress Studio" has been removed and will be
  rethought/revisited in a later release.
- Unsupported browser versions can no longer be run via `cypress run` or
  `cypress open`. Instead, an error will display.
- In 9.x and earlier versions, `cypress open` would bring you directly to the
  project specs list. In 10.0.0, you must pass `--browser` and `--e2e` or
  `--component` as well to launch Cypress directly to the specs list.

### Configuration File Changes

Cypress now supports JavaScript and TypeScript configuration files. By default,
Cypress will automatically load a `cypress.config.js` or `cypress.config.ts`
file in the project root if one exists. The
[Configuration guide](/guides/references/configuration) has been updated to
reflect these changes, and explains them in greater detail.

Because of this, support for `cypress.json` has been removed. Documentation for
`cypress.json` has been moved to the
[Legacy Configuration guide](/guides/references/legacy-configuration).

Related notes:

- If no config file exists when you open Cypress, the automatic set up process
  will begin and either a JavaScript or TypeScript config file will be created
  depending on what your project uses.
- You may use the `--config-file` command line flag or the `configFile`
  [module API](/guides/guides/module-api) option to specify a `.js` or `.ts`
  file. JSON config files are no longer supported.
- Cypress now requires a config file, so specifying `--config-file false` on the
  command line or a `configFile` value of `false` in the module API is no longer
  valid.
- You can't have both `cypress.config.js` _and_ `cypress.config.ts` files. This
  will result in an error when Cypress loads.
- A
  [`defineConfig()`](/guides/references/configuration#Intelligent-Code-Completion)
  helper function is now exported by Cypress, which provides automatic code
  completion for configuration in many popular code editors. For TypeScript
  users, the `defineConfig` function will ensure the configuration object passed
  into it satisfies the type definition of the configuration file.
- Many pages and examples throughout the documentation have been updated to show
  configuration using `cypress.config.js` and `cypress.config.ts` vs the older
  `cypress.json`. For example:

:::cypress-config-example

```js
{
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
}
```

:::

### Plugins File Removed

Because Cypress now supports JavaScript and TypeScript configuration files, a
separate "plugins file" (which used to default to `cypress/plugins/index.js`) is
no longer needed.

Support for the plugins file has been removed, and it has been replaced with the
new [`setupNodeEvents()`](/guides/references/configuration#setupNodeEvents) and
[`devServer`](/guides/references/configuration#devServer) config options.

Related notes:

- The `cypress/plugins/index.js` plugins file is no longer automatically loaded
  by Cypress.
- The [`setupNodeEvents()`](/guides/references/configuration#setupNodeEvents)
  config option is functionally equivalent to the function exported from the
  plugins file; it takes the same `on` and `config` arguments, and should return
  the same value. See the [Config option changes section](#setupNodeEvents) of
  this migration guide for more details.
- The [`devServer`](/guides/references/configuration#devServer) config option is
  specific to component testing, and offers a much more streamlined and
  consistent way to configure a component testing dev server than using the
  plugins file. See the [Config option changes section](#devServer) of this
  migration guide for more details.
- Many pages and examples throughout the documentation have been updated to show
  configuration in `setupNodeEvents` as well as the legacy plugins file. For
  example:

:::cypress-plugin-example

```js
// bind to the event we care about
on('<event>', (arg1, arg2) => {
  // plugin stuff here
})
```

:::

### Config Option Changes

#### `baseUrl`

The `baseUrl` config option is no longer valid at the top level of the
configuration, and may only be defined inside the
[`e2e`](/guides/references/configuration#e2e) configuration object.

<Alert type="warning">

Attempting to set the `baseUrl` config option at the top level of the
configuration will result in an error when Cypress loads.

</Alert>

#### `componentFolder`

The `componentFolder` config option is no longer used, as it has been replaced
by the `specPattern`
[testing-type specific option](/guides/references/configuration#Testing-Type-Specific-Options).

<Alert type="warning">

Attempting to set the `componentFolder` config option will result in an error
when Cypress loads.

</Alert>

#### `devServer`

All functionality related to starting a component testing dev server previously
in the `pluginsFile` has moved here. These options are not valid at the
top-level, and may only be defined in the
[`component`](/guides/references/configuration#component) configuration object.

Related notes:

- Do not configure your dev server inside `setupNodeEvents()`, use the
  `devServer` config option instead.

<Alert type="info">

See the dev server documentation for the UI framework you’re using for more
specific instructions on what the `devServer` should be for that framework. Some
examples can be found in our
[framework documentation](/guides/component-testing/component-framework-configuration).

</Alert>

**Variant 1 (webpack & vite dev servers)**

<Badge type="danger">Before</Badge>

<code-group>
<code-block label="cypress/plugins/index.js" active>

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('../../webpack.config.js')

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    on('dev-server:start', async (options) =>
      startDevServer({ options, webpackConfig })
    )
  }
}
```

</code-block>
</code-group>

<Badge type="success">After</Badge>

<code-group>
<code-block label="cypress.config.js" active>

```js
const { defineConfig } = require('cypress')
const webpackConfig = require('./webpack.config.js')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react', // or vue
      bundler: 'webpack',
      webpackConfig,
    },
  },
})
```

</code-block>
<code-block label="(verbose)">

```js
const { defineConfig } = require('cypress')
const webpackConfig = require('./webpack.config.js')

module.exports = defineConfig({
  component: {
    devServer(cypressConfig) {
      return devServer({
        framework: 'react', // or vue
        cypressConfig,
        webpackConfig,
      })
    },
  },
})
```

</code-block>
<code-block label="cypress.config.ts">

```js
import { defineConfig } from 'cypress'
import webpackConfig from './webpack.config'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react', // or vue
      bundler: 'webpack',
      webpackConfig,
    },
  },
})
```

</code-block>
<code-block label="(verbose)">

```js
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/webpack-dev-server'
import webpackConfig from './webpack.config'

export default defineConfig({
  component: {
    devServer(cypressConfig) {
      return devServer({
        framework: 'react', // or vue
        cypressConfig,
        webpackConfig,
      })
    },
  },
})
```

</code-block>
</code-group>

**Variant 2 (react plugin dev servers)**

<Badge type="danger">Before</Badge>

```js
const devServer = require('@cypress/react/plugins/react-scripts')

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    injectDevServer(on, config, {})
  }
}
```

<Badge type="success">After</Badge>

<code-group>
<code-block label="cypress.config.js" active>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react', // or vue
      bundler: 'webpack',
    },
  },
})
```

</code-block>
<code-block label="more verbose">

```js
const { defineConfig } = require('cypress')
const webpackConfig = require('./webpack.config.js')

module.exports = defineConfig({
  component: {
    devServer(cypressConfig) {
      return devServer({
        framework: 'react', // or vue
        cypressConfig,
        webpackConfig,
      })
    },
  },
})
```

</code-block>
</code-group>

#### `experimentalStudio`

This option is no longer used. The experimental "Cypress Studio" has been
removed and will be rethought/revisited in a later release.

<Alert type="warning">

Attempting to set the `experimentalStudio` config option will result in an error
when Cypress loads.

</Alert>

#### `ignoreTestFiles` → `excludeSpecPattern`

The `ignoreTestFiles` option is no longer used, and has been replaced with the
`excludeSpecPattern`
[testing-type specific option](/guides/references/configuration#Testing-Type-Specific-Options).

Default values

- `e2e.excludeSpecPattern` default value is `*.hot-update.js` (same as pervious
  ignore value)
- `component.excludeSpecPattern` default value is
  `['/snapshots/*', '/image_snapshots/*']` updated from `*.hot-update.js`
- The `**/node_modules/**` pattern is automatically added to both
  `e2e.specExcludePattern` and `component.specExcludePattern`, and does not need
  to be specified (and can't be overridden).

<Badge type="danger">Before</Badge>

```js
{
  "ignoreTestFiles": "path/to/**/*.js"
}
```

<Badge type="success">After</Badge>

```js
{
  component: {
    excludeSpecPattern: "path/to/**/*.js"
  },
  e2e: {
    excludeSpecPattern: "other/path/to/**/*.js"
  }
}
```

<Alert type="warning">

Attempting to set the `ignoreTestFiles` config option will result in an error
when Cypress loads.

Also, attempting to set the `excludeSpecPattern` config option at the top level
of the configuration will result in an error when Cypress loads.

</Alert>

#### `integrationFolder`

This option is no longer used, as it has been replaced by the `specPattern`
[testing-type specific option](/guides/references/configuration#Testing-Type-Specific-Options).

<Alert type="warning">

Attempting to set the `integrationFolder` config option will result in an error
when Cypress loads.

</Alert>

#### `pluginsFile`

This option is no longer used, and all plugin file functionality has moved into
the [`setupNodeEvents()`](/guides/references/configuration#setupNodeEvents) and
[`devServer`](/guides/references/configuration#devServer) options. See the
[Plugins file removed](#Plugins-file-removed) section of this migration guide
for more details.

<Alert type="warning">

Attempting to set the `pluginsFile` config option will result in an error when
Cypress loads.

</Alert>

#### `setupNodeEvents()`

All functionality related to setting up events or modifying the config,
previously done in the plugins file, has moved into the `setupNodeEvents()`
config options. This option is not valid at the top level of the config, and may
only be defined inside the `component` or `e2e`
[configuration objects](/guides/references/configuration#Testing-Type-Specific-Options).

More information can be found in the
[Plugins API documentation](/api/plugins/writing-a-plugin#Plugins-API) and the
[Configuration API documentation](/api/plugins/configuration-api#Usage).

<Badge type="danger">Before</Badge> `cypress/plugins/index.js`

```js
module.exports = (on, config) => {
  if (config.testingType === 'component') {
    // component testing dev server setup code
    // component testing node events setup code
  } else {
    // e2e testing node events setup code
  }
}
```

<Badge type="success">After</Badge>

:::cypress-config-example{noJson}

```js
{
  component: {
    devServer(cypressConfig) {
      // component testing dev server setup code
    },
    setupNodeEvents(on, config) {
      // component testing node events setup code
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // e2e testing node events setup code
    },
  },
}
```

:::

Alternately, you can continue to use an external plugins file, but you will need
to load that file explicitly, and also update it to move any component testing
dev server code into the [`devServer`](#devServer) config option.

<code-group>
<code-block label="cypress.config.js" active>

```js
const { defineConfig } = require('cypress')
const setupNodeEvents = require('./cypress/plugins/index.js')

module.exports = defineConfig({
  component: {
    devServer(cypressConfig) {
      // component testing dev server setup code
    },
    setupNodeEvents,
  },
  e2e: {
    setupNodeEvents,
  },
})
```

</code-block>
<code-block label="cypress.config.ts">

```js
import { defineConfig } from 'cypress'
import setupNodeEvents from './cypress/plugins/index.js'

export default defineConfig({
  component: {
    devServer(cypressConfig) {
      // component testing dev server setup code
    },
    setupNodeEvents,
  },
  e2e: {
    setupNodeEvents,
  },
})
```

</code-block>
</code-group>

#### `slowTestThreshold`

The `slowTestThreshold` configuration option is no longer valid at the top level
of the configuration, and is now a
[testing-type specific option](/guides/references/configuration#Testing-Type-Specific-Options).

Note that the default values are unchanged (`10000` for `e2e` and `250` for
`component`).

<Alert type="warning">

Attempting to set the `slowTestThreshold` config option at the top level of the
configuration will result in an error when Cypress loads.

</Alert>

#### `supportFile`

The `supportFile` configuration option is no longer valid at the top level of
the configuration, and is now a
[testing-type specific option](/guides/references/configuration#Testing-Type-Specific-Options).
More information can be found in the
[support file docs](/guides/core-concepts/writing-and-organizing-tests#Support-file).

<Badge type="danger">Before</Badge>

```js
{
  "supportFile": "cypress/support/index.js"
}
```

<Badge type="success">After</Badge>

```js
{
  component: {
    supportFile: 'cypress/support/component.js'
  },
  e2e: {
    supportFile: 'cypress/support/e2e.js'
  }
}
```

<Alert type="warning">

Attempting to set the `supportFile` config option at the top level of the
configuration will result in an error when Cypress loads.

Also, for a given testing type, multiple matching `supportFile` files will
result in an error when Cypress loads.

</Alert>

#### `testFiles` → `specPattern`

The `testFiles` option is no longer used, and has been replaced with the
`specPattern` option, which must be defined inside the
[`component`](/guides/references/configuration#component) and
[`e2e`](/guides/references/configuration#e2e) configuration objects.

Default values:

- No longer matches with `.coffee` or `.cjsx`.
- `e2e.specPattern` default value is `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`.
- `component.specPattern` default value is `**/*.cy.{js,jsx,ts,tsx}`.

Important note about matching:

- E2E tests will be found using the `e2e.specPattern` value.
- Component tests will be found using the `component.specPattern` value but any
  tests found matching the `e2e.specPattern` value will be automatically
  excluded.

<Alert type="warning">

Attempting to set the `testFiles` config option will result in an error when
Cypress loads.

Also, attempting to set the `specPattern` config option at the top level of the
configuration will result in an error when Cypress loads.

</Alert>

### Updated Test File Locations

Previously, you could specify the locations of test files and folders using the
configuration options: `componentFolder`, or `integrationFolder`, and
`testFiles`. These options have been replaced with `specPattern`, which is not
valid at the top-level, but within the
[`component`](/guides/references/configuration#component) or
[`e2e`](/guides/references/configuration#e2e) configuration objects. For
example:

<Badge type="danger">Before</Badge>

```js
{
  "componentFolder": "src",
  "integrationFolder": "cypress/integration",
  "testFiles": "**/*.cy.js"
}
```

<Badge type="success">After</Badge>

```js
{
  component: {
    specPattern: 'src/**/*.cy.js'
  },
  e2e: {
    specPattern: 'cypress/integration/**/*.cy.js'
  }
}
```

<Alert type="warning">

Attempting to set `componentFolder`, `integrationFolder`, or `testFiles` in the
config will result in an error when Cypress loads.

</Alert>

<Alert type="danger">

For Cypress Dashboard users, changing your `specPattern` and files names or
extensions of your spec files will result in a loss of data in the Cypress
Dashboard. Because of this, if we detect your project is using the Dashboard
during automatic migration, we won't suggest changing your spec files. We also
don't recommend doing it manually if you are a Dashboard user.

</Alert>

### Generated Files

Generated screenshots and videos will still be created inside their respective
[folders](/guides/references/configuration#Folders-Files) (`screenshotsFolder`,
`videosFolder`). However, the paths of generated files inside those folders will
be stripped of any common ancestor paths shared between all spec files found by
the `specPattern` option (or via the `--spec` command line option or `spec`
module API option, if specified).

Here are a few examples, assuming the value of `videosFolder` is
`cypress/videos`, `screenshotsFolder` is `cypress/screenshots` and
`cy.screenshot('my-screenshot')` is called once per spec file:

**Example 1**

- Spec file found
  - `cypress/e2e/path/to/file/one.cy.js`
- Common ancestor paths (calculated at runtime)
  - `cypress/e2e/path/to/file`
- Generated screenshot file
  - `cypress/screenshots/one.cy.js/my-screenshot.png`
- Generated video file
  - `cypress/videos/one.cy.js.mp4`

**Example 2**

- Spec files found
  - `cypress/e2e/path/to/file/one.cy.js`
  - `cypress/e2e/path/to/two.cy.js`
- Common ancestor paths (calculated at runtime)
  - `cypress/e2e/path/to`
- Generated screenshot files
  - `cypress/screenshots/file/one.cy.js/my-screenshot.png`
  - `cypress/screenshots/two.cy.js/my-screenshot.png`
- Generated video files
  - `cypress/videos/file/one.cy.js.mp4`
  - `cypress/videos/two.cy.js.mp4`

### Command / Cypress API Changes

#### `cy.mount()`

If you set up your app using the automatic configuration wizard, a basic
[`cy.mount()`](/api/commands/mount) command will be imported for you in your
support file from one our supported frameworks.

#### `Cypress.Commands.add()`

[`Cypress.Commands.add()`](/api/cypress-api/custom-commands) has been updated to
allow the built-in “placeholder” custom `mount` and `hover` commands to be
overwritten without needing to use `Cypress.Commands.overwrite()`.

### Component Testing Changes

Component Testing has moved from experimental to beta status in 10.0.0.

Component Testing can now be ran from the main app, and launching into component
testing via the command `cypress open-ct` is now deprecated. To launch directly
into component testing, use the `cypress open --component` command instead.

All the Component Testing dev servers are now included in the main `cypress` npm
package. Configuring them is done via specifying a framework and bundler in the
`devServer` config option, and the packages are no longer directly importable.
See
[Framework Configuration](/guides/component-testing/component-framework-configuration)
for more info.

The mount libraries for React and Vue have also been included in the main
`cypress` package and can be imported from `cypress/react` and `cypress/vue`
respectively.

Any previous dev servers or mounting libraries from the `@cypress` namespace
should be uninstalled in Cypress 10.

### Code Coverage Plugin

The [Cypress Code Coverage](https://github.com/cypress-io/code-coverage#readme)
plugin will need to be updated to version >= 3.10 to work with Cypress 10. Using
a previous version will result in an error when tests are ran with code coverage
enabled.

## Migrating from `cypress-file-upload` to [`.selectFile()`](/api/commands/selectfile)

Selecting files with input elements or dropping them over the page is available
in Cypress 9.3. Read the [`.selectFile()` API docs](/api/commands/selectfile)
for more information on how this works and how to use it. This guide details how
to change your test code to migrate from the
[`cypress-file-upload`](https://github.com/abramenal/cypress-file-upload) plugin
to `.selectFile()`.

### Quick guide

The argument signature is different for Cypress' builtin `.selectFile()` command
than the `.attachFile` command the `cypress-file-upload` plugin provided. You
can follow the steps below for each argument in order to migrate:

When the first argument is a file path:

- Prefix the path with `cypress/fixtures/`.

When the first argument is an object:

- `filePath`: Rename the property to `contents`. Prefix the value with
  `cypress/fixtures/`.
- `fileContent`: Rename the property to `contents`. Use
  [`Cypress.Buffer.from()`](/api/utilities/buffer) or other Buffer methods,
  rather than `Cypress.Blob`.
- `encoding`: Remove this property. It is no longer needed due to improved
  binary file handling in Cypress 9.0.
- `mimeType`: No change necessary. In most cases you do not need to give a
  mimeType explicitly. Cypress will attempt to infer the MIME type
  [based on the extension](https://github.com/jshttp/mime-types#mimelookuppath)
  of the fileName if none is provided.

In the second argument:

- `subjectType`: Rename this property to `action`. Change the value from
  `drag-n-drop` to `drag-drop` or from `input` to `select`.
- `allowEmpty`: Remove this property. `.selectFile()` does not check the length
  of a file read from disk, only its existence.
- `force`: Works the same with `.selectFile()` as it did in
  `cypress-file-upload`. No change necessary.

### Examples

Below are several examples of migrating various commands from
`cypress-file-upload` to the builtin `.selectFile()` command.

#### Read and attach a fixture

<Badge type="danger">Before</Badge> Attaching a fixture from disk with
`cypress-file-upload`

```js
cy.get('[data-cy="file-input"]').attachFile('myfixture.json')
```

<Badge type="success">After</Badge> Selecting a fixture from disk with
`.selectFile()`. Cypress follows paths from your project root (same as
[`cy.readFile()`](/api/commands/readfile)).

```js
cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/myfixture.json')

// Or

cy.fixture('myfixture.json', { encoding: null }).as('myfixture')
cy.get('[data-cy="file-input"]').selectFile('@myfixture')
```

#### Using drag-n-drop

<Badge type="danger">Before</Badge> Dragging and dropping a file with
`cypress-file-upload`

```js
cy.get('[data-cy="dropzone"]').attachFile('myfixture.json', {
  subjectType: 'drag-n-drop',
})
```

<Badge type="success">After</Badge> Selecting a fixture from disk with
`.selectFile()`. Cypress follows paths from the root of your test folder (same
as [`cy.readFile()`](/api/commands/readfile)).

```js
cy.get('[data-cy="dropzone"]').selectFile('fixtures/myfixture.json', {
  action: 'drag-drop',
})
```

#### Overriding the file name

<Badge type="danger">Before</Badge> Dragging and dropping a file with
`cypress-file-upload`

```js
cy.get('[data-cy="dropzone"]').attachFile({
  filePath: 'myfixture.json',
  fileName: 'customFileName.json',
})
```

<Badge type="success">After</Badge> Selecting a fixture from disk with
`.selectFile()`. Cypress follows paths from the root of your test folder (same
as [`cy.readFile()`](/api/commands/readfile)).

```js
cy.get('[data-cy="dropzone"]').selectFile({
  contents: 'fixtures/myfixture.json',
  fileName: 'customFileName.json',
})
```

#### Working with file contents

<Badge type="danger">Before</Badge> Working with file contents before using
using `cypress-file-upload`

```js
const special = 'file.spss'

cy.fixture(special, 'binary')
  .then(Cypress.Blob.binaryStringToBlob)
  .then((fileContent) => {
    // ...process file contents
    cy.get('[data-cy="file-input"]').attachFile({
      fileContent,
      filePath: special,
      encoding: 'utf-8',
      lastModified: new Date().getTime(),
    })
  })
```

<Badge type="success">After</Badge> Working with file contents before using with
`.selectFile()`. The `null` encoding introduced in Cypress 9.0 makes working
with binary data simpler, and is the preferred encoding for use with
`.selectFile()`.

```js
const special = 'file.spss'

cy.fixture(special, { encoding: null }).then((contents) => {
  // ...process file contents
  cy.get('[data-cy="file-input"]').selectFile({
    contents,
    fileName: special,
    lastModified: new Date().getTime(),
  })
})

// Or

cy.fixture(special, { encoding: null })
  .then((contents) => {
    // ...process file contents
  })
  .as('special')

cy.get('[data-cy="file-input"]').selectFile('@special')
```

#### Specifying a custom mimeType

<Badge type="danger">Before</Badge> Specifying the MIME type with
`cypress-file-upload`

```js
cy.get('[data-cy="dropzone"]').attachFile({
  filePath: 'myfixture.json',
  fileName: 'customFileName.json',
})
```

<Badge type="success">After</Badge> Specifying a MIME type with `.selectFile()`.

```js
cy.get('[data-cy="dropzone"]').selectFile({
  contents: 'fixtures/myfixture.json',
  mimeType: 'text/plain',
})
```

## Migrating to Cypress 8.0

This guide details the changes and how to change your code to migrate to Cypress
8.0. [See the full changelog for 8.0](/guides/references/changelog#8-0-0).

### `cypress run` runs all browsers `--headless`

When running `cypress run` previous to 8.0, some browsers would launch headed
while others were launched headless by default. In 8.0, we've normalized all
browsers to launch as headless by default.

This could cause a couple of changes to your existing runs:

- You may see the screenshot or video resolution of runs during `cypress run`
  change to the default of 1280x720. This is because headless browsers use the
  set screen size as opposed to the browser's size when opening headed.
- Chrome extensions will not load during a `--headless` run. If your run depends
  on a Chrome extension being loaded during `cypress run`, you should explicitly
  pass the `--headed` flag.

You can now remove the use of the `--headless` flag during `cypress run` as this
is the default for all browsers.

You should also update any use of the `isHeaded` or `isHeadless` property on
[`Cypress.browser`](/api/cypress-api/browser) or the
[browser launch API](/api/plugins/browser-launch-api) accordingly.

<Badge type="danger">Before</Badge> run headless browser

```script
cypress run --browser=chrome --headless
```

```script
cypress run --browser=firefox --headless
```

<Badge type="success">After</Badge> All browsers headless by default, so you can
remove the `--headless` flag during `cypress run`.

```script
cypress run --browser=chrome
```

```script
cypress run --browser=firefox
```

### Default screen size during `--headless`

The default screen size when running a headless browser has been reverted back
to 1280x720 pixels. If you have any code in the
[browser launch API](/api/plugins/browser-launch-api) to set the screen size to
1280x720, this can be removed.

<Badge type="danger">Before</Badge> set screen size to 1280x720

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--window-size=1280,720')
    }

    if (browser.name === 'electron' && browser.isHeadless) {
      launchOptions.preferences.width = 1280
      launchOptions.preferences.height = 720
    }

    if (browser.name === 'firefox' && browser.isHeadless) {
      launchOptions.args.push('--width=1280')
      launchOptions.args.push('--height=720')
    }

    return launchOptions
  })
}
```

<Badge type="success">After</Badge> no longer need overrides

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  // the default screen size is 1280x720 in all headless browsers
}
```

## Migrating to Cypress 7.0

This guide details the changes and how to change your code to migrate to Cypress
7.0. [See the full changelog for 7.0](/guides/references/changelog#7-0-0).

### [`cy.intercept()`][intercept] changes

[Cypress 7.0](/guides/references/changelog#7-0-0) comes with some breaking
changes to [`cy.intercept()`][intercept]:

#### Handler ordering is reversed

Previous to Cypress 7.0, [`cy.intercept()`][intercept] handlers were run in the
order that they are defined, stopping after the first handler to call
`req.reply()`, or once all handlers are complete.

With Cypress 7.0, [`cy.intercept()`][intercept] handlers are now run in reverse
order of definition, stopping after the first handler to call `req.reply()`, or
once all handlers are complete.

This change was done so that users can override previously declared
[`cy.intercept()`][intercept] handlers by calling [`cy.intercept()`][intercept]
again. See [#9302](https://github.com/cypress-io/cypress/issues/9302) for more
details.

<Badge type="danger">Before</Badge>

```js
cy.intercept(url, (req) => {
  /* This will be called first! */
})
cy.intercept(url, (req) => {
  /* This will be called second! */
})
```

<Badge type="success">After</Badge>

```js
cy.intercept(url, (req) => {
  /* This will be called second! */
})
cy.intercept(url, (req) => {
  /* This will be called first! */
})
```

[Read more about the `cy.intercept()` interception lifecycle.](/api/commands/intercept#Interception-lifecycle)

#### URL matching is stricter

Before Cypress 7.0, [`cy.intercept()`][intercept] would match URLs against
strings by using `minimatch`, substring match, or by equality.

With Cypress 7.0, this behavior is being tightened - URLs are matched against
strings only by `minimatch` or by equality. The substring match has been
removed.

This more closely matches the URL matching behavior shown by `cy.route()`.
However, some intercepts will not match, even though they did before.

For example, requests with querystrings may no longer match:

```js
// will this intercept match a request for `/items?page=1`?
cy.intercept('/items')
// ✅ before 7.0.0, this will match, because it is a substring
// ❌ after 7.0.0, this will not match, because of the querystring
// solution: update the intercept to match the querystring with a wildcard:
cy.intercept('/items?*')
```

Also, requests for paths in nested directories may be affected:

```js
// will this intercept match a request for `/some/items`?
cy.intercept('/items')
// ✅ before 7.0.0, this will match, because it is a substring
// ❌ after 7.0.0, this will not match, because of the leading directory
// solution: update the intercept to include the directory:
cy.intercept('/some/items')
```

Additionally, the `matchUrlAgainstPath` `RouteMatcher` option that was added in
Cypress 6.2.0 has been removed in Cypress 7.0. It can be safely removed from
tests.

#### Deprecated `cy.route2()` command removed

`cy.route2()` was the original name for `cy.intercept()` during the experimental
phase of the feature. It was deprecated in Cypress 6.0. In Cypress 7.0, it has
been removed entirely. Please update existing usages of `cy.route2()` to call
`cy.intercept()` instead.

<Badge type="danger">Before</Badge>

```js
cy.route2('/widgets/*', { fixture: 'widget.json' }).as('widget')
```

<Badge type="success">After</Badge>

```js
cy.intercept('/widgets/*', { fixture: 'widget.json' }).as('widget')
```

#### `res.delay()` and `res.throttle()` have been renamed

The `res.delay()` and `res.throttle()` functions that exist on responses yielded
to response handlers have been renamed.

The new names are `res.setDelay()` and `res.setThrottle()`, respectively.

<Badge type="danger">Before</Badge>

```js
cy.intercept('/slow', (req) => {
  req.continue((res) => {
    // apply a delay of 1 second and a throttle of 56kbps
    res.delay(1000).throttle(56)
  })
})
```

<Badge type="success">After</Badge>

```js
cy.intercept('/slow', (req) => {
  req.continue((res) => {
    // apply a delay of 1 second and a throttle of 56kbps
    res.setDelay(1000).setThrottle(56)
  })
})
```

[Read more about available functions on `res`.](/api/commands/intercept#intercepted-response)

#### Falsy values are no longer dropped in `StaticResponse` bodies

Previously, falsy values supplied as the `body` of a `StaticResponse` would get
dropped (the same as if no body was supplied). Now, the bodies are properly
encoded in the response.

<Badge type="danger">Before</Badge>

```js
cy.intercept('/does-it-exist', { body: false })
// Requests to `/does-it-exist` receive an empty response body
```

<Badge type="success">After</Badge>

```js
cy.intercept('/does-it-exist', { body: false })
// Requests to `/does-it-exist` receive a response body of `false`
```

#### Errors thrown by request and response handlers are no longer wrapped

Previously, errors thrown inside of `req` and `res` handlers would be wrapped by
a `CypressError`. In 7.0.0, errors thrown inside of these handlers are not
wrapped before failing the test.

This should only affect users who are explicitly asserting on global errors. See
[#15189](https://github.com/cypress-io/cypress/issues/15189) for more details.

### Component Testing

In 7.0, component testing is no longer experimental. Cypress now ships with a
dedicated component test runner with a new UI and dedicated commands to launch
it.

**Changes are required for all existing projects**. The required changes are
limited to configuration and there are no breaking changes to the `mount` API.
The migration guide contains the following steps:

1. [Update your Cypress configuration to remove `experimentalComponentTesting`](/guides/references/migration-guide#1-Remove-experimentalComponentTesting-config)
2. [Install updated dependencies](/guides/references/migration-guide##2-Install-component-testing-dependencies)
3. [Update the plugins file](/guides/references/migration-guide#3-Update-plugins-file-to-use-dev-server-start)
4. [Use CLI commands to launch](/guides/references/migration-guide#4-Use-CLI-commands-to-launch)
5. [Update the support file (optionally)](/guides/references/migration-guide#5-Update-the-support-file-optionally)

#### 1. Remove `experimentalComponentTesting` config

The `experimentalComponentTesting` configuration is no longer needed to run
component tests. Remove this flag in order to run Cypress tests without
erroring.

<Badge type="danger">Before</Badge> experimentalComponentTesting flag is
required for component testing

```json
{
  "experimentalComponentTesting": true,
  "componentFolder": "src",
  "testFiles": "**/*spec.{js,jsx,ts,tsx}"
}
```

<Badge type="success">After</Badge> experimentalComponentTesting flag must be
removed

```json
{
  "componentFolder": "src",
  "testFiles": "**/*spec.{js,jsx,ts,tsx}"
}
```

#### 2. Install component testing dependencies

The Component Test Runner requires the following dependencies:

- Framework-specific bindings such as
  [`@cypress/react`](https://www.npmjs.com/package/@cypress/react).
- Development server adapter such as
  [`@cypress/webpack-dev-server`](https://www.npmjs.com/package/@cypress/webpack-dev-server).
- Peer dependencies such as
  [`webpack-dev-server`](https://www.npmjs.com/package/webpack-dev-server),
  [`vue`][npmvue], or [`react`][npmreact].

**Install React dependencies**

1. Upgrade to [`@cypress/react`](https://www.npmjs.com/package/@cypress/react)
   5.X.
2. Install
   [`@cypress/webpack-dev-server`](https://www.npmjs.com/package/@cypress/webpack-dev-server).
3. (Optional) Install
   [`cypress-react-selector`](https://www.npmjs.com/package/cypress-react-selector)
   if any tests use `cy.react()`.
4. (Optional) Install code coverage, see
   [installation steps](/guides/tooling/code-coverage)).

```shell
npm i cypress @cypress/react @cypress/webpack-dev-server -D
```

**Install Vue 3 dependencies**

1. Upgrade to [`@cypress/vue@next`](https://www.npmjs.com/package/@cypress/vue)
   (3.X and above).
2. Install
   [`@cypress/webpack-dev-server`](https://www.npmjs.com/package/@cypress/webpack-dev-server).

```shell
npm i cypress @cypress/vue@next @cypress/webpack-dev-server -D
```

**Install Vue 2 dependencies**

1. Upgrade to [`@cypress/vue@2`](https://www.npmjs.com/package/@cypress/vue)
   (2.X only).
2. Install
   [`@cypress/webpack-dev-server`](https://www.npmjs.com/package/@cypress/webpack-dev-server).

```shell
npm i cypress @cypress/vue @cypress/webpack-dev-server -D
```

#### 3. Update plugins file to use `dev-server:start`

**Re-using a project's local development server instead of file preprocessors**

In 7.0 Cypress component tests require that code is bundled with your local
development server, via a new `dev-server:start` event. This event replaces the
previous `file:preprocessor` event.

<Badge type="danger">Before</Badge> Plugins file registers the
file\:preprocessor event

```js
const webpackPreprocessor = require('@cypress/webpack-preprocessor')
const webpackConfig = require('../webpack.config.js')

module.exports = (on, config) => {
  on('file:preprocessor', webpackPreprocessor(options))
}
```

<Badge type="success">After</Badge> Plugins file registers the dev-server\:start
event

```js
// The @cypress/webpack-dev-server package replaces @cypress/webpack-preprocessor
const { startDevServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('../webpack.config.js')

module.exports = (on, config) => {
  // You must use the dev-server:start event instead of the file:preprocessor event

  on('dev-server:start', (options) => {
    return startDevServer({ options, webpackConfig })
  })
}
```

**Configure `plugins.js` for React projects**

Projects using React may not need to update their plugins file. If your project
is using a webpack scaffold or boilerplate, it is recommended to use a preset
plugin imported from
[`@cypress/react/plugins`](https://github.com/cypress-io/cypress/tree/develop/npm/react/plugins).

**Preset Plugins for React**

If you are using a preset plugin within
[`@cypress/react`](https://www.npmjs.com/package/@cypress/react), you should not
need to update your plugins file. To check if you are using a preset, check to
see if your plugins file contains an import to a file inside of
`@cypress/react/plugins`.

<Badge type="success">After</Badge> An example plugins file to configure
component testing in a React Scripts project

```js
// The @cypress/react project exposes preset plugin configurations
// These presets automatically register the events to bundle the project properly
const injectReactScriptsDevServer = require('@cypress/react/plugins/react-scripts')

module.exports = (on, config) => {
  // Internally, this method registers `dev-server:start` with the proper webpack configuration
  // Previously, it registered the `file:preprocessor` event.
  injectReactScriptsDevServer(on, config)

  return config
}
```

**Configure `plugins.js` for Vue**

Projects using Vue will likely be using either
[`@vue/cli`](https://cli.vuejs.org/) or manually defining webpack configuration.
These steps are identical to the manual setup steps, with the exception of how
you resolve the webpack configuration. To access the resolved webpack
configuration that contains any `vue.config.js` setup or the default
[`@vue/cli`](https://cli.vuejs.org/) webpack setup, you must import the
configuration and pass it into
[`@cypress/webpack-dev-server`](https://www.npmjs.com/package/@cypress/webpack-dev-server).

<Badge type="success">After</Badge> An example plugins file to configure
component testing in a Vue CLI project

```js
const { startDevServer } = require('@cypress/webpack-dev-server')

// The resolved configuration, which contains any `vue.config.js` setup
const webpackConfig = require('@vue/cli-service/webpack.config.js')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({ options, webpackConfig })
  })
}
```

**Configuring a project with vanilla webpack**

For projects with manually defined or ejected webpack configurations, the
webpack configuration must be passed in.

<Badge type="success">After</Badge> An example plugins file to configure
component testing in a project with vanilla webpack

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('../webpack.config.js')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({ options, webpackConfig })
  })
}
```

#### 4. Use CLI commands to launch

To run your component tests you _must_ use the dedicated component testing
subcommands.

- `cypress open-ct`
- `cypress run-ct`

<Alert type="info">

Component tests will no longer be picked up when launching Cypress from
`cypress open` or `cypress run`. Please use `cypress open-ct` or
`cypress run-ct`.

</Alert>

<Badge type="danger">Before</Badge> Commands launches both end-to-end and
component tests.

```shell
cypress run
```

<Badge type="success">After</Badge> Command launches Cypress Component Test
Runner and executes component tests. End-to-end tests are run separately.

```shell
# open component testing runner
cypress open-ct

# run all component tests
cypress run-ct

# e2e tests
cypress open
cypress run
```

#### 5. Update the support file (optionally)

Previously, a support file was required to set up the component testing target
node. This is no longer necessary.

Specifically for React users, if the support file contains the following line,
please remove it. The import will fail in the future. We have left it in to
avoid a breaking change, but the file does nothing.

<Badge type="danger">Before</Badge> The support file was required to import a
script from [@cypress/react](https://www.npmjs.com/package/@cypress/react)

```js
// support.js

// This import should be removed, it will error in a future update
import '@cypress/react/hooks'
```

#### Expanded stylesheet support

Stylesheets are now bundled and imported within spec and support files.
Previously, many of `mount`'s mounting options such as `stylesheets`,
`cssFiles`, and `styles` were required to import stylesheets into your component
tests. This often involved pre-compiling the stylesheets before launching the
component tests, which affected performance. Migrating to imports for these
styles is optional, but recommended.

Now, stylesheets should be loaded into the `document` the same way they are in
your application. It is recommended you update your code like so:

<Badge type="danger">Before</Badge> Stylesheets were loaded using the filesystem

```js
const { mount } = require('@cypress/react')
const Button = require('./Button')

it('renders a Button', () => {
  // Mounting a button and loading the Tailwind CSS library
  mount(<Button />, {
    stylesheets: [
      // Paths are relative to the project root directory and must be pre-compiled
      // Because they are static, they do not watch for file updates
      '/dist/index.css',
      '/node_modules/tailwindcss/dist/tailwind.min.css',
    ],
  })
})
```

<Badge type="success">After</Badge> Stylesheets are supported via an import and
`mountingOptions.stylesheets` is not recommended

```js
// In the majority of modern style-loaders,
// these styles will be injected into document.head when they're imported below
require('./index.scss')
require('tailwindcss/dist/tailwind.min.css')

const { mount } = require('@cypress/react')
const Button = require('./Button')

it('renders a Button', () => {
  // This button will render with the Tailwind CSS styles
  // as well as the application's index.scss styles
  mount(<Button />)
})
```

#### Desktop GUI no longer displays component tests

Previously, the Desktop GUI displayed _both_ end-to-end and component tests.
Now, component tests are only displayed when launching via the component
testing-specific subcommands. `cypress open-ct` (or `run-ct` in CI)

#### Executing all or some component tests

In 6.X, the Desktop GUI had support for finding and executing a subset of
component tests. In 7.0, this is possible with the `--headed` command and a spec
glob, like so:

```sh
cypress run-ct --headed --spec **/some-folder/*spec.*
```

#### Coverage

Previously, the [`@cypress/react`](https://www.npmjs.com/package/@cypress/vue)
4.X package embedded code coverage in your tests automatically.

If you still wish to record code coverage in your tests, you must manually
install it. Please see our [code coverage guide](/guides/tooling/code-coverage)
for the latest steps.

#### cypress-react-selector

If you use `cy.react()` in your tests, you must manually install
[`cypress-react-selector`](https://www.npmjs.com/package/cypress-react-selector)
with `npm i cypress-react-selector -D`. You do not need to update your support
file.

#### HTML Side effects

As of 7.0, we only clean up components mounted by Cypress via
[`@cypress/react`](https://www.npmjs.com/package/@cypress/react) or
[`@cypress/vue`](https://www.npmjs.com/package/@cypress/vue).

We no longer automatically reset the `document.body` between tests. Any HTML
side effects of your component tests will carry over.

<Badge type="danger">Before</Badge> All HTML content was cleared between spec
files

```jsx
const { mount } = require('@cypress/react')

describe('Component teardown behavior', () => {
  it('modifies the document and mounts a component', () => {
    // HTML unrelated to the component is mounted
    Cypress.$('body').append('<div data-cy="some-html"/>')

    // A component is mounted
    mount(<Button data-cy="my-button"></Button>)

    cy.get('[data-cy="some-html"]').should('exist')
    cy.get('[data-cy="my-button"]').should('exist')
  })

  it('cleans up any HTML', () => {
    // The component is automatically unmounted by Cypress
    cy.get('[data-cy="my-button"]').should('not.exist')

    // The HTML left over from the previous test has been cleaned up
    // This was done automatically by Cypress
    cy.get('[data-cy="some-html"]').should('not.exist')
  })
})
```

<Badge type="success">After</Badge> Only the components are cleaned up between
spec files

```jsx
const { mount } = require('@cypress/react')

describe('Component teardown behavior', () => {
  it('modifies the document and mounts a component', () => {
    // HTML unrelated to the component is mounted
    Cypress.$('body').append('<div data-cy="some-html"/>')

    // A component is mounted
    mount(<Button data-cy="my-button"></Button>)

    cy.get('[data-cy="some-html"]').should('exist')
    cy.get('[data-cy="my-button"]').should('exist')
  })

  it('only cleans up *components* between tests', () => {
    // The component is automatically unmounted by Cypress
    cy.get('[data-cy="my-button"]').should('not.exist')

    // The HTML left over from the previous test should be manually cleared
    cy.get('[data-cy="some-html"]').should('not.exist')
  })
})
```

#### Legacy `cypress-react-unit-test` and `cypress-vue-unit-test` packages

For users upgrading from
[`cypress-react-unit-tests`](https://www.npmjs.com/package/cypress-react-unit-test)
or
[`cypress-vue-unit-tests`](https://www.npmjs.com/package/cypress-vue-unit-test),
please update all references to use
[`@cypress/react`](https://www.npmjs.com/package/@cypress/react) or
[`@cypress/vue`](https://www.npmjs.com/package/@cypress/vue). These packages
have been deprecated and moved to the Cypress scope on npm.

### Uncaught exception and unhandled rejections

In 7.0, Cypress now fails tests in more situations where there is an uncaught
exception and also if there is an unhandled promise rejection in the application
under test.

You can ignore these situations and not fail the Cypress test with the code
below.

#### Turn off all uncaught exception handling

```javascript
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
```

#### Turn off uncaught exception handling unhandled promise rejections

```javascript
Cypress.on('uncaught:exception', (err, runnable, promise) => {
  // when the exception originated from an unhandled promise
  // rejection, the promise is provided as a third argument
  // you can turn off failing the test in this case
  if (promise) {
    // returning false here prevents Cypress from
    // failing the test
    return false
  }
})
```

### Node.js 12+ support

Cypress comes bundled with its own
[Node.js version](https://github.com/cypress-io/cypress/blob/develop/.node-version).
However, installing the `cypress` npm package uses the Node.js version installed
on your system.

Node.js 10 reached its end of life on Dec 31, 2019 and Node.js 13 reached its
end of life on June 1, 2019.
[See Node's release schedule](https://github.com/nodejs/Release). These Node.js
versions will no longer be supported when installing Cypress. The minimum
Node.js version supported to install Cypress is Node.js 12 or Node.js 14+.

## Migrating `cy.route()` to [`cy.intercept()`][intercept]

This guide details how to change your test code to migrate from `cy.route()` to
[`cy.intercept()`][intercept]. `cy.server()` and `cy.route()` are deprecated in
Cypress 6.0.0. In a future release, support for `cy.server()` and `cy.route()`
will be removed.

Please also refer to the full documentation for [cy.intercept()][intercept].

### Match simple route

In many use cases, you can replace `cy.route()` with [cy.intercept()][intercept]
and remove the call to `cy.server()` (which is no longer necessary).

<Badge type="danger">Before</Badge>

```js
// Set up XHR listeners using cy.route()
cy.server()
cy.route('/users').as('getUsers')
cy.route('POST', '/project').as('createProject')
cy.route('PATCH', '/projects/*').as('updateProject')
```

<Badge type="success">After</Badge>

```js
// Intercept HTTP requests
cy.intercept('/users').as('getUsers')
cy.intercept('POST', '/project').as('createProject')
cy.intercept('PATCH', '/projects/*').as('updateProject')
```

### Match against `url` and `path`

The `url` argument to [cy.intercept()][intercept] matches against the full url,
as opposed to the `url` or `path` in `cy.route()`. If you're using the `url`
argument in [`cy.intercept()`][intercept], you may need to update your code
depending on the route you're trying to match.

<Badge type="danger">Before</Badge>

```js
// Match XHRs with a path or url of /users
cy.server()
cy.route({
  method: 'POST',
  url: '/users',
}).as('getUsers')
```

<Badge type="success">After</Badge>

```js
// Match HTTP requests with a path of /users
cy.intercept({
  method: 'POST',
  path: '/users',
}).as('getUsers')

// OR
// Match HTTP requests with an exact url of https://example.cypress.io/users
cy.intercept({
  method: 'POST',
  url: 'https://example.cypress.io/users',
}).as('getUsers')
```

### `cy.wait()` object

The object returned by `cy.wait()` is different from intercepted HTTP requests
using [`cy.intercept()`][intercept] than the object returned from an awaited
`cy.route()` XHR.

<Badge type="danger">Before</Badge>

```js
// Wait for XHR from cy.route()
cy.route('POST', '/users').as('createUser')
// ...
cy.wait('@createUser').then(({ requestBody, responseBody, status }) => {
  expect(status).to.eq(200)
  expect(requestBody.firstName).to.eq('Jane')
  expect(responseBody.firstName).to.eq('Jane')
})
```

<Badge type="success">After</Badge>

```js
// Wait for intercepted HTTP request
cy.intercept('POST', '/users').as('createUser')
// ...
cy.wait('@createUser').then(({ request, response }) => {
  expect(response.statusCode).to.eq(200)
  expect(request.body.name).to.eq('Jane')
  expect(response.body.name).to.eq('Jane')
})
```

### Fixtures

You can stub requests and response with fixture data by defining a `fixture`
property in the `routeHandler` argument for [`cy.intercept()`][intercept].

<Badge type="danger">Before</Badge>

```js
// Stub response with fixture data using cy.route()
cy.route('GET', '/projects', 'fx:projects')
```

<Badge type="success">After</Badge>

```js
// Stub response with fixture data using cy.intercept()
cy.intercept('GET', '/projects', {
  fixture: 'projects',
})
```

### Override intercepts

As of 7.0, newer intercepts are called before older intercepts, allowing users
to override intercepts.
[See "Handler ordering is reversed" for more details](#Handler-ordering-is-reversed).

Before 7.0, intercepts could not be overridden. See
[#9302](https://github.com/cypress-io/cypress/issues/9302) for more details.

## Migrating to Cypress 6.0

This guide details the changes and how to change your code to migrate to Cypress
6.0. [See the full changelog for 6.0](/guides/references/changelog#6-0-0).

### Non-existent element assertions

<Alert type="info">

**Key takeway:** Use `.should('not.exist')` to assert that an element does not
exist in the DOM (not `.should('not.be.visible')`, etc).

</Alert>

In previous versions of Cypress, there was a possibility for tests to falsely
pass when asserting a negative state on non-existent elements.

For example, in the tests below we want to test that the search dropdown is no
longer visible when the search input is blurred because we hide the element in
CSS styles. Except in this test, we've mistakenly misspelled one of our
selectors.

```js
cy.get('input[type=search]').type('Cypress')
cy.get('#dropdown').should('be.visible')
cy.get('input[type=search]').blur()

// below we misspelled "dropdown" in the selector 😞
// the assertions falsely pass in Cypress < 6.0
// and will correctly fail in Cypress 6.0 +
cy.get('#dropdon').should('not.be.visible')
cy.get('#dropdon').should('not.have.class', 'open')
cy.get('#dropdon').should('not.contain', 'Cypress')
```

<DocsImage src="/img/guides/migration-guide/el-incorrectly-passes-existence-check.png" alt="non-existent element before 6.0"></DocsImage>

In 6.0, these assertions will now correctly fail, telling us that the `#dropdon`
element doesn't exist in the DOM.

<DocsImage src="/img/guides/migration-guide/el-correctly-fails-existence-check.png" alt="non-existent element in 6.0"></DocsImage>

#### Assertions on non-existent elements

This fix may cause some breaking changes in your tests if you are relying on
assertions such as `not.be.visible` or `not.contains` to test that the DOM
element did not _exist_ in the DOM. This means you'll need to update your test
code to be more specific about your assertions on non-existent elements.

<Badge type="danger">Before</Badge> Assert that non existent element was not
visible

```js
it('test', () => {
  // the modal element is removed from the DOM on click
  cy.get('[data-cy="modal"]').find('.close').click()
  // assertions below pass in < 6.0, but properly fail in 6.0+
  cy.get('[data-cy="modal"]').should('not.be.visible')
  cy.get('[data-cy="modal"]').should('not.contain', 'Upgrade')
})
```

<Badge type="success">After</Badge> Assert that non existent element does not
exist

```js
it('test', () => {
  // the modal element is removed from the DOM on click
  cy.get('data-cy="modal"').find('.close').click()
  // we should instead assert that the element doesn't exist
  cy.get('data-cy="modal"').should('not.exist')
})
```

### Opacity visibility

DOM elements with `opacity: 0` style are no longer considered to be visible.
This includes elements with an ancestor that has `opacity: 0` since a child
element can never have a computed opacity greater than that of an ancestor.

Elements where the CSS property (or ancestors) is `opacity: 0` are still
considered [actionable](/guides/core-concepts/interacting-with-elements) however
and
[any action commands](/guides/core-concepts/interacting-with-elements#Actionability)
used to interact with the element will perform the action. This matches
browser's implementation on how they regard elements with `opacity: 0`.

#### Assert visibility of `opacity: 0` element

<Badge type="danger">Before</Badge> Failed assertion that `opacity: 0` element
is not visible.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  // In < 5.0 this assertion would fail
  cy.get('.hidden').should('not.be.visible')
})
```

<Badge type="success">After</Badge> Passed assertion that `opacity: 0` element
is not visible.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  // In 6.0 this assertion will pass
  cy.get('.hidden').should('not.be.visible')
})
```

#### Perform actions on `opacity: 0` element

In all versions of Cypress, you can interact with elements that have
`opacity: 0` style.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  cy.get('.hidden').click() // ✅ clicks on element
  cy.get('.hidden').type('hi') // ✅ types into element
  cy.get('.hidden').check() // ✅ checks element
  cy.get('.hidden').select('yes') // ✅ selects element
})
```

### `cy.wait(alias)` type

[cy.route()](/api/commands/route) is deprecated in 6.0.0. We encourage the use
of [cy.intercept()][intercept] instead. Due to this deprecation, the type
yielded by [cy.wait(alias)](/api/commands/wait) has changed.

<Badge type="danger">Before</Badge> Before 6.0.0,
[cy.wait(alias)](/api/commands/wait) would yield an object of type `WaitXHR`.

<Badge type="success">After</Badge> In 6.0.0 and onwards,
[cy.wait(alias)](/api/commands/wait) will yield an object of type
`Interception`. This matches the new interception object type used for
[cy.intercept()][intercept].

#### Restore old behavior

If you need to restore the type behavior prior to 6.0.0 for
[cy.wait(alias)](/api/commands/wait), you can declare a global override for
[cy.wait()](/api/commands/wait) like so:

```ts
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      wait(alias: string): Chainable<Cypress.WaitXHR>
    }
  }
}
```

### `—disable-dev-shm-usage`

We now pass `—disable-dev-shm-usage` to the Chrome browser flags by default. If
you're passing this flag in your `plugins` file, you can now remove this code.

<Badge type="danger">Before</Badge> Passing flag in plugins file.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--disable-dev-shm-usage')
    }

    return launchOptions
  })
}
```

<Badge type="success">After</Badge> Remove flag from plugins file.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {}
```

#### Restore old behavior

If you need to remove the flag in 6.0.0+, you can follow the workaround
documented here: [#9242](https://github.com/cypress-io/cypress/issues/9242).

## Migrating to Cypress 5.0

This guide details the changes and how to change your code to migrate to Cypress
5.0. [See the full changelog for 5.0](/guides/references/changelog#5-0-0).

### Tests retries

Test retries are available in Cypress 5.0. This means that tests can be re-run a
number of times before potentially being marked as a failed test. Read the
[Test Retries](/guides/guides/test-retries) doc for more information on how this
works and how to turn on test retries.

When test retries are turned on, there will now be a screenshot taken for every
failed attempt, so there could potentially be more than 1 screenshot per test
failure. Read the [Test Retries](/guides/guides/test-retries) doc for more
information on how this works.

The
[`cypress-plugin-retries`](https://github.com/Bkucera/cypress-plugin-retries)
plugin has been deprecated in favor of test retries built into Cypress. There's
guidance below on how to migrate from the
[`cypress-plugin-retries`](https://github.com/Bkucera/cypress-plugin-retries)
plugin to Cypress's built-in test retries.

#### Configure test retries via the CLI

<Badge type="danger">Before</Badge> Setting retries with
`cypress-plugin-retries` via env vars

```shell
CYPRESS_RETRIES=2 cypress run
```

<Badge type="success">After</Badge> Setting test retries in Cypress 5.0 via env
vars

```shell
CYPRESS_RETRIES=2 cypress run
```

#### Configure test retries in the configuration file

<Badge type="danger">Before</Badge> Setting retries with
`cypress-plugin-retries` via configuration

```json
{
  "env": {
    "RETRIES": 2
  }
}
```

<Badge type="success">After</Badge> Setting test retries in Cypress 5.0 via
configuration

```json
{
  "retries": 1
}
```

- `runMode` allows you to define the number of test retries when running
  `cypress run`
- `openMode` allows you to define the number of test retries when running
  `cypress open`

```json
{
  "retries": {
    "runMode": 1,
    "openMode": 3
  }
}
```

#### Configure test retries per test

<Badge type="danger">Before</Badge> Setting retries with
`cypress-plugin-retries` via the test

```js
it('test', () => {
  Cypress.currentTest.retries(2)
})
```

<Badge type="success">After</Badge> Setting test retries in Cypress 5.0 via test
options

```js
it(
  'allows user to login',
  {
    retries: 2,
  },
  () => {
    // ...
  }
)
```

- `runMode` allows you to define the number of test retries when running
  `cypress run`
- `openMode` allows you to define the number of test retries when running
  `cypress open`

```js
it(
  'allows user to login',
  {
    retries: {
      runMode: 2,
      openMode: 3,
    },
  },
  () => {
    // ...
  }
)
```

### Module API results

To more accurately reflect result data for runs with
[test retries](/guides/guides/test-retries), the structure of each run's `runs`
array resolved from the `Promise` returned from `cypress.run()` of the Module
API has changed.

Mainly there is a new `attempts` Array on each `test` which will reflect the
result of each test retry.

<Badge type="danger">Before</Badge> `results.runs` Module API results

```json
{
  // ...
  "runs": [{
    // ...
    "hooks": [{
      "hookId": "h1",
      "hookName": "before each",
      "title": [ "before each hook" ],
      "body": "function () {\n  expect(true).to.be["true"];\n}"
    }],
    // ...
    "screenshots": [{
      "screenshotId": "8ddmk",
      "name": null,
      "testId": "r2",
      "takenAt": "2020-08-05T08:52:20.432Z",
      "path": "User/janelane/my-app/cypress/screenshots/spec.js/test (failed).png",
      "height": 720,
      "width": 1280
    }],
    "stats": {
      // ...
      "wallClockStartedAt": "2020-08-05T08:38:37.589Z",
      "wallClockEndedAt": "2018-07-11T17:53:35.675Z",
      "wallClockDuration": 1171
    },
    "tests": [{
      "testId": "r2",
      "title": [ "test" ],
      "state": "failed",
      "body": "function () {\n  expect(true).to.be["false"];\n}",
      "stack": "AssertionError: expected true to be false\n' +
        '    at Context.eval (...cypress/integration/spec.js:5:21",
      "error": "expected true to be false",
      "timings": {
        "lifecycle": 16,
        "test": {...}
      },
      "failedFromHookId": null,
      "wallClockStartedAt": "2020-08-05T08:38:37.589Z",
      "wallClockDuration": 1171,
      "videoTimestamp": 4486
    }],
  }],
  // ...
}
```

<Badge type="success">After</Badge> `results.runs` Module API results

```json
{
  // ...
  "runs": [{
    // ...
    "hooks": [{
      "hookName": "before each",
      "title": [ "before each hook" ],
      "body": "function () {\n  expect(true).to.be["true"];\n}"
    }],
    // ...
    "stats": {
      // ...
      "startedAt": "2020-08-05T08:38:37.589Z",
      "endedAt": "2018-07-11T17:53:35.675Z",
      "duration": 1171
    },
    "tests": [{
      "title": [ "test" ],
      "state": "failed",
      "body": "function () {\n  expect(true).to.be["false"];\n}",
      "displayError": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/integration/spec.js:5:21",
      "attempts": [{
        "state": "failed",
        "error": {
          "message": "expected true to be false",
          "name": "AssertionError",
          "stack": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/integration/spec.js:5:21"
        },
        "screenshots": [{
          "name": null,
          "takenAt": "2020-08-05T08:52:20.432Z",
          "path": "User/janelane/my-app/cypress/screenshots/spec.js/test (failed).png",
          "height": 720,
          "width": 1280
        }],
        "startedAt": "2020-08-05T08:38:37.589Z",
        "duration": 1171,
        "videoTimestamp": 4486
      }]
    }],
  }],
  // ...
}
```

### Cookies `whitelist` option renamed

The [Cypress.Cookies.defaults()](/api/cypress-api/cookies) `whitelist` option
has been renamed to `preserve` to more closely reflect its behavior.

<Badge type="danger">Before</Badge> `whitelist` option

```js
Cypress.Cookies.defaults({
  whitelist: 'session_id',
})
```

<Badge type="success">After</Badge> `preserve` option

```js
Cypress.Cookies.defaults({
  preserve: 'session_id',
})
```

### `blacklistHosts` configuration renamed

The `blacklistHosts` configuration has been renamed to
[blockHosts](/guides/references/configuration#Notes) to more closely reflect its
behavior.

This should be updated in all places where Cypress configuration can be set
including via the Cypress configuration file, command line arguments, the
`pluginsFile`, `Cypress.config()` or environment variables.

<Badge type="danger">Before</Badge> `blacklistHosts` configuration

```json
{
  "blacklistHosts": "www.google-analytics.com"
}
```

<Badge type="success">After</Badge> `blockHosts` configuration

```json
{
  "blockHosts": "www.google-analytics.com"
}
```

### Return type of `Cypress.Blob` changed

We updated the [Blob](https://github.com/nolanlawson/blob-util) library used
behind [Cypress.Blob](/api/utilities/blob) from `1.3.3` to `2.0.2`.

The return type of the [Cypress.Blob](/api/utilities/blob) methods
`arrayBufferToBlob`, `base64StringToBlob`, `binaryStringToBlob`, and
`dataURLToBlob` have changed from `Promise<Blob>` to `Blob`.

<Badge type="danger">Before</Badge> `Cypress.Blob` methods returned a Promise

```js
Cypress.Blob.base64StringToBlob(this.logo, 'image/png').then((blob) => {
  // work with the returned blob
})
```

<Badge type="success">After</Badge> `Cypress.Blob` methods return a Blob

```js
const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')

// work with the returned blob
```

### `cy.server()` `whitelist` option renamed

The [cy.server()](/api/commands/server) `whitelist` option has been renamed to
`ignore` to more closely reflect its behavior.

<Badge type="danger">Before</Badge> `whitelist` option

```js
cy.server({
  whitelist: (xhr) => {
    return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  },
})
```

<Badge type="success">After</Badge> `ignore` option

```js
cy.server({
  ignore: (xhr) => {
    return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  },
})
```

### Cookies `sameSite` property

Values yielded by [cy.setCookie()](/api/commands/setcookie),
[cy.getCookie()](/api/commands/getcookie), and
[cy.getCookies()](/api/commands/getcookies) will now contain the `sameSite`
property if specified.

If you were using the `experimentalGetCookiesSameSite` configuration to get the
`sameSite` property previously, this should be removed.

<Badge type="danger">Before</Badge> Cookies yielded before had no `sameSite`
property.

```js
cy.getCookie('token').then((cookie) => {
  // cy.getCookie() yields a cookie object
  // {
  //   domain: "localhost",
  //   expiry: 1593551644,
  //   httpOnly: false,
  //   name: "token",
  //   path: "/commands",
  //   secure: false,
  //   value: "123ABC"
  // }
})
```

<Badge type="success">After</Badge> Cookies yielded now have `sameSite` property
if specified.

```js
cy.getCookie('token').then((cookie) => {
  // cy.getCookie() yields a cookie object
  // {
  //   domain: "localhost",
  //   expiry: 1593551644,
  //   httpOnly: false,
  //   name: "token",
  //   path: "/commands",
  //   sameSite: "strict",
  //   secure: false,
  //   value: "123ABC"
  // }
})
```

### dirname / filename

The globals `__dirname` and `__filename` no longer include a leading slash.

<Badge type="danger">Before</Badge> `__dirname` / `__filename`

```js
// cypress/integration/app_spec.js
it('include leading slash < 5.0', () => {
  expect(__dirname).to.equal('/cypress/integration')
  expect(__filename).to.equal('/cypress/integration/app_spec.js')
})
```

<Badge type="success">After</Badge> `__dirname` / `__filename`

```js
// cypress/integration/app_spec.js
it('do not include leading slash >= 5.0', () => {
  expect(__dirname).to.equal('cypress/integration')
  expect(__filename).to.equal('cypress/integration/app_spec.js')
})
```

### Linux dependencies

Running Cypress on Linux now requires the `libgbm` dependency (on Debian-based
systems, this is available as `libgbm-dev`). To install all required
dependencies on Ubuntu/Debian, you can run the script below:

```shell
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

### TypeScript esModuleInterop

Cypress no longer forces the `esModuleInterop` compiler option for TypeScript to
be `true` for spec, support, and plugins files. We recommend setting it in your
project's `tsconfig.json` instead if you need to.

```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
    /* ... other compiler options ... */
  }
}
```

### TypeScript 3.4+ support

Cypress 5.0 raises minimum required TypeScript version from 2.9+ to 3.4+. You'll
need to have TypeScript 3.4+ installed within your project to have TypeScript
support within Cypress.

### Node.js 10+ support

Cypress comes bundled with its own
[Node.js version](https://github.com/cypress-io/cypress/blob/develop/.node-version).
However, installing the `cypress` npm package uses the Node.js version installed
on your system.

Node.js 8 reached its end of life on Dec 31, 2019 and Node.js 11 reached its end
of life on June 1, 2019.
[See Node's release schedule](https://github.com/nodejs/Release). These Node.js
versions will no longer be supported when installing Cypress. The minimum
Node.js version supported to install Cypress is Node.js 10 or Node.js 12+.

## Migrating to Cypress 4.0

This guide details the changes and how to change your code to migrate to Cypress
4.0. [See the full changelog for 4.0](/guides/references/changelog#4-0-0).

### Mocha upgrade

Mocha was upgraded from `2.5.3` to `7.0.1`, which includes a number of breaking
changes and new features outlined in their
[changelog](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md). Some
changes you might notice are described below.

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: invoke `done` callback and return a promise

Starting with
[Mocha 3.0.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#300--2016-07-31),
invoking a `done` callback _and_ returning a promise in a test results in an
error.

This error originates from Mocha and is discussed at length
[here](https://github.com/mochajs/mocha/pull/1320) and
[here](https://github.com/mochajs/mocha/issues/2407).

The reason is that using two different ways to signal that a test is finished is
usually a mistake and there is always a way to only use one. There is a
[proposal to handle this situation without erroring](https://github.com/mochajs/mocha/issues/2509)
that may be released in a future version of Mocha.

In the meantime, you can fix the error by choosing a single way to signal the
end of your test's execution.

##### Example #1

<Badge type="danger">Before</Badge> This test has a done callback and a promise

```javascript
it('uses invokes done and returns promise', (done) => {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
    done()
  })
})
```

<Badge type="success">After</Badge> You can remove the `done` callback and
return the promise instead:

```javascript
it('uses invokes done and returns promise', () => {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
  })
})
```

##### Example #2

<Badge type="danger">Before</Badge> Sometimes it might make more sense to use
the `done` callback and not return a promise:

```javascript
it('uses invokes done and returns promise', (done) => {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  return eventEmitter.doSomethingThatEmitsChange()
})
```

<Badge type="success">After</Badge> In this case, you don't need to return the
promise:

```javascript
it('uses invokes done and returns promise', (done) => {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  eventEmitter.doSomethingThatEmitsChange()
})
```

##### Example #3

Test functions using `async/await` automatically return a promise, so they need
to be refactored to not use a `done` callback.

<Badge type="danger">Before</Badge> This will cause an overspecified error.

```javascript
it('uses async/await', async (done) => {
  const eventEmitter = await getEventEmitter()
  eventEmitter.on('change', () => done())
  eventEmitter.doSomethingThatEmitsChange()
})
```

<Badge type="success">After</Badge> Update to the test code below.

```javascript
it('uses async/await', async () => {
  const eventEmitter = await getEventEmitter()
  return new Promise((resolve) => {
    eventEmitter.on('change', () => resolve())
    eventEmitter.doSomethingThatEmitsChange()
  })
})
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Tests require a title

Tests now require a title and will error when not provided one.

```javascript
// Would show as pending in Cypress 3
// Will throw type error in Cypress 4:
it() // Test argument "title" should be a string. Received type "undefined"
```

### Chai upgrade

Chai was upgraded from `3.5.0` to `4.2.0`, which includes a number of breaking
changes and new features outlined in
[Chai's migration guide](https://github.com/chaijs/chai/issues/781). Some
changes you might notice are described below.

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: assertions expecting numbers

Some assertions will now throw an error if the assertion's target or arguments
are not numbers, including `within`, `above`, `least`, `below`, `most`,
`increase` and `decrease`.

```javascript
// These will now throw errors:
expect(null).to.be.within(0, 1)
expect(null).to.be.above(10)
// This will not throw errors:
expect('string').to.have.a.length.of.at.least(3)
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: `empty` assertions

The `.empty` assertion will now throw when it is passed non-string primitives
and functions.

```javascript
// These will now throw TypeErrors
expect(Symbol()).to.be.empty
expect(() => {}).to.be.empty
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: non-existent properties

An error will throw when a non-existent property is read. If there are typos in
property assertions, they will now appear as failures.

```javascript
// Would pass in Cypress 3 but will fail correctly in 4
expect(true).to.be.ture
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: `include` checks strict equality

`include` now always use strict equality unless the `deep` property is set.

<Badge type="danger">Before</Badge> `include` would always use deep equality

```javascript
// Would pass in Cypress 3 but will fail correctly in 4
cy.wrap([
  {
    first: 'Jane',
    last: 'Lane',
  },
]).should('include', {
  first: 'Jane',
  last: 'Lane',
})
```

<Badge type="success">After</Badge> Need to specificy `deep.include` for deep
equality

```javascript
// Specifically check for deep.include to pass in Cypress 4
cy.wrap([
  {
    first: 'Jane',
    last: 'Lane',
  },
]).should('deep.include', {
  first: 'Jane',
  last: 'Lane',
})
```

### Sinon.JS upgrade

Sinon.JS was upgraded from `3.2.0` to `8.1.1`, which includes a number of
breaking changes and new features outlined in
[Sinon.JS's migration guide](https://sinonjs.org/releases/latest/#migration-guides).
Some changes you might notice are described below.

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: stub non-existent properties

An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Cypress 3 but will fail in 4
cy.stub(obj, 'nonExistingProperty')
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: `reset()` replaced by `resetHistory()`

For spies and stubs, the `reset()` method was replaced by `resetHistory()`.

<Badge type="danger">Before</Badge> Spies and stubs using `reset()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

spy.reset()
stub.reset()
```

<Badge type="success">After</Badge> Update spies and stubs should now use
`resetHistory()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

spy.resetHistory()
stub.resetHistory()
```

### Plugin Event `before:browser:launch`

Since we now support more advanced browser launch options, during
`before:browser:launch` we no longer yield the second argument as an array of
browser arguments and instead yield a `launchOptions` object with an `args`
property.

You can see more examples of the new `launchOptions` in use in the
[Browser Launch API doc](/api/plugins/browser-launch-api).

<Badge type="danger">Before</Badge> The second argument is no longer an array.

```js
on('before:browser:launch', (browser, args) => {
  // will print a deprecation warning telling you
  // to change your code to the new signature
  args.push('--another-arg')

  return args
})
```

<Badge type="success">After</Badge> Access the `args` property off
`launchOptions`

```js
on('before:browser:launch', (browser, launchOptions) => {
  launchOptions.args.push('--another-arg')

  return launchOptions
})
```

### Electron options in `before:browser:launch`

Previously, you could pass options to the launched Electron
[BrowserWindow](https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions)
in `before:browser:launch` by modifying the `launchOptions` object.

Now, you must pass those options as `launchOptions.preferences`:

<Badge type="danger">Before</Badge> Passing BrowserWindow options on the
`launchOptions` object is no longer supported.

```js
on('before:browser:launch', (browser, args) => {
  args.darkTheme = true

  return args
})
```

<Badge type="success">After</Badge> Pass BrowserWindow options on the
`options.preferences` object instead.

```js
on('before:browser:launch', (browser, launchOptions) => {
  launchOptions.preferences.darkTheme = true

  return launchOptions
})
```

### Launching Chrome Canary with `--browser`

Before 4.0, `cypress run --browser canary` would run tests in Chrome Canary.

Now, you must pass `--browser chrome:canary` to select Chrome Canary.

See the
[docs for `cypress run --browser`](/guides/guides/command-line#cypress-run-browser-lt-browser-name-or-path-gt)
for more information.

<Badge type="danger">Before</Badge> Passing `canary` will no longer find a
browser

```shell
cypress run --browser canary
```

<Badge type="success">After</Badge> Pass `chrome:canary` to launch Chrome Canary

```shell
cypress run --browser chrome:canary
```

### Chromium-based browser `family`

We updated the [Cypress browser objects](/api/plugins/browser-launch-api) of all
Chromium-based browsers, including Electron, to have `chromium` set as their
`family` field.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'electron') {
      // would match Electron in 3.x
      // will match no browsers in 4.0.0
      return launchOptions
    }

    if (browser.family === 'chromium') {
      // would match no browsers in 3.x
      // will match any Chromium-based browser in 4.0.0
      // ie Chrome, Canary, Chromium, Electron, Edge (Chromium-based)
      return launchOptions
    }
  })
}
```

#### Example #1 (Finding Electron)

<Badge type="danger">Before</Badge> This will no longer find the Electron
browser.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'electron') {
      // run code for Electron browser in 3.x
      return args
    }
  })
}
```

<Badge type="success">After</Badge> Use `browser.name` to check for Electron

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'electron') {
      // run code for Electron browser in 4.0.0
      return launchOptions
    }
  })
}
```

#### Example #2 (Finding Chromium-based browsers)

<Badge type="danger">Before</Badge> This will no longer find any browsers.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'chrome') {
      // in 4.x, `family` was changed to 'chromium' for all Chromium-based browsers
      return args
    }
  })
}
```

<Badge type="success">After</Badge> Use `browser.name` and `browser.family` to
select non-Electron Chromium-based browsers

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // pass launchOptions to Chromium-based browsers in 4.0
      return launchOptions
    }
  })
}
```

### `cy.writeFile()` yields `null`

`cy.writeFile()` now yields `null` instead of the `contents` written to the
file. This change was made to more closely align with the behavior of Node.js
[`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback).

<Badge type="danger">Before</Badge> This assertion will no longer pass

```js
cy.writeFile('path/to/message.txt', 'Hello World').then((text) => {
  // Would pass in Cypress 3 but will fail in 4
  expect(text).to.equal('Hello World') // false
})
```

<Badge type="success">After</Badge> Instead read the contents of the file

```js
cy.writeFile('path/to/message.txt', 'Hello World')
cy.readFile('path/to/message.txt').then((text) => {
  expect(text).to.equal('Hello World') // true
})
```

### cy.contains() ignores invisible whitespaces

Browsers ignore leading, trailing, duplicate whitespaces. And Cypress now does
that, too.

```html
<p>hello world</p>
```

```javascript
cy.get('p').contains('hello world') // Fail in 3.x. Pass in 4.0.0.
cy.get('p').contains('hello\nworld') // Pass in 3.x. Fail in 4.0.0.
```

### Node.js 8+ support

Cypress comes bundled with its own
[Node.js version](https://github.com/cypress-io/cypress/blob/develop/.node-version).
However, installing the `cypress` npm package uses the Node.js version installed
on your system.

Node.js 4 reached its end of life on April 30, 2018 and Node.js 6 reached its
end of life on April 30, 2019.
[See Node's release schedule](https://github.com/nodejs/Release). These Node.js
versions will no longer be supported when installing Cypress. The minimum
Node.js version supported to install Cypress is Node.js 8.

### CJSX is no longer supported

Cypress no longer supports CJSX (CoffeeScript + JSX), because the library used
to transpile it is no longer maintained.

If you need CJSX support, you can use a pre-2.x version of the Browserify
preprocessor.

```shell
npm install @cypress/browserify-preprocessor@1.1.2
```

```javascript
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on) => {
  on('file:preprocessor', browserify())
}
```

[intercept]: /api/commands/intercept
[npmcypresswebpackdevserver]:
  https://www.npmjs.org/package/@cypress/webpack-dev-server
[npmcypressreact]: https://www.npmjs.org/package/@cypress/react
[npmcypressvue]: https://www.npmjs.org/package/@cypress/vue
[npmreact]: https://www.npmjs.org/package/react
[npmvue]: https://www.npmjs.org/package/vue
[npmwebpackdevserver]: https://www.npmjs.org/package/webpack-dev-server
