---
title: Selector Playground
comments: false
---

The Selector Playground is an interactive feature that helps you:

* Determine a unique selector for an element.
* See what elements match a given selector.
* See what element matches a string of text.

{% img /img/guides/selector-playground.gif Selector Playground %}

## Uniqueness

Cypress will automatically calculate a **unique selector** to use targeted element by running through a series of selector strategies.

By default Cypress will favor:

1. `data-cy`
2. `data-test`
3. `data-testid`
4. `id`
5. `class`
6. `tag`
7. `attributes`
8. `nth-child`

{% note info "This is configurable" %}
Cypress allows you to control how a selector is determined.

Use the {% url "`Cypress.SelectorPlayground`" selector-playground %} API to control the selectors you want returned.
{% endnote %}

## Best Practices

You may find yourself struggling to write good selectors because:

- Your application uses dynamic ID's and class names
- Your tests break whenever there are CSS or content changes

To help with these common challenges, the Selector Playground automatically prefers certain `data-*` attributes when determining a unique selector.

Please read our {% url "Best Practices guide" best-practices#Selecting-Elements %} on helping you target elements and prevent tests from breaking on CSS or JS changes.

## Finding Selectors

To open the Selector Playground, click the `{% fa fa-crosshairs grey %}` button next to the URL at the top of the runner. Hover over elements in your app to preview a unique selector for that element in the tooltip.

![Opening selector playground and hovering over elements](https://user-images.githubusercontent.com/1157043/36675057-ebec0caa-1ad5-11e8-9308-1497bddd84aa.gif)

Click on the element and its selector will appear at the top. From there, you can copy it to your clipboard (`{% fa fa-copy grey %}`) or print it to the console (`{% fa fa-terminal %}`).

![Clicking an element, copying its selector to clipboard, printing it to the console](https://user-images.githubusercontent.com/1157043/36675058-ebf76de8-1ad5-11e8-9aa8-57f997d6b469.gif)

## Running Experiments

The box at the top that displays the selector is also a text input.

***Editing a Selector***

When you edit the selector, it will show you how many elements match and highlight those elements in your app.

![Type a selector to see what elements it matches](https://user-images.githubusercontent.com/1157043/36675059-ec04b89a-1ad5-11e8-8fec-273600912ce8.gif)

***Switching to Contains***

You can also experiment with what {% url `cy.contains()` contains %} would yield given a string of text. Click on `cy.get` and switch to `cy.contains`.

Type in text to see which element it matches. Note that {% url `cy.contains()` contains %} only yields the first element that matches the text, even if multiple elements on the page contain the text.

![Experiment with cy.contains](https://user-images.githubusercontent.com/1157043/36675344-b312762a-1ad6-11e8-89c0-f7aebbe5a985.gif)

***Disabling Highlights***

If you would like to interact with your app while the Selector Playground is open, the element highlighting might get in the way. Toggling the highlighting off will allow you to interact with your app more easily.

![Turn off highlighting](https://user-images.githubusercontent.com/1157043/36675343-b2fe0532-1ad6-11e8-82fe-369fdf0b1f5a.gif)
