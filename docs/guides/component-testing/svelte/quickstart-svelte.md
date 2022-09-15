---
title: 'Quickstart: Svelte'
sidebar_position: 10
---

<CtBetaAlert></CtBetaAlert>

To follow along with this guide, you'll need a Svelte application.

The quickest way to get started writing component tests for Svelte is to
scaffold a new project using Vite

To create a new Svelte project use the Vite scaffold command:

1. Run Vite scaffold command

```bash
npm create vite@latest my-awesome-app
```

2. Follow the prompts and select `svelte` for the `framework` and `variant`

3. Go into the directory:

```bash
cd my-awesome-app
```

4. Add Cypress

```bash
npm install cypress -D
```

5. Open Cypress and follow the Launchpad's prompts!

```bash
npx cypress open
```

## Configuring Component Testing

When you run Cypress for the first time in the project, the Cypress app will
prompt you to set up either **E2E Testing** or **Component Testing**. Choose
**Component Testing** and step through the configuration wizard.

<DocsImage 
  src="/img/guides/component-testing/select-test-type.png" 
  caption="Choose Component Testing"> </DocsImage>

The Project Setup screen automatically detects your framework, which is Svelte.
Cypress Component Testing uses your existing development server config to render
components, helping ensure your components act and display in testing the same
as they do in production.

<DocsImage 
  src="/img/guides/component-testing/project-setup-svelte.png" 
  caption="Framework Detection"> </DocsImage>

Next, Cypress will verify your project has the required dependencies.

<DocsImage
src="/img/guides/component-testing/dependency-detection-svelte.png"
caption="Dependency Verification"> </DocsImage>

Finally, Cypress will generate all the necessary configuration files.

<DocsImage 
  src="/img/guides/component-testing/scaffolded-files-svelte.png" 
  caption="The Cypress launchpad will scaffold all of these files for you.">
</DocsImage>

After setting up component testing, you will be at the Browser Selection screen.

Pick the browser of your choice and click the "Start Component Testing" button
to open the Cypress app.

<DocsImage 
  src="/img/guides/component-testing/select-browser.png" 
  caption="Choose your browser"> </DocsImage>

## Creating a Component

At this point, your project is set up.

In this guide, we'll create a `Stepper` component with zero dependencies and one
bit of internal state, a "counter" that can be incremented and decremented by
two buttons.

Add a Stepper component to your project by creating a new file in the `src/lib`
directory called `Stepper.svelte`


```html title=Stepper.svelte
<script>
  export let count = 0;
</script>

<button aria-label="decrement" on:click={() => count--}>-</button>
<span data-cy="count">{count}</span>
<button aria-label="increment" on:click={() => count++}>+</button>
```

## Next Steps

Next, we will learn to mount the `Stepper` component with the mount command!
