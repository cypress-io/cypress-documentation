---
title: IDE Integration
---

# File Opener Preference

When clicking on a file path from the {% url "Test Runner" test-runner %} in an {% url "error stack trace or a code frame" debugging#Errors %}, Cypress will attempt to open the file on your system. If the editor supports inline highlighting of the file, the file will open with the cursor located on the line and column of interest.

{% imgTag /img/guides/file-opener-ide-go-to-line.gif "Open file at line in VS Code" %}

The first time you click a file path, Cypress will prompt you to select which location you prefer to open the file. You can choose to open it in your:

- File system (e.g. Finder on MacOS, File Explore on Windows)
- An IDE located on your system
- A specified application path

{% note warning %}
Cypress attempts to find available file editors on your system and display those as options. If your preferred editor is not list, you can specify the (full) path to it by selecting **Other**. Cypress will make every effort to open the file, *but it is not guaranteed to work with every application*.
{% endnote %}

After setting your file opener preference, any files will automatically open in your selected application without prompting you to choose. If you want to change your selection, you can do so in the **Settings** tab of the Cypress Test Runner by clicking under **File Opener Preference**.

{% imgTag /img/guides/file-opener-preference-settings-tab.png "screenshot of Test Runner settings tab with file opener preference panel" %}

# Extensions & Plugins

There are many third-party IDE extensions and plugins to help integrate your IDE with Cypress.

## Visual Studio Code

- {% url "Cypress Fixture-IntelliSense" https://marketplace.visualstudio.com/items?itemName=JosefBiehler.cypress-fixture-intellisense %}: Supports your {% url "`cy.fixture()`" fixture %} and {% url "`cy.route(..., "fixture:")`" route %} commands by providing intellisense for existing fixtures.
- {% url "Cypress Helper" https://marketplace.visualstudio.com/items?itemName=Shelex.vscode-cy-helper %}: Various helpers and commands for integration with Cypress.
- {% url "Cypress Snippets" https://marketplace.visualstudio.com/items?itemName=andrew-codes.cypress-snippets %}: Useful Cypress code snippets.
- {% url "Open Cypress" https://marketplace.visualstudio.com/items?itemName=tnrich.vscode-extension-open-cypress %}: Allows you to open Cypress specs and single `it()` blocks directly from VS Code.
- {% url "Test Utils" https://marketplace.visualstudio.com/items?itemName=chrisbreiding.test-utils %}: Easily add or remove `.only` and `.skip` modifiers with keyboard shortcuts or the command palette.

## IntelliJ Platform

Compatible with IntelliJ IDEA, AppCode, CLion, GoLand, PhpStorm, PyCharm, Rider, RubyMine, and WebStorm.

- {% url "Cypress Support" https://plugins.jetbrains.com/plugin/13819-intellij-cypress %}: Integrates Cypress under the common Intellij test framework.
- {% url "Cypress Support Pro" https://plugins.jetbrains.com/plugin/13987-cypress-pro %}: An improved version of Cypress Support plugin with debugging from the IDE, advanced autocomplete and other features.

# Intelligent Code Completion

## Writing Tests

### Features

IntelliSense is available for Cypress. It offers intelligent code suggestions directly in your IDE while writing tests. A typical IntelliSense popup shows command definition, a code example and a link to the full documentation page.

#### Autocomplete while typing Cypress commands

{% video local /img/snippets/intellisense-cypress-assertion-matchers.mp4 %}

#### Signature help when writing and hovering on Cypress commands

{% video local /img/snippets/intellisense-method-signature-examples.mp4 %}

#### Autocomplete while typing assertion chains, including only showing DOM assertions if testing on a DOM element.

{% video local /img/snippets/intellisense-assertion-chainers.mp4 %}

### Set up in your Dev Environment

This document assumes you have {% url "installed Cypress" installing-cypress %}.

Cypress comes with TypeScript {% url "type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} included. Modern text editors can use these type declarations to show IntelliSense inside spec files.

#### Triple slash directives

The simplest way to see IntelliSense when typing a Cypress command or assertion is to add a {% url "triple-slash directive" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %} to the head of your JavaScript or TypeScript testing file. This will turn the IntelliSense on a per file basis. Copy the comment line below and paste it into your spec file.

```js
/// <reference types="Cypress" />
```

{% video local /img/snippets/intellisense-setup.mp4 %}

If you write {% url 'custom commands' custom-commands %} and provide TypeScript definitions for them, you can use the triple slash directives to show IntelliSense, even if your project uses only JavaScript. For example, if your custom commands are written in `cypress/support/commands.js` and you describe them in `cypress/support/index.d.ts` use:

```js
// type definitions for Cypress object "cy"
/// <reference types="cypress" />

// type definitions for custom commands like "createDefaultTodos"
/// <reference types="../support" />
```

See the {% url `cypress-example-todomvc` https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense %} repository for a working example.

If the triple slash directive does not work, please refer to your code editor in {% url "TypeScript's Editor Support doc" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} and follow the instructions for your IDE to get {% url "TypeScript support" typescript-support %} and intelligent code completion configured in your developer environment first. TypeScript support is built in for {% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}, and {% url "WebStorm" https://www.jetbrains.com/webstorm/ %} - all other editors require extra setup.

#### Reference type declarations via `jsconfig`

Instead of adding triple slash directives to each JavaScript spec file, some IDEs (like VS Code) understand a common `jsconfig.json` file in the root of the project. In that file, you can include the Cypress module and your test folders.

```json
{
  "include": [
    "./node_modules/cypress",
    "cypress/**/*.js"
  ]
}
```

The Intelligent Code Completion should now show help for `cy` commands inside regular JavaScript spec files.

#### Reference type declarations via `tsconfig`

Adding a {% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %} inside your {% url "`cypress` folder" writing-and-organizing-tests#Folder-Structure %} with the following configuration should get intelligent code completion working.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": [
      "cypress"
    ]
  },
  "include": [
    "**/*.*"
  ]
}
```

## Configuration

### Features:

When editing the {% url "configuration file (`cypress.json` by default)" configuration %}, you can use our {% url "json schema file" https://on.cypress.io/cypress.schema.json %} to get intelligent tooltips in your IDE for each configuration property.

#### Property help when writing and hovering on configuration keys

{% video local /img/snippets/intellisense-cypress-config-tooltips.mp4 %}

#### Properties list with intelligent defaults

{% video local /img/snippets/intellisense-config-defaults.mp4 %}

### Set up in your Dev Environment:

Intelligent code completion using JSON schemas is supported by default in {% url "Visual Studio Code" https://code.visualstudio.com/ %} and {% url "Visual Studio" https://www.visualstudio.com/ %}. All other editors will require extra configuration or plugins for JSON schema support.

To set up in {% url "Visual Studio Code" https://code.visualstudio.com/ %} you can open `Preferences / Settings / User Settings` and add the `json.schemas` property. Make sure to replace `cypress.json` with your configuration file if not the default.

```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "cypress.json"
      ],
      "url": "https://on.cypress.io/cypress.schema.json"
    }
  ]
}
```

Or you can directly add a `$schema` key to your Cypress configuration file, which is a great way to share the schema with all collaborators of the project.

```json
"$schema": "https://on.cypress.io/cypress.schema.json",
```

## See also

- {% url 'Adding custom properties to the global `window` with the right TypeScript type' https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense %}
