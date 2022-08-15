---
title: 'Quickstart: Vue'
---

<CtBetaAlert></CtBetaAlert>

To follow along with this guide, you'll need a Vue application.

The quickest way to get started writing component tests for Vue is to use
[Vue's own project scaffolding tool](https://vuejs.org/guide/quick-start.html).

To create a Vue project:

1. Run the scaffold command

```bash
npm init vue@latest
```

Follow the prompts to create your app. During the setup, you will be asked if
you would like to install Cypress. You can do so now or in the next step.

2. Add Cypress if you didn't select it in the Vue scaffolding options

```bash
npm install cypress -D
```

3. Open Cypress and follow the Launchpad's prompts!

```bash
npx cypress open
```

## Configuring Component Testing

If you selected Cypress during the Vue scaffolding options, then component
testing will be all setup and ready to go.

If you did not, then when you run Cypress for the first time in a project, the
app will prompt you to set up either **E2E Testing** or **Component Testing**.
Choose **Component Testing** and step through the configuration wizard.

<DocsImage 
  src="/img/guides/component-testing/select-test-type.png" 
  caption="Choose Component Testing"> </DocsImage>

The Project Setup screen automatically detects your framework and bundler, which
is Vue and Vite in our case. Cypress Component Testing uses your existing
development server config to render components, helping ensure your components
act and display in testing the same as they do in production.

<DocsImage 
  src="/img/guides/component-testing/project-setup-vue.png" 
  caption=""> </DocsImage>

Next, the Cypress setup will detect your framework and generate all the
necessary configuration files, and ensure all required dependencies are
installed.

<DocsImage 
  src="/img/guides/component-testing/scaffolded-files.png" 
  caption="The Cypress launchpad will scaffold all of these files for you">
</DocsImage>

After setting up component testing, you will be at the Browser Selection screen.

Pick the browser of your choice and click the "Start Component Testing" button
to open the Cypress app.

<DocsImage 
  src="/img/guides/component-testing/select-browser.png" 
  caption="Choose your browser"> </DocsImage>

## Creating a Component

At this point, your project is set up but has no components to test yet.

In this guide, we'll use a `<Stepper/>` component with zero dependencies and one
bit of internal state, a "counter" that can be incremented and decremented by
two buttons.

<alert type="info">

If your component uses plugins, network requests, or other environmental setups,
you will need additional work to get your component mounting. This is covered in
a [later section](/guides/component-testing/custom-mount-vue).

</alert>

Add the Stepper component to your project:

<code-group>
<code-block label="Stepper.vue" active>

```html
<template>
  <div>
    <button aria-label="decrement" @click="count--">-</button>
    <span data-cy="counter">{{ count }}</span>
    <button aria-label="increment" @click="count++">+</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const props = defineProps(['initial'])

  const emit = defineEmits(['change'])

  const count = ref(props.initial || 0)
</script>
```

</code-block>
</code-group>

> We are using Vue's Composition API with script setup in this guide, but that
> is not required for Cypress Component testing and you can use the Options API
> as well. Learn more about
> [Vue API styles](https://vuejs.org/guide/introduction.html#api-styles).

## Next Steps

Next, we will learn to mount the `<Stepper />` component with the mount command!

<NavGuide next="/guides/component-testing/mounting-vue" />
