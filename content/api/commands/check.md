---
title: check
---

Check checkbox(es) or radio(s).

<Alert type="warning">

This element must be an `<input>` with type `checkbox` or `radio`.

</Alert>

## Syntax

```javascript
.check()
.check(value)
.check(values)
.check(options)
.check(value, options)
.check(values, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('[type="checkbox"]').check() // Check checkbox element
cy.get('[type="radio"]').first().check() // Check first radio element
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.check('[type="checkbox"]') // Errors, cannot be chained off 'cy'
cy.get('p:first').check() // Errors, '.get()' does not yield checkbox or radio
```

### Arguments

**<Icon name="angle-right"></Icon> value** **_(String)_**

Value of checkbox or radio that should be checked.

**<Icon name="angle-right"></Icon> values** **_(Array)_**

Values of checkboxes or radios that should be checked.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.check()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                           |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.check()` to resolve before [timing out](#Timeouts)                                                                              |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.check()` yields the same subject it was given from the previous command.</li></List>

## Examples

### No Args

#### Check all checkboxes

```javascript
cy.get('[type="checkbox"]').check()
```

#### Select all radios

```javascript
cy.get('[type="radio"]').check()
```

#### Check the element with id of 'saveUserName'

```javascript
cy.get('#saveUserName').check()
```

### Value

#### Select the radio with the value of 'US'

```html
<form>
  <input type="radio" id="ca-country" value="CA" />
  <label for="ca-country">Canada</label>
  <input type="radio" id="us-country" value="US" />
  <label for="us-country">United States</label>
</form>
```

```javascript
cy.get('[type="radio"]').check('US')
```

### Values

#### Check the checkboxes with the values 'subscribe' and 'accept'

```html
<form>
  <input type="checkbox" id="subscribe" value="subscribe" />
  <label for="subscribe">Subscribe to newsletter?</label>
  <input type="checkbox" id="acceptTerms" value="accept" />
  <label for="acceptTerms">Accept terms and conditions.</label>
</form>
```

```javascript
cy.get('form input').check(['subscribe', 'accept'])
```

### Options

#### Check an invisible checkbox

You can ignore Cypress' default behavior of checking that the element is visible, clickable and not disabled by setting `force` to `true` in the options.

```javascript
cy.get('.action-checkboxes')
  .should('not.be.visible') // Passes
  .check({ force: true })
  .should('be.checked') // Passes
```

## Notes

### Actionability

#### The element must first reach actionability

`.check()` is an "action command" that follows all the rules [defined here](/guides/core-concepts/interacting-with-elements).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.check()` requires being chained off a command that yields DOM element(s).</li><li>`.check()` requires the element to have type `checkbox` or `radio`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.check()` will automatically wait for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.check()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.check()` can time out waiting for the element to reach an [actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.check()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_check the element with name of 'emailUser'_**

```javascript
cy.get('form').find('[name="emailUser"]').check()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/check/check-checkbox-in-cypress.png" alt="Command log for check" ></DocsImage>

When clicking on `check` within the command log, the console outputs the following:

<DocsImage src="/img/api/check/console-showing-events-on-check.png" alt="console.log for check" ></DocsImage>

## See also

- [`.click()`](/api/commands/click)
- [`.uncheck()`](/api/commands/uncheck)
