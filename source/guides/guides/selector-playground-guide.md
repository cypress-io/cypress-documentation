---
title: Selector Playground
comments: false
---

The Selector Playground is a feature in the UI of the Cypress runner that helps you to do the following:

* Determine a unique selector for an element that you can then use with {% url `cy.get()` get %} in your tests
* See what elements match a given selector using {% url `cy.get()` get %}
* See what element is selected for a given string of text using {% url `cy.contains()` contains %}

{% note warning %}
The Selector Playground is currently only available in Chrome and Chrome-based browsers.
{% endnote %}

## Find a unique selector

To open the Selector Playground, click the `{% fa fa-crosshairs grey %}` button next to the URL at the top of the runner. Hover over elements in your app to preview a unique selector for that element in the tooltip.

![Opening selector playground and hovering over elements](https://user-images.githubusercontent.com/1157043/36675057-ebec0caa-1ad5-11e8-9308-1497bddd84aa.gif)

Click on the element and its selector will appear at the top. From there, you can copy it to your clipboard (`{% fa fa-copy grey %}`) or print it to the console (`{% fa fa-terminal %}`).

![Clicking an element, copying its selector to clipboard, printing it to the console](https://user-images.githubusercontent.com/1157043/36675058-ebf76de8-1ad5-11e8-9aa8-57f997d6b469.gif)

## Experiment with your own selectors

The box at the top that displays the selector is also a text input. When you edit the selector, it will show you how many elements match and highlight those elements in your app.

![Type a selector to see what elements it matches](https://user-images.githubusercontent.com/1157043/36675059-ec04b89a-1ad5-11e8-8fec-273600912ce8.gif)

You can also experiment with what {% url `cy.contains()` contains %} would yield given a string of text. Click on `{% fa fa-terminal %} cy.get` and switch to `cy.contains`. Type in text to see which element it matches. (Note that {% url `cy.contains()` contains %} only yields the first element that matches the text, even if multiple elements on the page contain the text).

![Experiment with cy.contains](https://user-images.githubusercontent.com/1157043/36675344-b312762a-1ad6-11e8-89c0-f7aebbe5a985.gif)

If you would like to interact with your app while the Selector Playground is open, the element highlighting might get in the way. Toggling the highlighting off will allow you to interact with your app more easily.

![Turn off highlighting](https://user-images.githubusercontent.com/1157043/36675343-b2fe0532-1ad6-11e8-82fe-369fdf0b1f5a.gif)
