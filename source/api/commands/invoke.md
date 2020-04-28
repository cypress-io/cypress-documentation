---
title: invoke
---

Invoke a function on the previously yielded subject.

{% note info %}
If you want to get a property that is not a function on the previously yielded subject, use {% url `.its()` its %}.
{% endnote %}

# Syntax

```javascript
.invoke(functionName)
.invoke(options, functionName)
.invoke(functionName, args...)
.invoke(options, functionName, args...)

```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.wrap({ animate: fn }).invoke('animate') // Invoke the 'animate' function
cy.get('.modal').invoke('show')            // Invoke the jQuery 'show' function
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.invoke('convert')                     // Errors, cannot be chained off 'cy'
cy.wrap({ name: 'Jane' }).invoke('name') // Errors, 'name' is not a function
```

## Arguments

**{% fa fa-angle-right %} functionName**  ***(String, Number)***

Name of function to be invoked.

**{% fa fa-angle-right %} options** **_(Object)_**

Pass in an options object to change the default behavior of `.invoke()`.

| Option    | Default                                                  | Description                        |
| --------- | -------------------------------------------------------- | ---------------------------------- |
| `log`     | `true`                                                   | {% usage_options log %}            |
| `timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .invoke %}   |

**{% fa fa-angle-right %} args...**

Additional arguments to be given to the function call. There is no limit to the number of arguments.

# Examples

## Function

### Assert on a function's return value

```javascript
const fn = () => {
  return 'bar'
}

cy.wrap({ foo: fn }).invoke('foo').should('eq', 'bar') // true
```

### Use `.invoke()` to test HTML content

{% note info %}
{% url "Check out our example recipe where we use `cy.invoke('text')` to test against HTML content in 'Bootstrapping your App'" recipes#Server-Communication %}
{% endnote %}

### Properties that are functions are invoked

In the example below, we use `.invoke()` to force a hidden div to be `'display: block'` so we can interact with its children elements.

```javascript
cy.get('div.container').should('be.hidden') // element is hidden
  .invoke('show') // call jquery method 'show' on the '.container'
  .should('be.visible') // element is visible now
  .find('input') // drill down into a child "input" element
  .type('Cypress is great') // and type text
```

### Use `.invoke('show')` and `.invoke('trigger')`

{% note info %}
{% url "Check out our example recipe where we use `cy.invoke('show')` and `cy.invoke('trigger')` to click an element that is only visible on hover" recipes#Testing-the-DOM %}
{% endnote %}

## Function with Arguments

### Send specific arguments to the function

```javascript
const fn = (a, b, c) => {
  return a + b + c
}

cy
  .wrap({ sum: fn })
  .invoke('sum', 2, 4, 6)
    .should('be.gt', 10) // true
    .and('be.lt', 20)    // true
```

### Use `cy.invoke('removeAttr', 'target')` to get around new tab

{% note info %}
{% url "Check out our example recipe where we use `cy.invoke('removeAttr', 'target')` to test clicking on a link without opening in a new tab" recipes#Testing-the-DOM %}
{% endnote %}

### Arguments are automatically forwarded to the function

```javascript
cy
  .get('img').invoke('attr', 'src')
    .should('include', 'myLogo')
```

## Arrays

In the above examples, the subject was an object, but `cy.invoke` also works on arrays and allows using numerical index to pick a function to run.

```javascript
const reverse = (s) => Cypress._.reverse(s)
const double = (n) => n * n

// picks function with index 1 and calls it with argument 4
cy.wrap([reverse, double]).invoke(1, 4).should('eq', 16)
```

## Invoking an async function

In this example we have a little text input field and we invoke an async action which will disable this input field.
`.invoke()` will then wait until the Promise resolves and only then will continue executing to check if it really has been disabled.

Our input field
```html
<input type="text" name="text" data-cy="my-text-input">
```

The Cypress Test with `cy.invoke()` awaiting the promise:
```javascript
function disableElementAsync (element) {
  return new Promise((resolve) => {
    setTimeout(() => {
      element.disabled = true
      resolve()
    }, 3000)
  })
}

cy.get('[data-cy=my-text-input]').then((textElements) => {
  cy.wrap({ disableElementAsync })
    .invoke('disableElementAsync', textElements[0])
})

// log message appears after 3 seconds
cy.log('after invoke')

// assert UI
cy.get('[data-cy=my-text-input]').should('be.disabled')
```

{% note info %}
For a full example where invoke is used to await async Vuex store actions, visit the recipe: {% url "Vue + Vuex + REST" https://github.com/cypress-io/cypress-example-recipes %}
{% endnote %}

# Notes

## Third Party Plugins

### Using a Kendo DropDown

If you are using `jQuery` then the `jQuery` wrapped elements will automatically have your 3rd party plugins available to be called.

```javascript
cy.get('input').invoke('getKendoDropDownList').then((dropDownList) => {
  // yields the return of $input.getKendoDropDownList()
  return dropDownList.select('apples')
})
```

We can rewrite the previous example in a more terse way and add an assertion.

```javascript
cy
  .get('input')
  .invoke('getKendoDropDownList')
  .invoke('select', 'apples')
  .invoke('val').should('match', /apples/)
```

## Retries

`.invoke()` automatically retries invoking the specified method until the returned value satisfies the attached assertions. The example below passes after 1 second.

```javascript
let message = 'hello'
const english = {
  greeting () {
    return message
  }
}

setTimeout(() => {
  message = 'bye'
}, 1000)

// initially the english.greeting() returns "hello" failing the assertion.
// .invoke('greeting') tries again and again until after 1 second
// the returned message becomes "bye" and the assertion passes
cy.wrap(english).invoke('greeting').should('equal', 'bye')
```

{% imgTag /img/api/invoke/invoke-retries.gif "Invoke retries example" width-600 %}

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .invoke %}

## Assertions {% helper_icon assertions %}

{% assertions invoke .invoke %}

## Timeouts {% helper_icon timeout %}

{% timeouts invoke .invoke %}

# Command Log

***Invoke jQuery show method on element***

```javascript
cy.get('.connectors-div').should('be.hidden')
  .invoke('show').should('be.visible')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/invoke/invoke-jquery-show-on-element-for-testing.png "Command Log for invoke" %}

When clicking on `invoke` within the command log, the console outputs the following:

{% imgTag /img/api/invoke/log-function-invoked-and-return.png "Console Log for invoke" %}

{% history %}
{% url "3.8.0" changelog#3-8-0 %} | Added support for `options` argument
{% url "3.7.0" changelog#3-7-0 %} | Added support for arguments of type Number for `functionName`
{% endhistory %}

# See also

- {% url `.its()` its %}
- {% url `.then()` then %}
- {% url `cy.wrap()` wrap %}
