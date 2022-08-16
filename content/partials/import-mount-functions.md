Different frameworks render their components differently, so we provide
framework-specific `mount()` functions, which can be imported like so:

<code-group-react-vue-angular>
<template #react-alert>
<Alert type="info">

<strong class="alert-header">A note for React users</strong>

The `mount()` command exported from the
[cypress/react](https://github.com/cypress-io/cypress/tree/develop/npm/react)
module supports standard JSX syntax for mounting components. If you have any
questions about mount options that aren't covered in this guide, be sure to
check out the module
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/react#readme).

</Alert>
</template>
<template #react>

```js
import { mount } from 'cypress/react'
```

</template>
<template #vue-alert>
<Alert type="info">

<strong class="alert-header">A note for Vue users</strong>

The `mount()` command exported from the
[cypress/vue](https://github.com/cypress-io/cypress/tree/develop/npm/vue)
library uses [Vue Test Utils](https://vue-test-utils.vuejs.org/) internally, but
instead of mounting your components in a virtual browser in node, it mounts them
in your actual browser. If you have any questions about mount options that
aren't covered in this guide, be sure to check out the library
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/vue#readme).

</Alert>
</template>
<template #vue>

```js
// For Vue 3
import { mount } from 'cypress/vue'

// For Vue 2
import { mount } from 'cypress/vue-2'
```

</template>
<template #angular-alert>
<Alert type="info">

<strong class="alert-header">A note for Angular users</strong>

The `mount()` command exported from the
[cypress/angular](https://github.com/cypress-io/cypress/tree/develop/npm/angular)
library uses [Angular TestBed](https://angular.io/api/core/testing/TestBed)
internally, but instead of mounting your components in a virtual browser in
node, it mounts them in your actual browser. If you have any questions about
mount options that aren't covered in this guide, be sure to check out the
library
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/angular#readme).

</Alert>
</template>
<template #angular>

```ts
import { mount } from 'cypress/angular'
```

</template>
</code-group-react-vue-angular>
