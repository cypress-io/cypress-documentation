---
title: after:run Event
---

The `after:run` event fires after the run finishes.

# Environment

Some events run in the {% url "browser" catalog-of-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both. {% url "See all events" catalog-of-events#Environment %}.

Event | Browser | Background Process
--- | --- | ---
`after:run` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

# Arguments

**{% fa fa-angle-right %} results** ***(Object)***

Results of the run.

# Usage

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `after:run` event.

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
    //     // more properties...
    //   }
    //   // ... more properties...
    //   }
    // }
  })
}
```

# See also

- {% url `after:spec:event` after-spec-event %}
- {% url `before:run:event` before-run-event %}
- {% url `before:spec:event` before-spec-event %}
- {% url 'Module API' module-api %}
