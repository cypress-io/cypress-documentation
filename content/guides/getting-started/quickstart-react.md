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
npm create vite@latest my-react-app -- --template react
```

2. Go into the directory and run `npm install`

```bash
cd my-react-app
npm install
```

<!-- TODO: Show video of terminal running this command -->

3. Add Cypress

```bash
npm install cypress -D
```

4. Launch Cypress

```bash
npx cypress open
```

## Configuring Component Testing

Whenever you run Cypress for the first time in a project, the app will prompt
you to set up either E2E Testing or Component Testing. Choose Component Testing
and step through the configuration wizard.

The Cypress Launchpad will detect your framework and generate all the necessary
configuration files, and ensure all required dependencies are installed.

<!-- TODO: while it's nice to have this photo, it'd be even better to have a video! -->

<img src="/img/component-testing-automatic-configuration.png" style="border: none; box-shadow: none; margin-bottom: 1rem;" />
<p style="font-size: 0.85rem; text-align: center;">The Cypress Launchpad will scaffold all of these files for you.</p>

After setting up component testing, you will be at the Browser Selection screen.

<!-- TODO: Browser Selection screen with lots of browsers -->

<!-- Extraneous, belongs somewhere else: This page displays all of the browsers on your computer that we support. This generally means you'll see all Chromium-based browsers, Electron, and Firefox that are on your computer.  -->

Pick your favorite and click "Launch" to open the Cypress app.

<!-- Leaving out until we have a spec generator -->

<!-- ### In an empty project

In an empty project, we'll prompt you to use one of our new spec generators to
create a file that matches your project's `specPattern`. -->

<!-- TODO: Video of Generator -->

## Creating a Component

At this point, your project is set up but has no components to test yet.

Simple components with few environmental dependencies will be the easiest to
test.

Here are a few examples of similar components that will be easier or harder to
test:

| Easier-to-test             | Harder-to-test                          |
| :------------------------- | :-------------------------------------- |
| A Presentational Component | A Presentational Component w/ Chakra UI |
| Layout Component w/ Slots  | Layout Component w/ React Router        |
| Product List with Props    | Product List w/ Redux or Mobx           |

This section covers how to mount **simple** React components in a Cypress test
-- like Buttons, SVGs, Icons, or a Stepper component.

<!-- TODO: Switch between variants using a richer experience than just rendering them in a flat list. A tabbed controller? IDK. -->

<div style="display: flex; justify-content: space-evenly; border: 1px solid #ccc; padding-top: 1.25rem">

<button style="min-width: 120px; border: 1px solid indigo; padding: 0.5rem 0.5rem; border-radius: 3px;" >Outline</button>

<button style="min-width: 120px; background: indigo; color: white; font-weight: medium; border: 1px solid indigo; padding: 0.5rem 0.5rem; border-radius: 3px;" >Primary</button>

<button style="color: indigo; min-width: 120px; border: 1px solid indigo; padding: 0.5rem 0.5rem; border-radius: 3px;" ><icon name="graduation-cap" style="margin: 0 0.5rem;"></icon>With
an icon</button>

</div>

<p style="font-size: 0.85rem; text-align: center;">A button is an example of a component that is easier to test.</p>

<!-- TODO: Add links for each key word -->

<alert type="info">

If your component uses providers, network requests, or other environmental
setups, you will need additional work to get your component mounting. This is
covered in a later section.

</alert>

In this guide, we'll use a `<Stepper/>` component with zero dependencies and one
bit of internal state -- a "counter" that can be incremented and decremented by
two buttons.

Add the Stepper component to your project:

<code-group>
<code-block label="Stepper.jsx" active>

```jsx
import { useState } from 'react'

export default function Stepper({ initial = 0 }) {
  const [count, setCount] = useState(initial)

  return (
    <div data-testid="stepper">
      <button aria-label="decrement" onClick={() => setCount(count - 1)}>
        -
      </button>
      {count}
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

Next, learn how to mount the `<Stepper />` component with the mount command!

<NavGuide next="/guides/getting-started/mounting-react" />
