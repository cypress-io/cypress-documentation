---
title: Browser Launch API
comments: false
---

Before Cypress launches a browser, it gives you the ability to modify the arguments used to launch it.

This is helpful to modify, remove, or add your own arguments.

The most common use case is adding your own extension.

# Usage

Using your `pluginsFile` you can tap into the `before:browser:launch` event and modify the arguments based on the browser that Cypress is launching.

```js
// cypress/plugins/index.js
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

    if (browser.name === 'firefox') {
      args.extensions.push('/path/to/my/extension')
      args.preferences['browser.blink_allowed'] = true
    }
  })
}
```

This event will yield you the `browser` as an object, and `args` which are the default arguments used to launch the browser.

`args` may be an array or an object (based on the type of browser we're launching).

Whatever you return from this event will become the new args for launching the browser.

Here is a list of {% url 'Chrome specific flags' "https://peter.sh/experiments/chromium-command-line-switches/" %} that may be useful to pass in.

Here is a list of {% url 'Firefox specific preferences' "http://kb.mozillazine.org/About:config_entries" %} that may be useful to pass in.
