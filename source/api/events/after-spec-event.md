---
title: after:spec  Event
---

The `after:spec` event fires after a spec file and its tests run.

# Environment

Occurs only in the {% url "background process" background-process %}.

# Arguments

* spec **(Object)**
* spec results **(Object)**

# Usage

```javascript
// cypress/background/index.js

module.exports = (on, config) => {
  on('after:spec', (spec, results) => {
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
