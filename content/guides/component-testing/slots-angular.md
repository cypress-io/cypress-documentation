---
title: Testing Angular Components with Slots
---

Content projection is a pattern in which you insert, or **project**, the content
you want to use inside another component. In angular there are three types
content projection, `single-slot`, `multi-slot`, and `conditional`.

Like props and events, slots are part of the component's public API.

## Single-slot Content Projection

The most basic form of content projection is known as **single-slot content
projection**. This refers to creating a component into which you can project one
component using `<ng-content></ng-content>`. You can learn more about
Single-slot content projection at
[https://angular.io/guide/content-projection#single-slot](https://angular.io/guide/content-projection#single-slot)

Below is a simple ButtonComponent that is using **single-slot content
projection** and its corresponding component test. Notice we create a
**WrapperComponent** in our spec that we use to simulate passing in content to
the `ButtonComponent` using content projection.

<code-group>

<code-block label="button.component.ts" active>

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-button',
    template: `
        <button>
            <ng-content></ng-content>
        </button>
    `
})
export class ButtonComponent {...}
```

</code-block>
<code-block label="button.component.cy.ts">

```ts
import { Component } from '@angular/core'
import { ButtonComponent } from './button.component'

// We create this WrapperComponent to validate
// content projection in our tests
@Component({
  template: `<app-button>Click Me</app-button>`,
})
class WrapperComponent {}

describe('ButtonComponent', () => {
  it('can project content using a Wrapper component', () => {
    cy.mount(WrapperComponent, {
      declarations: [ButtonComponent],
    })
    cy.get('button').contains('Click Me')
  })
})
```

</code-block>
</code-group>

## Multi-slot Content Projection

An Angular component can also have multiple slots used for content projection.
Each slot can specify a CSS selector that determines which content goes into
that slot. This pattern is referred to as **multi-slot content projection**.
With this pattern you must specify where you want the projected content to
appear.

Below is an example of CardComponent that is using **multi-slot content
projection** and its corresponding component test. Notice we create a
**WrapperComponent** in our spec that we use to simulate passing in content to
the `CardComponent` using content projection.

<code-group>
<code-block label="card.component.ts" active>

```ts
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[cardHeader]"></ng-content>
      </div>

      <div class="card-body">
        <!--Default Slot -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {}
```

</code-block>

<code-block label="card.component.cy.ts">

```ts
import { Component } from '@angular/core'
import { ButtonComponent } from '../button/button.component'
import { CardComponent } from './card.component'

@Component({
  template: `
    <app-card>
      <h1 cardHeader>My Title</h1>
      <p>My text goes here...</p>
      <app-button>Save</app-button>
    </app-card>
  `,
})
class WrapperComponent {}

describe('CardComponent', () => {
  it('can project content using a WrapperComponent', () => {
    cy.mount(WrapperComponent, {
      declarations: [CardComponent, ButtonComponent],
    })
    cy.get('h1').contains('My Title')
    cy.get('p').contains('My text goes here...')
    cy.get('button').contains('Save')
  })
})
```

</code-block>
</code-group>

## Conclusion

At this point, you should be able to setup a complex application and mount
components that use all of Angular's language features.

Congrats! Happy building. 🎉

<NavGuide prev="/guides/component-testing/events-vue" />
