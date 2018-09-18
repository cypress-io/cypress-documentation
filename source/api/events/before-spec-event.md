---
title: before:spec
---

The `before:spec` event fires before a spec file is run.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `before:spec` before-spec-event %} | | {% fa fa-check-circle green %}

# Arguments

**{% fa fa-angle-right %} spec** ***(Object)***

Details of the spec file including name and paths.

# Usage

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `before:spec` event.

```javascript
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
