---
title: shadow
---

Traverse into the shadow DOM of an element.

## Syntax

```javascript
.shadow(selector)
.shadow(selector, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.shadow-host').shadow()
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.shadow() // Errors, cannot be chained off 'cy'
cy.exec('npm start').shadow() // Errors, 'exec' does not yield DOM element
cy.get('.not-a-shadow-host').shadow() // Errors, subject must host a shadow root
```

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.shadow()` yields the new DOM element(s) it found.</li></List>

## Examples

### Find and click on a button inside the shadow DOM

```html
<div class="shadow-host">
  #shadow-root
  <button class="my-button">Click me</button>
</div>
```

```javascript
// yields [#shadow-root (open)]
cy.get('.shadow-host').shadow().find('.my-button').click()
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.shadow()` requires being chained off a command that yields a DOM element that is a shadow host (i.e. has a shadow root directly attached to it).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.shadow()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`.shadow()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) host(s) a shadow root.</li><li>`.shadow()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.shadow()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`.shadow()` can time out waiting for the element(s) to host a shadow root.</li><li>`.shadow()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Traverse into the shadow DOM of an element_**

```javascript
cy.get('.shadow-host').shadow()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/shadow/shadow-command-log.png" alt="Command Log shadow" ></DocsImage>

When clicking on the `shadow` command within the command log, the console outputs the following:

<DocsImage src="/img/api/shadow/shadow-in-console.png" alt="console.log shadow" ></DocsImage>

## See also

- [`cy.get()`](/api/commands/get#Arguments) with `includeShadowDom` option
- [`cy.find()`](/api/commands/find#Arguments) with `includeShadowDom` option
- [`cy.contains()`](/api/commands/contains#Arguments) with `includeShadowDom` option
- [`includeShadowDom` config option](/guides/references/configuration#Global)
