---
title: Testing Angular Components with Emitted Events
---

Emitted events, like `@Input()`, are strictly part of the component's API. The
end user of your application is not even aware of the concept of emitted events.
This means that when you're testing emitted events, the _user_ you should keep
in mind while writing the test is the developer who will use your component.

You want to test the API contract of the component -- in Angular, a component's
API consists of `@Input()`, `@Output()`, `<ng-content>`, `directives` and **if
necessary** the surrounding component hierarchy.

Now, when you interact with the component, you should still do so as a user
would; however your assertions are focused on the developer's expectations. Does
that component emit the correct events with the right arguments at the proper
time when interacting with the component?

## Testing Emitted Events

In the StepperComponent, we use the `(click)` event (which uses Angular's event
binding syntax) on each button to call the increment and decrement methods
inside the Stepper Component class.

Because the component manages all of the state internally, it is opaque to the
developer or parent component consuming the Stepper.

```html
<button aria-label="decrement" (click)="decrement()">-</button>
<span data-cy="counter">{{ count }}</span>
<button aria-label="increment" (click)="increment()">+</button>
```

This can be fine, but depending on the needs of the developer, it can be
difficult for the _consumer of the Stepper_ (e.g. other components) to listen to
when change occurs or when the user interacts with the Stepper's various
buttons.

One solution is to `emit` an event called **change** to the consuming component
with the new internal state of the `StepperComponent`.

You would use the `StepperComponent` from a parent component like so:

```html
<div>
  What's your age?
  <app-stepper (change)="onAgeChange"></app-stepper>
  <!-- onAgeChange is a method the parent component defines -->
</div>
```

Here is what the implementation would look like:

<code-group>
<code-block label="stepper.component.ts" active>

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-stepper',
  template: `
    <div>
      <button aria-label="decrement" (click)="decrement()">-</button>
      <span data-cy="counter">{{ count }}</span>
      <button aria-label="increment" (click)="increment()">+</button>
    </div>
  `,
})
export class StepperComponent {
  @Input() count = 0
  @Output() change = new EventEmitter()

  increment(): void {
    this.count++
    this.change.emit(this.count)
  }

  decrement(): void {
    this.count--
    this.change.emit(this.count)
  }
}
```

</code-block>
</code-group>

Above, we added a new `change` `EventEmitter`.

As the developer of the StepperComponent, you want to make sure that when the
end user clicks the increment and decrement buttons, that the **change** event
is emitted to the consuming component.

In Cypress, we use "spies" to accomplish this.

## Using Spies

How do we test that the custom `change` event is firing the incremented and
decremented values for the Stepper? We can use spies when we **Arrange**,
**Act**, and **Assert** in our test.

### Arrange

First, we **Arrange** our test.

Let's set up the spies and bind them to the component:

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  cy.mount('<app-stepper (change)="change.emit($event)"></app-stepper>', {
    componentProperties: {
      change: {
        emit: cy.spy().as('changeSpy'),
      },
    },
    declarations: [StepperComponent],
  })
})
```

</code-block>
</code-group>

> We're [aliasing](/guides/core-concepts/variables-and-aliases) the spy with
> `cy.as('changeSpy')` so that the Cypress Reporter prints out the name of the
> spy any time it is invoked. This lets you visually inspect the arguments of
> the emitted event in your browser. We are also able to acesss the spy by name
> later.

### Act

Next, we **Act** by firing a click event for the increment button.

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  cy.mount('<app-stepper (change)="change.emit($event)"></app-stepper>', {
    componentProperties: {
      change: {
        emit: cy.spy().as('changeSpy'),
      },
    },
    declarations: [StepperComponent],
  })
  // Act
  cy.get(incrementSelector).click()
})
```

</code-block>
</code-group>

### Assert

Finally, we **Assert** that the `change` event was emitted with the correct
value.

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  cy.mount('<app-stepper (change)="change.emit($event)"></app-stepper>', {
    componentProperties: {
      change: {
        emit: cy.spy().as('changeSpy'),
      },
    },
    declarations: [StepperComponent],
  })
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get('@changeSpy').should('have.been.calledWith', 1)
})
```

</code-block>
</code-group>

We may decide to combine this test with the previous tests we've written that
test multiple things at once in a given scenario.

Doing so is up to the discretion of the developer. Combining tests will result
in a faster overall test run. However, it may be more challenging to isolate why
a test failed in the first place. We recommend having longer tests for
end-to-end tests because setup and visiting pages are expensive. Longer tests
are not necessarily a problem for component tests because they are comparatively
quick.

## Accessing the Component Instance

There might be times when you might want to access the component instance
directly in your tests. To do so, use `.then()`, which enables us to work with
the subject that was yielded from the `cy.mount()` command. In this case, mount
yields an object that contains the rendered component and the fixture.

In the below example, we use the component to spy directly on the `change` event
emitter.

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
it('clicking + fires a change event with the incremented value', () => {
  cy.mount(
    '<app-stepper count="100" (change)="change.emit($event)"></app-stepper>',
    {
      componentProperties: { change: new EventEmitter() },
      declarations: [StepperComponent],
    }
  ).then((wrapper) => {
    console.log({ wrapper })
    cy.spy(wrapper.component.change, 'emit').as('changeSpy')
    return cy.wrap(wrapper).as('angular')
  })
  cy.get(incrementSelector).click()
  cy.get('@changeSpy').should('have.been.calledWith', 101)
})
```

</code-block>
</code-group>

## Using createOutputSpy()

To make spying on event emitters easier, there is a utility function called
`createOutputSpy()` which can be used to automatically create an `EventEmitter`
and setup the spy on it's `.emit()` method. It can be used like the following:

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
import { createOutputSpy } from 'cypress/angular'

it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  cy.mount('<app-stepper (change)="change.emit($event)"></app-stepper>', {
    declarations: [StepperComponent],
    componentProperties: {
      change: createOutputSpy<boolean>('changeSpy'),
    },
  })
  cy.get(incrementSelector).click()
  cy.get('@changeSpy').should('have.been.called')
})
```

</code-block>
</code-group>

## Using autoSpyOutputs

You might find yourself repeatedly creating a `cy.spy()` for each of your
component outputs. Because of this, we created an easy mechanism to handle this
for you. This feature can be turned on by passing the `autoSpyOutputs` flag into
`MountConfig`. After the component has been mounted you can then access each of
the generated spies using the `@Output()` property name + `Spy`. So our `change`
property can be accessed via its alias of `cy.get('@changeSpy')`

<code-group>
<code-block label="stepper.component.cy.ts" active>

```ts
it('clicking + fires a change event with the incremented value', () => {
  cy.mount(StepperComponent, {
    autoSpyOutputs: true,
    componentProperties: {
      count: 100,
    },
  })
  cy.get(incrementSelector).click()
  cy.get('@changeSpy').should('have.been.calledWith', 101)
})
```

</code-block>
</code-group>

<Alert type="warning">

The `autoSpyOutput` flag only works when passing in a component to the mount
function. It currently does not work with the template syntax.

</Alert>

<Alert type="warning">

`autoSpyOutput` is an **experimental feature** and could be removed or changed
in the future

</Alert>

## Learn More

Spying is a powerful technique for observing behavior in Cypress. Learn more
about using Spies in our
[Stubs, Spies, and Clocks guide](/guides/guides/stubs-spies-and-clocks).

## What's Next?

We're going to create a container component and learn how to test slots.

<NavGuide prev="/guides/component-testing/testing-angular" next="/guides/component-testing/slots-angular" />
