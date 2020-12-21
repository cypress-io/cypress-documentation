---
title: Before Run API
containerClass: experimental
---

The `before:run` event fires before a run starts. The event only fires when running via `cypress run`.

The event will fire each time `cypress run` executes. As a result, if running your specs in {% url "parallel" parallelization %}, the event will fire once for each machine on which the tests are run.

{% note warning %}
{% fa fa-warning orange %} **This is an experimental feature. In order to use it, you must set the {% url "`experimentalRunEvents`" experiments %} configuration option to `true`.**
{% endnote %}

# Syntax

```js
on('before:run', (details) => { /* ... */ })
```

**{% fa fa-angle-right %} details** ***(Object)***

Details of the run, including the project config, details about the browser and system, and the specs that will be run.

# Usage

You can return a promise from the `before:run` event handler and it will be awaited before Cypress proceeds running your specs.

## Log the browser and the number of specs that will be run

```javascript
module.exports = (on, config) => {
  on('before:run', (details) => {
    // details will look something like this:
    // {
    //   config: {
    //     projectId: '12345',
    //     baseUrl: 'http://example.com/',
    //     viewportWidth: 1000,
    //     viewportHeight: 660,
    //     // ...more properties...
    //   },
    //   browser: {
    //     name: 'electron',
    //     version: '59.0.3071.115',
    //     // ...more properties...
    //   },
    //   system:
    //   {
    //     osName: 'darwin',
    //     osVersion: '16.7.0',
    //   }
    //   cypressVersion: '6.1.0',
    //   specs: [
    //     {
    //       name: 'login_spec.js',
    //       relative: 'cypress/integration/login_spec.js',
    //       absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    //     },
    //     // ... more specs
    //   ],
    //   specPattern: [
    //     '**/*_spec.js'
    //   ],
    //   parallel: false,
    //   group: 'group-1',
    //   tag: 'tag-1'
    // }

    console.log('Running', details.specs.length, 'specs in', details.browser.name)
  })
}
```

# See also

- {% url "After Run API" after-run-api %}
- {% url "Before Spec API" before-spec-api %}
- {% url "After Spec API" after-spec-api %}
- {% url "Plugins Guide" plugins-guide %}
- {% url "Writing a Plugin" writing-a-plugin %}
