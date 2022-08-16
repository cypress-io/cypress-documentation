---
title: 'Quickstart: React'
---

<CtBetaAlert></CtBetaAlert>

To follow along with this guide, you'll need a React application.

The quickest way to get started writing component tests for React is to use one
of the frameworks out there that can create a React project for you, like
[Create React App](https://create-react-app.dev/), or
[Vite](https://vitejs.dev/). In this guide, we will use Vite as it's quick to
get up and running.

To create a React project with Vite:

1. Run the scaffold command

```bash
npm create vite@latest my-awesome-app -- --template react
```

2. Go into the directory and run `npm install`

```bash
cd my-react-app
npm install
```

3. Add Cypress

```bash
npm install cypress -D
```

4. Open Cypress and follow the Launchpad's prompts!

```bash
npx cypress open
```

## Configuring Component Testing

Whenever you run Cypress for the first time in a project, the app will prompt
you to set up either **E2E Testing** or **Component Testing**. Choose
**Component Testing** and step through the configuration wizard.

<DocsImage 
  src="/img/guides/component-testing/select-test-type.png" 
  caption="Choose Component Testing"> </DocsImage>

The Project Setup screen automatically detects your framework and bundler, which
is React and Vite in our case. Cypress Component Testing uses your existing
development server config to render components, helping ensure your components
act and display in testing the same as they do in production.

<DocsImage 
  src="/img/guides/component-testing/project-setup-react.png" 
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
bit of internal state -- a "counter" that can be incremented and decremented by
two buttons.

<alert type="info">

If your component uses providers, network requests, or other environmental
setups, you will need additional work to get your component mounting. This is
covered in a [later section](/guides/component-testing/custom-mount-react).

</alert>

Add the Stepper component to your project:

<code-group>
<code-block label="Stepper.jsx" active>

```jsx
import { useState } from 'react'

export default function Stepper({ initial = 0 }) {
  const [count, setCount] = useState(initial)

  return (
    <div>
      <button aria-label="decrement" onClick={() => setCount(count - 1)}>
        -
      </button>
      <span data-cy="counter">{count}</span>
      <button aria-label="increment" onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  )
}
```

</code-block>
</code-group>

## Next Steps

Next, we will learn to mount the `<Stepper />` component with the mount command!

<NavGuide next="/guides/component-testing/mounting-react" />
