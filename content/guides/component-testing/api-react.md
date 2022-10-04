---
title: 'React Mount API'
---

## `mount`

We ship a `mount()` function for mounting React components in isolation. It is
responsible for rendering the component within Cypress's sandboxed iframe and
handling any framework-specific cleanup.

The `mount()` function is imported directly from the `cypress` module:

```js
// React 16, 17
import { mount } from 'cypress/react'

// React 18
import { mount } from 'cypress/react18'
```

...
