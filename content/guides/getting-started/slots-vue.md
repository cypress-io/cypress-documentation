---
title: Testing Vue Components with Slots
---

Slots are one of the most powerful language features in Vue. With the ability to
define fallback content, named slots, and scoped slots, they allow parent
components to inject their own markup, styles, and behavior.

Like props and events, slots are part of the component's public API.

Common components like Buttons and Inputs often use slots like "prefix" and
"suffix" to allow you to define icon placement and use SVGs or entire Icon
components.

Page-level layout components like a Sidebar or Footer also commonly make use of
slots.

Lastly, renderless components, like a Loading component or ApolloQuery component
make heavy use of slots in order to define what to render in various states
like: error, loading, and success.

## The simplest slot

We'll be showing off how to test a Modal that uses a default `<slot/>`. Like in
previous sections, we'll start simple.

<div style="position: relative; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.2); width: 400px; height: 320px;">
  <div style="padding: 10px; position: absolute; background: white; border-radius: 3px; min-height: 300px; min-width: 350px; margin: 0 auto;">
    <div>
      Modal's body content (passed in via slot)
    </div>
  </div>
</div>

<code-group style="padding-top: 20px;">

<code-block label="Test" active>

```js
it('renders the modal content', () => {
  cy.mount(Modal, { slots: { default: () => 'Content' } })
    .get(modalSelector)
    .should('have.text', 'Content')
})

it('can be closed', () => {
  cy.mount(Modal, { slots: { default: () => 'Content' } })
    .get(modalSelector)
    .should('have.text', 'Content')
    .get(closeButtonSelector)
    .should('have.text', 'Close')
    .click()
    // Repeat the assertion to make sure the text
    // is no longer visible
    .get(modalSelector)
    .should('not.have.text', 'Content')
})
```

</code-block>

<code-block label="With JSX">

```js
it('renders the modal content', () => {
  cy.mount(() => <Modal>Content</Modal>)
    .get(modalSelector)
    .should('have.text', 'Content')
})

it('can be closed', () => {
  cy.mount(() => <Modal>Content</Modal>)
    .get(modalSelector)
    .should('have.text', 'Content')
    .get(closeButtonSelector)
    .should('have.text', 'Close')
    .click()
    // Repeat the assertion to make sure the text
    // is no longer visible
    .get(modalSelector)
    .should('not.have.text', 'Content')
})
```

</code-block>

<code-block label="Composition">

```vue
<template>
  <div class="overlay" v-if="show">
    <div class="modal">
      <button @click="show = !show">Close</button>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<style scoped>
.overlay {
  position: fixed;
  display: flex;
  padding-top: 120px;
  justify-content: center;
  background: rgba(100, 100, 100, 30%);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.modal {
  position: absolute;
  min-height: 350px;
  min-width: 400px;
  background: white;
}
</style>
```

</code-block>

<code-block label="Options">

```vue
<template>
  <div class="overlay" v-if="show">
    <div class="modal">
      <button @click="show = !show">Close</button>
      <slot />
    </div>
  </div>
</template>

<script setup>
export default {
  data() {
    return {
      show: true,
    }
  },
}
</script>

<style scoped>
.overlay {
  position: fixed;
  display: flex;
  padding-top: 120px;
  justify-content: center;
  background: rgba(100, 100, 100, 30%);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.modal {
  position: absolute;
  min-height: 350px;
  min-width: 400px;
  background: white;
}
</style>
```

</code-block>

</code-group>

## Named Slots

Named slots in Vue give the parent component the ability to inject different
markup and logic from the parent into container components.

In the case of our modal, the modal might define a header, footer, and body
named slot.

This is all part of the component's API and exercising it thoroughly is the
responsibility of the test.

<div style="position: relative; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.2); width: 400px; height: 320px;">
  <div style="padding: 10px; position: absolute; display: flex; flex-direction: column; background: white; border-radius: 3px; min-height: 300px; min-width: 350px; margin: 0 auto;">
    <div style="font-size: 1.25rem">Header Content</div>
    <hr/>
    <div style="flex-grow: 1;">
      Modal's body content (passed in via slot)
    </div>
    <hr/>
    <div style="bottom: 0; display: flex; justify-content: space-between; width: 100%;">
    <button>Cancel</button>
    <button>Continue</button>
    </div>
  </div>
</div>

<code-group style="padding-top: 20px;">

<code-block label="Test" active>

```js
const footerText = 'My Custom Footer'
const headerText = 'My Custom Header'

const slots = {
  default: () => 'Content',
  footer: () => footerText,
  header: () => headerText
}

it('renders the default modal content', () => {
  cy.mount(Modal, { slots })
    .get(modalSelector).should('have.text', 'Content')
})

it('renders a custom footer', () => {
  const footerText = 'My Custom Footer'
  cy.mount(Modal, { slots })
    .get(modalSelector).should('have.text', 'Content')
    .and('have.text' footerText)
})

it('renders a custom header', () => {
  const headerText = 'My Custom Header'
  cy.mount(Modal, { slots })
    .get(modalSelector).should('have.text', 'Content')
    .and('have.text' headerText)
})

it('renders the fallback "Close" button when no footer is provided', () => {
  cy.mount(Modal, { slots })
    .get(modalSelector).should('have.text', 'Content')
    .get(closeButtonSelector).should('have.text', 'Close').click()
    // Repeat the assertion to make sure the text
    // is no longer visible
    .get(modalSelector).should('not.have.text', 'Content')
})
```

</code-block>

<code-block label="With JSX">

