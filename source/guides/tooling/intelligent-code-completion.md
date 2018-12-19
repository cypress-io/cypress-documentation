---
title: Intelligent Code Completion

---

# Writing Tests

## Features

IntelliSense is available for Cypress. It offers intelligent code suggestions directly in your IDE while writing tests. A typical IntelliSense popup shows command definition, code example and link to the full documentation page.

### Autocomplete while typing Cypress commands

{% video local /img/snippets/intellisense-cypress-assertion-matchers.mp4 %}

### Signature help when writing and hovering on Cypress commands

{% video local /img/snippets/intellisense-method-signature-examples.mp4 %}

### Autocomplete while typing assertion chains, including only showing DOM assertions if testing on a DOM element.

{% video local /img/snippets/intellisense-assertion-chainers.mp4 %}

## Set up in your Dev Environment

This document assumes you have {% url "installed Cypress" installing-cypress %}.

Cypress comes with TypeScript {% url "type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} included. Modern text editors can use these type declarations to show IntelliSense inside spec files.

### Triple slash directives

The simplest way to see IntelliSense when typing a Cypress command or assertion is to add a {% url "triple-slash directive" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %} to the head of your JavaScript or TypeScript testing file. This will turn the IntelliSense on a per file basis. Just copy the comment line below and paste it into your spec file.

```js
/// <reference types="Cypress" />
```

{% video local /img/snippets/intellisense-setup.mp4 %}

If the triple slash directive does not work, please refer to your code editor in {% url "TypeScript's Editor Support doc" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} and follow the instructions for your IDE to get {% url "TypeScript support" typescript-support %} and intelligent code completion configured in your developer environment first. TypeScript support is built in for {% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}, and {% url "WebStorm" https://www.jetbrains.com/webstorm/ %} - all other editors require extra setup.

### Reference type declarations via `tsconfig`

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

# Configuration

## Features

When editing the {% url "`cypress.json`" configuration %} file, you can use our {% url "json schema file" https://on.cypress.io/cypress.schema.json %} to get intelligent tooltips in your IDE for each configuration property.

### Property help when writing and hovering on configuration keys

{% video local /img/snippets/intellisense-cypress-config-tooltips.mp4 %}

### Properties list with intelligent defaults

{% video local /img/snippets/intellisense-config-defaults.mp4 %}


## Set up in your Dev Environment

Intelligent code completion using JSON schemas is supported by default in {% url "Visual Studio Code" https://code.visualstudio.com/ %} and {% url "Visual Studio" https://www.visualstudio.com/ %}. All other editors will require extra configuration or plugins for JSON schema support.

To set up in {% url "Visual Studio Code" https://code.visualstudio.com/ %} you can open `Preferences / Settings / User Settings` and add the `json.schemas` property.

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
