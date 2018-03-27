---
title: Intelligent Code Completion
comments: false
---

# Writing Tests

IntelliSense is available for Cypress. It offers intelligent code suggestions directly in your IDE while writing tests in your IDE.

***Autocomplete while typing Cypress commands***

{% img /img/guides/intellisense-cypress-assertion-matchers.gif "Autocomplete on Cypress methods" %}

***Signature help when writing and hovering on Cypress commands***

{% img /img/guides/intellisense-method-signature-examples.gif "Method Signature Tooltips" %} 

***Autocomplete while typing assertion chains, including only showing DOM assertions if testing on a DOM element.***

{% img /img/guides/intellisense-assertion-chainers.gif "Assertion Chainers in VSCode" %}

## Setup


The TypeScript type declarations are used to generate the data for intellisense and come packaged within Cypress. This doc assumes you have {% url "installed Cypress" installing-cypress %}.

Adding a {% url "triple-slash directive" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %} to the head of your JavaScript or TypeScript testing file should get intellisense working in most IDEs.

```js
/// <reference types="Cypress" />
```

{% img /img/guides/intellisense-setup.gif %}


# Configuration

When editing the {% url "`cypress.json`" configuration %} file, you can use our schema file to get intelligent tooltips in your IDE for each configuration property, helping you along the way. 

***Property help when writing and hovering on configuration keys***

{% img /img/guides/intellisense-cypress-config-tooltips.gif "Configuration tooltips" %}

***Properties list with intelligent defaults***

{% img /img/guides/intellisense-config-defaults.gif "Default values prefill" %}


## Setup

In {% url "VSCode" https://code.visualstudio.com/ %} you can open `Preferences / Settings / User Settings` and add the `json.schemas` property.

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