```js
const footerText = 'My Custom Footer'
const headerText = 'My Custom Header'

const slots = {
  footer: () => footerText,
  header: () => headerText
}

it('renders the default modal content', () => {
  cy.mount(() => <Modal {...slots}>Content</Modal>)
    .get(modalSelector).should('have.text', 'Content')
})

it('renders a custom footer', () => {
  const footerText = 'My Custom Footer'
  cy.mount(() => <Modal {...slots}>Content</Modal>)
    .get(modalSelector).should('have.text', 'Content')
    .and('have.text' footerText)
})

it('renders a custom header', () => {
  const headerText = 'My Custom Header'
  cy.mount(() => <Modal {...slots}>Content</Modal>)
    .get(modalSelector).should('have.text', 'Content')
    .and('have.text' headerText)
})

it('renders the fallback "Close" button when no footer is provided', () => {
  cy.mount(() => <Modal>Content</Modal>)
    .get(modalSelector).should('have.text', 'Content')
    .get(closeButtonSelector).should('have.text', 'Close').click()
    // Repeat the assertion to make sure the text
    // is no longer visible
    .get(modalSelector).should('not.have.text', 'Content')
})
```

</code-block>

<code-block label="Composition">

```vue
<template>
  <div class="overlay" v-if="show">
    <div class="modal">
      <div class="header"><slot name="header"></div>
      <hr/>
      <div class="content"><slot/></div>
      <hr/>
      <div class="footer"><slot name="footer"><button @click="show = !show">Close</button></slot></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<style scoped>
.overlay { /* Styles */ }
.modal {
  /* Styles */
  display: flex;
  flex-direction: column;
}

.header {
  font-size: 1.25rem;
}

.content {
  flex-grow: 1;
}
</style>
```

</code-block>

<code-block label="Options">

```vue
<template>
  <div class="overlay" v-if="show">
    <div class="modal">
      <div class="header"><slot name="header"></div>
      <hr/>
      <div class="content"><slot/></div>
      <hr/>
      <div class="footer"><slot name="footer">
        <button @click="show = !show">Close</button>
      </slot></div>
    </div>
  </div>
</template>

<script setup>
export default {
  data() {
    return {
      show: true
    }
  }
}
</script>

<style scoped>
.overlay { /* Styles */ }
.modal {
  /* Styles */
  display: flex;
  flex-direction: column;
}

.header {
  font-size: 1.25rem;
}

.content {
  flex-grow: 1;
}
</style>
```

</code-block>

</code-group>

## Scoped Slots

Now, what if we want to allow the parent to control when to close the modal? We
can provide a slot prop, a function, called **close** to any of the slots we
want.

The implementation of our modal will change slightly and we only have to show
off the template to demonstrate the change.

```vue
<template>
  <div class="overlay" v-if="show">
    <div class="modal">
      <div class="header"><slot name="header" :close="onClose"></div>
      <hr/>
      <div class="content"><slot :close="onClose"/></div>
      <hr/>
      <div class="footer"><slot name="footer" :close="onClose">
        <button @click="show = !show">Close</button>
      </slot></div>
    </div>
  </div>
</template>
```

Now here, we can write a few new tests! Each of our parent components should be
able to utilize the method and make sure it's wired up correctly. We're going to
import `h` from Vue to create real virtual nodes so that we can interact with
them from the _outside_ of the test.

This is one of the points at which you may find JSX/TSX tests more elegant to
work with.

<code-group>

<code-block label="Test" active>

```js
import { h } from 'vue'

const footerSelector = '[data-testid=footer-close]'
const headerSelector = '[data-testid=header-close]'
const contentSelector = '[data-testid=content-close]'
const text = 'Close me!'

const slots = {
  footer: ({ close }) => h('div', { onClick: close, 'data-testid': 'footer-close' }, text }),
  header: ({ close }) => h('div', { onClick: close, 'data-testid': 'header-close' }, text }),
  default: ({ close }) => h('div', { onClick: close, 'data-testid': 'content-close' }, text }),
}

it('The footer slot binds the close method', () => {
  cy.mount(Modal, { slots })
    .get(footerSelector).should('have.text', text)
    .click()
    .get(modalSelector).should('not.exist')
})

it('The header slot binds the close method', () => {
  cy.mount(Modal, { slots })
    .get(headerSelector).should('have.text', text)
    .click()
    .get(modalSelector).should('not.exist')
})

it('The default slot binds the close method', () => {
  cy.mount(Modal, { slots })
    .get(contentSelector).should('have.text', text)
    .click()
    .get(modalSelector).should('not.exist')
})
```

</code-block>

<code-block label="With JSX">

```jsx
const footerSelector = '[data-testid=footer-close]'
const headerSelector = '[data-testid=header-close]'
const contentSelector = '[data-testid=content-close]'
const text = 'Close me!'

const slots = {
  footer: ({ close }) => <div onClick={close} data-testid="footer-close">{text}</div>),
  header: ({ close }) => <div onClick={close} data-testid="header-close">{text}</div>),
  default: ({ close }) => <div onClick={close} data-testid="content-close">{text}</div>),
}

it('The footer slot binds the close method', () => {
  cy.mount(() => <Modal {...slots}/>)
    .get(footerSelector).should('have.text', text)
    .click()
    .get(modalSelector).should('not.exist')
})

it('The header slot binds the close method', () => {
  cy.mount(() => <Modal {...slots}/>)
    .get(headerSelector).should('have.text', text)
    .click()
    .get(modalSelector).should('not.exist')
})

it('The default slot binds the close method', () => {
  cy.mount(() => <Modal {...slots}/>)
    .get(contentSelector).should('have.text', text)
    .click()
    .get(modalSelector).should('not.exist')
})
```

</code-block>

</code-group>

Now that you're comfortable mounting components and asserting on their slots,
scoped slots, and fallbacks, you should be ready to test most components!

Let's work on configuring a custom mount command to handle applications like
Vuetify and plugins like Vue Router.
