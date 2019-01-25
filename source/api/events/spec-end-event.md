---
title: spec:end
---

The `spec:end` event fires after a spec file and its tests run.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`spec:end` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} spec** ***(Object)***

Details of the spec file including name and path.

**{% fa fa-angle-right %} results** ***(Object)***

Details of the spec file's run results.

# Usage

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `spec:end` event.

```javascript
module.exports = (on, config) => {
  on('spec:end', (spec, results) => {
    // spec will look something like this:
    // {
    //   name: 'login_spec.js',
    //   relative: 'cypress/integration/login_spec.js',
    //   absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    // }

    // results will look something like this:
    // {
    //   stats: {
    //     suites: 0,
    //     tests: 1,
    //     passes: 1,
    //     pending: 0,
    //     skipped: 0,
    //     failures: 0,
    //     // ...more properties
    //   }
    //   reporter: 'spec',
    //   tests: [
    //     {
    //       title: ['login', 'logs user in'],
    //       state: 'passed',
    //       body: 'function () {}',
    //       // ...more properties...
    //     }
    //   ],
    //   error: null,
    //   video: '/Users/janelane/app/cypress/videos/passing_spec.js.mp4',
    //   screenshots: [],
    //   // ...more properties...
    // }
  })
}
```

# See also

- {% url `spec:start` spec-start-event %}
- {% url `brower:filePreprocessor` brower-filepreprocessor-event %}
