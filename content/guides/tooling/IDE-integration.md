---
title: IDE Integration
---

## File Opener Preference

When clicking on a file path or an [error](/guides/guides/debugging#Errors) in
the [command log](/guides/core-concepts/cypress-app#Command-Log), Cypress will
attempt to open the file on your system. If the editor supports inline
highlighting of the file, the file will open with the cursor located on the line
and column of interest.

<DocsImage src="/img/guides/core-concepts/cypress-app/open-file-in-IDE.gif" alt="Open file in your IDE"></DocsImage>

The first time you click a file path, Cypress will prompt you to select which
location you prefer to open the file. You can choose to open it in your:

- File system (e.g. Finder on MacOS, File Explore on Windows)
- An IDE located on your system
- A specified application path

<Alert type="warning">

Cypress attempts to find available file editors on your system and display those
as options. If your preferred editor is not listed, you can specify the (full)
path to it by selecting **Other**. Cypress will make every effort to open the
file, _but it is not guaranteed to work with every application_.

</Alert>

After setting your file opener preference, any files will automatically open in
your selected application without prompting you to choose. If you want to change
your selection, you can do so in the **Settings** tab of Cypress by clicking
under **File Opener Preference**.

<DocsImage src="/img/guides/IDE-integration/file-opener-preference-settings-tab.png" alt="screenshot of Cypress test-runner settings tab with file opener preference panel"></DocsImage>

## Extensions & Plugins

There are many third-party IDE extensions and plugins to help integrate your IDE
with Cypress.

### Visual Studio Code

- [Cypress Fixture-IntelliSense](https://marketplace.visualstudio.com/items?itemName=JosefBiehler.cypress-fixture-intellisense):
  Supports your [cy.fixture()](/api/commands/fixture) and
  [`cy.route(..., "fixture:")`](/api/commands/route) commands by providing
  intellisense for existing fixtures.
- [Cypress Helper](https://marketplace.visualstudio.com/items?itemName=Shelex.vscode-cy-helper):
  Various helpers and commands for integration with Cypress.
- [Cypress Snippets](https://marketplace.visualstudio.com/items?itemName=andrew-codes.cypress-snippets):
  Useful Cypress code snippets.
- [Cypress Snippets](https://marketplace.visualstudio.com/items?itemName=CliffSu.cypress-snippets):
  This extension includes the newest and most common cypress snippets.
- [Open Cypress](https://marketplace.visualstudio.com/items?itemName=tnrich.vscode-extension-open-cypress):
  Allows you to open Cypress specs and single `it()` blocks directly from VS
  Code.
- [Test Utils](https://marketplace.visualstudio.com/items?itemName=chrisbreiding.test-utils):
  Easily add or remove `.only` and `.skip` modifiers with keyboard shortcuts or
  the command palette.

### IntelliJ Platform

Compatible with IntelliJ IDEA, AppCode, CLion, GoLand, PhpStorm, PyCharm, Rider,
RubyMine, and WebStorm.

- [Cypress Support](https://plugins.jetbrains.com/plugin/13819-intellij-cypress):
  Integrates Cypress under the common Intellij test framework.
- [Cypress Support Pro](https://plugins.jetbrains.com/plugin/13987-cypress-pro):
  An improved version of Cypress Support plugin with debugging from the IDE,
  advanced autocomplete, built-in recorder and other features.

## Intelligent Code Completion

### Writing Tests

#### Features

IntelliSense is available for Cypress. It offers intelligent code suggestions
directly in your IDE while writing tests. A typical IntelliSense popup shows
command definition, a code example and a link to the full documentation page.

##### Autocomplete while typing Cypress commands

<DocsVideo src="/img/snippets/intellisense-cypress-assertion-matchers.mp4" title="Intellisense Autocomplete Cypress commands"></DocsVideo>

##### Signature help when writing and hovering on Cypress commands

<DocsVideo src="/img/snippets/intellisense-method-signature-examples.mp4" title="Intellisense on hover"></DocsVideo>

##### Autocomplete while typing assertion chains, including only showing DOM assertions if testing on a DOM element.

<DocsVideo src="/img/snippets/intellisense-assertion-chainers.mp4" title="Intellisense Autocomplete DOM assertions"></DocsVideo>

#### Set up in your Dev Environment

This document assumes you have
[installed Cypress](/guides/getting-started/installing-cypress).

Cypress comes with TypeScript
[type declarations](https://github.com/cypress-io/cypress/tree/develop/cli/types)
included. Modern text editors can use these type declarations to show
IntelliSense inside spec files.

##### Triple slash directives

The simplest way to see IntelliSense when typing a Cypress command or assertion
is to add a
[triple-slash directive](http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)
to the head of your JavaScript or TypeScript testing file. This will turn the
IntelliSense on a per file basis. Copy the comment line below and paste it into
your spec file.

```js
/// <reference types="Cypress" />
```

<DocsVideo src="/img/snippets/intellisense-setup.mp4" title="Intellisense triple-slash directive"></DocsVideo>

If you write [custom commands](/api/cypress-api/custom-commands) and provide
TypeScript definitions for them, you can use the triple slash directives to show
IntelliSense, even if your project uses only JavaScript. For example, if your
custom commands are written in `cypress/support/commands.js` and you describe
them in `cypress/support/index.d.ts` use:

```js
// type definitions for Cypress object "cy"
/// <reference types="cypress" />

// type definitions for custom commands like "createDefaultTodos"
/// <reference types="../support" />
```

See the
[`cypress-example-todomvc`](https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense)
repository for a working example.

If the triple slash directive does not work, please refer to your code editor in
[TypeScript's Editor Support doc](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)
and follow the instructions for your IDE to get
[TypeScript support](/guides/tooling/typescript-support) and intelligent code
completion configured in your developer environment first. TypeScript support is
built in for [Visual Studio Code](https://code.visualstudio.com/),
[Visual Studio](https://www.visualstudio.com/), and
[WebStorm](https://www.jetbrains.com/webstorm/) - all other editors require
extra setup.

##### Reference type declarations via `jsconfig`

Instead of adding triple slash directives to each JavaScript spec file, some
IDEs (like VS Code) understand a common `jsconfig.json` file in the root of the
project. In that file, you can include the Cypress module and your test folders.

```json
{
  "include": ["./node_modules/cypress", "cypress/**/*.js"]
}
```

The Intelligent Code Completion should now show help for `cy` commands inside
regular JavaScript spec files.

##### Reference type declarations via `tsconfig`

Adding a
[`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
inside your
[`cypress` folder](/guides/core-concepts/writing-and-organizing-tests#Folder-Structure)
with the following configuration should get intelligent code completion working.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "types": ["cypress"]
  },
  "include": ["**/*.*"]
}
```

### See also

- [Adding custom properties to the global `window` with the right TypeScript type](https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense)
