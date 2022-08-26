---
title: invoke
---

Invoke a function on the previously yielded subject.

<Alert type="info">

If you want to get a property that is not a function on the previously yielded
subject, use [`.its()`](/api/commands/its).

</Alert>

## Syntax

```javascript
.invoke(functionName)
.invoke(options, functionName)
.invoke(functionName, args...)
.invoke(options, functionName, args...)

```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.wrap({ animate: fn }).invoke('animate') // Invoke the 'animate' function
cy.get('.modal').invoke('show') // Invoke the jQuery 'show' function
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.invoke('convert') // Errors, cannot be chained off 'cy'
cy.wrap({ name: 'Jane' }).invoke('name') // Errors, 'name' is not a function
```

### Arguments

**<Icon name="angle-right"></Icon> functionName** **_(String, Number)_**

Name of function to be invoked.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.invoke()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.invoke()` to resolve before [timing out](#Timeouts)                   |

**<Icon name="angle-right"></Icon> args...**

Additional arguments to be given to the function call. There is no limit to the
number of arguments.

## Examples

### Function

#### Assert on a function's return value

```javascript
const fn = () => {
  return 'bar'
}

cy.wrap({ foo: fn }).invoke('foo').should('eq', 'bar') // true
```

#### Use `.invoke()` to test HTML content

<Alert type="info">

[Check out our example recipe where we use `cy.invoke('text')` to test against HTML content in 'Bootstrapping your App'](/examples/examples/recipes#Server-Communication)

</Alert>

#### Properties that are functions are invoked

In the example below, we use `.invoke()` to force a hidden div to be
`'display: block'` so we can interact with its children elements.

```javascript
cy.get('div.container')
  .should('be.hidden') // element is hidden
  .invoke('show') // call jquery method 'show' on the '.container'
  .should('be.visible') // element is visible now
  .find('input') // drill down into a child "input" element
  .type('Cypress is great') // and type text
```

#### Use `.invoke('show')` and `.invoke('trigger')`

<Alert type="info">

[Check out our example recipe where we use `cy.invoke('show')` and `cy.invoke('trigger')` to click an element that is only visible on hover](/examples/examples/recipes#Testing-the-DOM)

</Alert>

### Function with Arguments

#### Send specific arguments to the function

```javascript
const fn = (a, b, c) => {
  return a + b + c
}

cy.wrap({ sum: fn })
  .invoke('sum', 2, 4, 6)
  .should('be.gt', 10) // true
  .and('be.lt', 20) // true
```

#### Use `cy.invoke('removeAttr', 'target')` to get around new tab

<Alert type="info">

[Check out our example recipe where we use `cy.invoke('removeAttr', 'target')` to test clicking on a link without opening in a new tab](/examples/examples/recipes#Testing-the-DOM)

</Alert>

#### Arguments are automatically forwarded to the function

```javascript
cy.get('img').invoke('attr', 'src').should('include', 'myLogo')
```

### Arrays

In the above examples, the subject was an object, but `cy.invoke` also works on
arrays and allows using numerical index to pick a function to run.

```javascript
const reverse = (s) => Cypress._.reverse(s)
const double = (n) => n * n

// picks function with index 1 and calls it with argument 4
cy.wrap([reverse, double]).invoke(1, 4).should('eq', 16)
```

### Invoking an async function

In this example we have a little text input field and we invoke an async action
which will disable this input field. `.invoke()` will then wait until the
Promise resolves and only then will continue executing to check if it really has
been disabled.

Our input field

```html
<input type="text" name="text" data-cy="my-text-input" />
```

The Cypress test with `cy.invoke()` awaiting the promise:

```javascript
function disableElementAsync(element) {
  return new Promise((resolve) => {
    setTimeout(() => {
      element.disabled = true
      resolve()
    }, 3000)
  })
}

cy.get('[data-cy=my-text-input]').then((textElements) => {
  cy.wrap({ disableElementAsync }).invoke(
    'disableElementAsync',
    textElements[0]
  )
})

// log message appears after 3 seconds
cy.log('after invoke')

// assert UI
cy.get('[data-cy=my-text-input]').should('be.disabled')
```

<Alert type="info">

For a full example where invoke is used to await async Vuex store actions, visit
the recipe:
[Vue + Vuex + REST](https://github.com/cypress-io/cypress-example-recipes)

</Alert>

### jQuery method

If the parent command yields a jQuery element, we can invoke a jQuery method,
like `attr`, `text`, or `val`. To confirm the element's `id` attribute for
example:

```html
<div id="code-snippet">The code example</div>
```

```js
cy.contains('The code example')
  .invoke('attr', 'id')
  .should('equal', 'code-snippet')
```

**Tip:** Cypress has a built-in Chai-jQuery assertion to confirm the attribute.
The above example can be written simply as:

```js
cy.contains('The code example').should('have.attr', 'id', 'code-snippet')
```

## Notes

### Third Party Plugins

#### Using a Kendo DropDown

If you are using `jQuery` then the `jQuery` wrapped elements will automatically
have your 3rd party plugins available to be called.

```javascript
cy.get('input')
  .invoke('getKendoDropDownList')
  .then((dropDownList) => {
    // yields the return of $input.getKendoDropDownList()
    return dropDownList.select('apples')
  })
```

We can rewrite the previous example in a more terse way and add an assertion.

```javascript
cy.get('input')
  .invoke('getKendoDropDownList')
  .invoke('select', 'apples')
  .invoke('val')
  .should('match', /apples/)
```

### Retries

`.invoke()` automatically retries invoking the specified method until the
returned value satisfies the attached assertions. The example below passes after
1 second.

```javascript
let message = 'hello'
const english = {
  greeting() {
    return message
  },
}

setTimeout(() => {
  message = 'bye'
}, 1000)

// initially the english.greeting() returns "hello" failing the assertion.
// .invoke('greeting') tries again and again until after 1 second
// the returned message becomes "bye" and the assertion passes
cy.wrap(english).invoke('greeting').should('equal', 'bye')
```

<DocsImage src="/img/api/invoke/invoke-retries.gif" alt="Invoke retries example" width-600 ></DocsImage>

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.invoke()` requires being chained off a previous command.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.invoke()` will wait for the `function` to exist on the subject
before running.</li><li>`.invoke()` will wait for the promise to resolve if the
invoked `function` returns a promise.</li><li>`.invoke()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.invoke()` can time out waiting for assertions you've added to
pass.</li><li>`.invoke()` can time out waiting for a promise you've returned to
resolve.</li></List>

## Command Log

**_Invoke jQuery show method on element_**

```javascript
cy.get('.connectors-div')
  .should('be.hidden')
  .invoke('show')
  .should('be.visible')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/invoke/invoke-jquery-show-on-element-for-testing.png" alt="Command Log for invoke" ></DocsImage>

When clicking on `invoke` within the command log, the console outputs the
following:

<DocsImage src="/img/api/invoke/log-function-invoked-and-return.png" alt="Console Log for invoke" ></DocsImage>

## History

| Version                                     | Changes                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| [3.8.0](/guides/references/changelog#3-8-0) | Added support for `options` argument                          |
| [3.7.0](/guides/references/changelog#3-7-0) | Added support for arguments of type Number for `functionName` |

## See also

- [`.its()`](/api/commands/its)
- [`.then()`](/api/commands/then)
- [`cy.wrap()`](/api/commands/wrap)
