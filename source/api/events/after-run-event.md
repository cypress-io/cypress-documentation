---
title: after:run Event
---

The `after:run` event fires after the run finishes.

# Environment

Occurs only in the {% url "background process" background-process %}.

# Arguments

* run results **(Object)**

# Usage

```javascript
// cypress/background/index.js

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
