---
title: browser:launch
---

Before Cypress launches a browser, it gives you the ability to modify the arguments used to launch it.

This is helpful to modify, remove, or add your own arguments.

The most common use case is adding your own chrome extension.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`browser:launch` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} browser** ***(Object)***

Details of the browser including name, version, and path.

**{% fa fa-angle-right %} args** ***(Array|Object)***

Arguments passed to the browser. Arguments are different per browser, sometimes it is an Array, sometimes an Object.

# Usage

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `browser:launch` event.

```js
module.exports = (on, config) => {
  on('browser:launch', (browser = {}, args) => {
    console.log(browser, args) // see what all is in here!

    // browser will look something like this
    // {
    //   name: 'chrome',
    //   displayName: 'Chrome',
    //   version: '63.0.3239.108',
    //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //   majorVersion: '63'
    // }
  })
}
```

# Examples

## Modify the arguments based on the browser Cypress is launching.

`args` may be an array or an object (based on the type of browser we're launching). Whatever you return from this event will become the new args for launching the browser.

Here are options for the currently supported browsers:

* {% url 'Chrome' "https://peter.sh/experiments/chromium-command-line-switches/" %}
* {% url 'Electron' "https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions" %}

```js
module.exports = (on, config) => {
  on('browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--start-fullscreen')
    }

    if (browser.name === 'electron') {
      args['fullscreen'] = true
    }

    // whatever you return becomes the new args
    return args
  })
}
```

# See also

- {% url `run:start` run-start-event %}
- {% url 'Launching Browsers' launching-browsers %}
