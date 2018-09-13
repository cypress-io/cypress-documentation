---
title: before:run Event
---

The `before:run` event fires before the run starts.

# Environment

Occurs only in the {% url "background process" background-process %}.

# Arguments

* run details **(Object)**

# Usage

```javascript
// cypress/background/index.js

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
    //     majorVersion: '59',
    //     isHeadless: true,
    //     isHeaded: false,
    //     // ...more properties...
    //   },
    //   system:
    //   {
    //     osName: 'darwin',
    //     osVersion: '16.7.0',
    //     // ...more properties...
    //   }
    //   cypressVersion: '3.1.0',
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
    //   parallel: false
    // }
  })
}
```
