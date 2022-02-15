Different frameworks render their components differently, so we provide
framework-specific `mount()` functions, which can be imported like so:

<code-group-react-vue>
<template #react-alert>
<Alert type="info">

<strong class="alert-header">A note for React users</strong>

The `mount()` command exported from the
[@cypress/react](https://github.com/cypress-io/cypress/tree/develop/npm/react)
library supports standard JSX syntax for mounting components. If you have any
questions about mount options that aren't covered in this guide, be sure to
check out the library
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/react#readme).

</Alert>
</template>
<template #react>

```js
import { mount } from '@cypress/react'
```

</template>
<template #vue-alert>
<Alert type="info">

<strong class="alert-header">A note for Vue users</strong>

The `mount()` command exported from the
[@cypress/vue](https://github.com/cypress-io/cypress/tree/develop/npm/vue)
library uses [Vue Test Utils](https://vue-test-utils.vuejs.org/) internally, but
instead of mounting your components in a virtual browser in node, it mounts them
in your actual browser. If you have any questions about mount options that
aren't covered in this guide, be sure to check out the library
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/vue#readme).

</Alert>
</template>
<template #vue>

```js
import { mount } from '@cypress/vue'
```

</template>
</code-group-react-vue>
