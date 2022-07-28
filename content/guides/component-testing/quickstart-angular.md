---
title: 'Quickstart: Angular'
---

<CtBetaAlert></CtBetaAlert>

To follow along with this guide, you'll need an Angular CLI application.

The quickest way to get started writing component tests for Angular is to use
the [Angular CLI](https://angular.io/cli).

To create an Angular project:

1. Install the Angular CLI

```bash
npm install -g @angular/cli
```

2. Create a new Angular application:

```bash
ng new my-awesome-app
```

3. Add Cypress

```bash
npm install cypress -D
```

4. Open it and follow the Launchpad's prompts!

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

The Project Setup screen automatically detects your framework, which is Angular.
Cypress Component Testing uses your existing development server config to render
components, helping ensure your components act and display in testing the same
as they do in production.

<DocsImage 
  src="/img/guides/component-testing/project-setup-angular.png" 
  caption=""> </DocsImage>

Next, the Cypress setup will detect your framework and generate all the
necessary configuration files, and ensure all required dependencies are
installed.

<DocsImage 
  src="/img/guides/component-testing/scaffolded-files-angular.png" 
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

In this guide, we'll use a `StepperComponent` with zero dependencies and one bit
of internal state, a "counter" that can be incremented and decremented by two
buttons.

<alert type="info">

If your component uses providers, modules, declarations, requests, or other
environmental setups, you will need additional work to get your component
mounting. This is covered in a later section.

</alert>

Add the Stepper component to your project:

<code-group>
<code-block label="stepper.component.ts" active>

```ts
@Component({
  selector: 'app-stepper',
  template: ` <div>
    <button aria-label="decrement" (click)="decrement()">-</button>
    <span data-cy="counter">{{ count }}</span>
    <button aria-label="increment" (click)="increment()">+</button>
  </div>`,
})
export class StepperComponent {
  @Input() count = 0

  decrement(): void {
    this.count--
  }

  increment(): void {
    this.count++
  }
}
```

</code-block>
</code-group>

## Next Steps

Next, we will learn to mount the `StepperComponent` with the mount command!

<NavGuide next="/guides/component-testing/mounting-angular" />
