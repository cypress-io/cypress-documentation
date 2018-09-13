---
title: before:spec Event
---

The `before:spec` event fires before a spec file is run.

# Environment

Occurs only in the {% url "background process" background-process %}.

# Arguments

* spec **(Object)**

# Usage

```javascript
// cypress/background/index.js

module.exports = (on, config) => {
  on('before:spec', (spec) => {
    // spec will look something like this:
    // {
    //   name: 'login_spec.js',
    //   relative: 'cypress/integration/login_spec.js',
    //   absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    // }
  })
}
```
