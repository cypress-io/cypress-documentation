---
title: before:spec
---

The `before:spec` event fires before a spec file is run.

The event timing is different depending on if Cypress is run via `cypress run` or `cypress open`.

- During `cypress run`, the event is fired as soon as possible when a spec is about to run.
- During `cypress open`, since there is not a discreet before or after to a spec running, the event is fired once before the browser is launched for a spec.

# Syntax

```js
on('before:spec', (spec) => { /* ... */ })
```

**{% fa fa-angle-right %} spec** ***(Object)***

Details of the spec file, including the following properties:

Property | Description
--- | ---
`name` | The base name of the spec file (e.g. `login_spec.js`)
`relative` | The path to the spec file, relative to the project root (e.g. `cypress/integration/login_spec.js`)
`absolute` | The absolute path to the spec file (e.g. `/Users/janelane/my-app/cypress/integration/login_spec.js`)

# Usage

## Log the relative spec path to stdout before the spec is run

```javascript
module.exports = (on, config) => {
  on('before:spec', (spec) => {
    // spec will look something like this:
    // {
    //   name: 'login_spec.js',
    //   relative: 'cypress/integration/login_spec.js',
    //   absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    // }

    console.log('Running', spec.relative)
  })
}
```

## Log the absolute spec path, but only when in run mode

You can utilize the `config.isInteractive` flag to determine if the spec is currently running via `cypress run` (run mode) or `cypress open` (interactive mode).

```javascript
module.exports = (on, config) => {
  on('before:spec', (spec) => {
    // only log if in run mode
    if (!config.isInteractive) {
      console.log('Running', spec.relative)
    }
  })
}
```

# See also

- {% url "Plugins Guide" plugins-guide %}
- {% url "Writing a Plugin" writing-a-plugin %}
