---
title: After Run API
containerClass: experimental
---

The `after:run` event fires after a run is finished. The event only fires when running via `cypress run`.

The event will fire each time `cypress run` executes. As a result, if running your specs in {% url "parallel" parallelization %}, the event will fire once for each machine on which `cypress run` is called.

{% note warning %}
{% fa fa-warning orange %} **This is an experimental feature. In order to use it, you must set the {% url "`experimentalRunEvents`" experiments %} configuration option to `true`.**
{% endnote %}

# Syntax

```js
on('after:run', (results) => { /* ... */ })
```

**{% fa fa-angle-right %} results** ***(Object)***

Results of the run, including the total number of passes/failures/etc, the project config, and details about the browser and system. It is the same as the results object resolved by the {% url "Module API" module-api#Results %}.

# Usage

You can return a promise from the `after:run` event handler and it will be awaited before Cypress proceeds running your specs.

## Log the number of passed tests of a run

```javascript
module.exports = (on, config) => {
  on('after:run', (results) => {
    // results will look something like this:
    // {
    //   totalDuration: 81,
    //   totalSuites: 0,
    //   totalTests: 1,
    //   totalFailed: 0,
    //   totalPassed: 1,
    //   totalPending: 0,
    //   totalSkipped: 0,
    //   browserName: 'electron',
    //   browserVersion: '59.0.3071.115',
    //   osName: 'darwin',
    //   osVersion: '16.7.0',
    //   cypressVersion: '3.1.0',
    //   config: {
    //     projectId: '1qv3w7',
    //     baseUrl: 'http://example.com',
    //     viewportWidth: 1000,
    //     viewportHeight: 660,
    //     // ... more properties...
    //   }
    //   // ... more properties...
    //   }
    // }

    console.log(results.totalPassed, 'out of', results.totalTests, 'passed')
  })
}
```

# See also

- {% url "Before Run API" before-run-api %}
- {% url "Before Spec API" before-spec-api %}
- {% url "After Spec API" after-spec-api %}
- {% url "Plugins Guide" plugins-guide %}
- {% url "Writing a Plugin" writing-a-plugin %}
