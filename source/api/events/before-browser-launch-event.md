---
title: before:browser:launch Event
---

Before Cypress launches a browser, it gives you the ability to modify the arguments used to launch it.

This is helpful to modify, remove, or add your own arguments.

The most common use case is adding your own chrome extension.

# Environment

Occurs only in the {% url "background process" background-process %}.

# Arguments

* browser **(Object)**
* args **(Array|Object)**

# Usage

Using your {% url "`backgroundFile`" background-process %} you can tap into the `before:browser:launch` event and modify the arguments based on the browser that Cypress is launching.

```js
// cypress/background/index.js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    console.log(browser, args) // see what all is in here!

    // browser will look something like this
    // {
    //   name: 'chrome',
    //   displayName: 'Chrome',
    //   version: '63.0.3239.108',
    //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //   majorVersion: '63'
    // }

    // args are different based on the browser
    // sometimes an array, sometimes an object

    if (browser.name === 'chrome') {
      args.push('--load-extension=/path/to/my/extension')

      // whatever you return here becomes the new args
      return args
    }
  })
}
```

This event will yield you the `browser` as an object, and `args`, which are the default arguments used to launch the browser.

`args` may be an array or an object (based on the type of browser we're launching).

Whatever you return from this event will become the new args for launching the browser.

Here are options for the currently supported browsers:

* {% url 'Chrome' "https://peter.sh/experiments/chromium-command-line-switches/" %}
* {% url 'Electron' "https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions" %}
