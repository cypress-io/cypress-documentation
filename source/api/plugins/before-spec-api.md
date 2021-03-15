---
title: Before Spec API
---

The `before:spec` event fires before a spec file is run. The event only fires when running via `cypress run`.

# Syntax

{% partial code_runs_in_node %}

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

You can return a promise from the `before:spec` event handler and it will be awaited before Cypress proceeds running the spec.

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

# See also

- {% url "After Spec API" after-spec-api %}
- {% url "Before Run API" before-run-api %}
- {% url "After Run API" after-run-api %}
- {% url "Plugins Guide" plugins-guide %}
- {% url "Writing a Plugin" writing-a-plugin %}
