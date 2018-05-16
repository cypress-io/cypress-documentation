---
title: Intelligent Code Completion

---

# Writing Tests

## Features

IntelliSense is available for Cypress. It offers intelligent code suggestions directly in your IDE while writing tests.

### Autocomplete while typing Cypress commands

{% img /img/guides/intellisense-cypress-assertion-matchers.gif "Autocomplete on Cypress methods" %}

### Signature help when writing and hovering on Cypress commands

{% img /img/guides/intellisense-method-signature-examples.gif "Method Signature Tooltips" %} 

### Autocomplete while typing assertion chains, including only showing DOM assertions if testing on a DOM element.

{% img /img/guides/intellisense-assertion-chainers.gif "Assertion Chainers in VSCode" %}

## Set up in your Dev Environment

The TypeScript {% url "type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} are used to generate the data for intellisense and come packaged within Cypress. This document assumes you have {% url "installed Cypress" installing-cypress %}.

Please refer to your code editor in {% url "TypeScript's Editor Support doc" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} and follow the instructions for your IDE to get {% url "TypeScript support" typescript-support %} and intelligent code completion configured in your developer environment first. TypeScript support is built in for {% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}, and {% url "WebStorm" https://www.jetbrains.com/webstorm/ %} - all other editors require extra setup.

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

### Triple slash directives

Adding a {% url "triple-slash directive" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %} to the head of your JavaScript or TypeScript testing file should get intellisense working on a per file basis.

```js
/// <reference types="Cypress" />
```

{% img /img/guides/intellisense-setup.gif %}


# Configuration

## Features

When editing the {% url "`cypress.json`" configuration %} file, you can use our {% url "json schema file" https://on.cypress.io/cypress.schema.json %} to get intelligent tooltips in your IDE for each configuration property. 

### Property help when writing and hovering on configuration keys

{% img /img/guides/intellisense-cypress-config-tooltips.gif "Configuration tooltips" %}

### Properties list with intelligent defaults

{% img /img/guides/intellisense-config-defaults.gif "Default values prefill" %}


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