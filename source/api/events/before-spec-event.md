---
title: before:spec
---

The `before:spec` event fires before a spec file is run.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`before:spec` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

{% wrap_end %}

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

# See also

- {% url `after:spec:run` after-spec-event %}
- {% url `before:run` before-run-event %}
- {% url `brower:filePreprocessor` brower-filepreprocessor-event %}
