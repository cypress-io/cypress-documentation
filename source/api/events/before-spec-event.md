---
title: before:spec
---

The `before:spec` event fires before a spec file is run.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `before:spec` before-spec-event %} | | {% fa fa-check-circle green %}

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
