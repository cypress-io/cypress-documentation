---
title: type
---

Type into a DOM element.

## Syntax

```javascript
.type(text)
.type(text, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('input').type('Hello, World') // Type 'Hello, World' into the 'input'
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.type('Welcome') // Errors, cannot be chained off 'cy'
cy.clock().type('www.cypress.io') // Errors, 'clock' does not yield DOM elements
```

### Arguments

**<Icon name="angle-right"></Icon> text** **_(String)_**

The text to be typed into the DOM element.

Text passed to `.type()` may include any of the special character sequences
below. These characters will pass along the correct `keyCode`, `key`, and
`which` codes to any events issued during `.type()`. Some of the special
character sequences may perform actions during typing such as `{movetoend}`,
`{movetostart}`, or `{selectall}`.

<Alert type="info">

To disable parsing special characters sequences, set the
`parseSpecialCharSequences` option to `false`.

</Alert>

| Sequence        | Notes                                            |
| --------------- | ------------------------------------------------ |
| `{{}`           | Types the literal `{` key                        |
| `{backspace}`   | Deletes character to the left of the cursor      |
| `{del}`         | Deletes character to the right of the cursor     |
| `{downarrow}`   | Moves cursor down                                |
| `{end}`         | Moves cursor to the end of the line              |
| `{enter}`       | Types the Enter key                              |
| `{esc}`         | Types the Escape key                             |
| `{home}`        | Moves cursor to the start of the line            |
| `{insert}`      | Inserts character to the right of the cursor     |
| `{leftarrow}`   | Moves cursor left                                |
| `{movetoend}`   | Moves cursor to end of typeable element          |
| `{movetostart}` | Moves cursor to the start of typeable element    |
| `{pagedown}`    | Scrolls down                                     |
| `{pageup}`      | Scrolls up                                       |
| `{rightarrow}`  | Moves cursor right                               |
| `{selectall}`   | Selects all text by creating a `selection range` |
| `{uparrow}`     | Moves cursor up                                  |

Text passed to `.type()` may also include any of these modifier character
sequences:

| Sequence  | Notes                                                           |
| --------- | --------------------------------------------------------------- |
| `{alt}`   | Activates the `altKey` modifier. Aliases: `{option}`            |
| `{ctrl}`  | Activates the `ctrlKey` modifier. Aliases: `{control}`          |
| `{meta}`  | Activates the `metaKey` modifier. Aliases: `{command}`, `{cmd}` |
| `{shift}` | Activates the `shiftKey` modifier.                              |

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.type()`.

| Option                       | Default                                                                        | Description                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations).  |
| `delay`                      | `10`                                                                           | Delay after each keypress                                                                                                                          |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions)                                                                               |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log)                                                           |
| `parseSpecialCharSequences`  | `true`                                                                         | Parse special characters for strings surrounded by `{}`, such as `{esc}`. Set to `false` to type the literal characters instead                    |
| `release`                    | `true`                                                                         | Keep a modifier activated between commands                                                                                                         |
| `scrollBehavior`             | [`scrollBehavior`](/guides/references/configuration#Actionability)             | Viewport position to where an element [should be scrolled](/guides/core-concepts/interacting-with-elements#Scrolling) before executing the command |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.type()` to resolve before [timing out](#Timeouts)                                                                               |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.type()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### Input/Textarea

#### Type into a textarea.

```javascript
cy.get('textarea').type('Hello world') // yields <textarea>
```

#### Type into a login form

<Alert type="info">

[Check out our example recipe of logging in by typing username and password in HTML web forms](/examples/examples/recipes#Logging-In)

</Alert>

#### Mimic user typing behavior

Each keypress is delayed 10ms by default in order to simulate how a very fast
user types!

```javascript
cy.get('[contenteditable]').type('some text!')
```

#### 'Selecting' an option from datalist

For 'selecting' an option, just type it into the input.

```html
<input list="fruit" />
<datalist id="fruit">
  <option>Apple</option>
  <option>Banana</option>
  <option>Cantaloupe</option>
</datalist>
```

```javascript
cy.get('input').type('Apple')
```

### Tabindex

#### Type into a non-input or non-textarea element with `tabindex`

```html
<body>
  <div id="el" tabindex="1">This div can receive focus!</div>
</body>
```

```javascript
cy.get('#el').type('supercalifragilisticexpialidocious')
```

### Date Inputs

Using `.type()` on a date input (`<input type="date">`) requires specifying a
valid date in the format:

- `yyyy-MM-dd` (e.g. `1999-12-31`)

This isn't exactly how a user would type into a date input, but is a workaround
since date input support varies between browsers and the format varies based on
locale. `yyyy-MM-dd` is the format required by
[the W3 spec](https://www.w3.org/TR/html/infrastructure.html#dates-and-times)
and is what the input's `value` will be set to regardless of browser or locale.

Special characters (`{leftarrow}`, `{selectall}`, etc.) are not permitted.

### Month Inputs

Using `.type()` on a month input (`<input type="month">`) requires specifying a
valid month in the format:

- `yyyy-MM` (e.g. `1999-12`)

This isn't exactly how a user would type into a month input, but is a workaround
since month input support varies between browsers and the format varies based on
locale. `yyyy-MM` is the format required by
[the W3 spec](https://www.w3.org/TR/html/infrastructure.html#months) and is what
the input's `value` will be set to regardless of browser or locale.

Special characters (`{leftarrow}`, `{selectall}`, etc.) are not permitted.

### Week Inputs

Using `.type()` on a week input (`<input type="week">`) requires specifying a
valid week in the format:

- `yyyy-Www` (e.g. `1999-W23`)

Where `W` is the literal character 'W' and `ww` is the number of the week
(01-53).

This isn't exactly how a user would type into a week input, but is a workaround
since week input support varies between browsers and the format varies based on
locale. `yyyy-Www` is the format required by
[the W3 spec](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-week-string)
and is what the input's `value` will be set to regardless of browser or locale.

Special characters (`{leftarrow}`, `{selectall}`, etc.) are not permitted.

### Time Inputs

Using `.type()` on a time input (`<input type="time">`) requires specifying a
valid time in the format:

- `HH:mm` (e.g. `01:30` or `23:15`)
- `HH:mm:ss` (e.g. `10:00:30`)
- `HH:mm:ss.SSS` (e.g. `12:00:00.384`)

Where `HH` is 00-23, `mm` is 00-59, `ss` is 00-59, and `SSS` is 000-999.

Special characters (`{leftarrow}`, `{selectall}`, etc.) are not permitted.

### Key Combinations

When using special character sequences, it's possible to activate modifier keys
and type key combinations, such as `CTRL+R` or `SHIFT+ALT+b`. Single key
combinations can be specified with `{modifier+key}` syntax.

A `keydown` event is fired when a modifier is activated and a `keyup` event is
fired when it is released.

<Alert type="info">

You can also use key combinations during
[.click()](/api/commands/click#Click-with-key-combinations),
[.rightclick()](/api/commands/rightclick#Right-click-with-key-combinations) and
[.dblclick()](/api/commands/dblclick#Double-click-with-key-combinations) through
their options. See each doc for more information.

</Alert>

#### Type a key combination

```javascript
// This is the same as a user holding down SHIFT and ALT, then pressing b
// The modifiers are released before typing 'hello'
cy.get('input').type('{shift+alt+b}hello')
```

When a modifier is specified on its own, it will remain activated for the
duration of the `.type()` command, and is released when all subsequent
characters are typed. However, [{release: false}](#Options) can be passed as an
[option](#Key-Combinations).

```javascript
// This is the same as a user holding down SHIFT and ALT, then typing 'hello'
// The modifiers are held for the duration of the command.
cy.get('input').type('{shift}{alt}hello')
```

#### Type literal `{` or `}` characters

To disable parsing special characters sequences, set the
`parseSpecialCharSequences` option to `false`.

```js
cy.get('#code-input')
  // will not escape { } characters
  .type('function (num) {return num * num;}', {
    parseSpecialCharSequences: false,
  })
```

#### Hold down modifier key and type a word

```javascript
// all characters after {ctrl} will have 'ctrlKey'
// set to 'true' on their key events
cy.get('input').type('{ctrl}test')
```

#### Release behavior

By default, modifiers are released after each type command.

```javascript
// 'ctrlKey' will be true for each event while 'test' is typed
// but false while 'everything' is typed
cy.get('input').type('{ctrl}test').type('everything')
```

To keep a modifier activated between commands, specify `{release: false}` in the
options.

```javascript
// 'altKey' will be true while typing 'foo'
cy.get('input').type('{alt}foo', { release: false })
// 'altKey' will also be true during 'get' and 'click' commands
cy.get('button').click()
```

Modifiers are automatically released between tests, even with
`{release: false}`.

```javascript
it('has modifiers activated', () => {
  // 'altKey' will be true while typing 'foo'
  cy.get('input').type('{alt}foo', { release: false })
})

it('does not have modifiers activated', () => {
  // 'altKey' will be false while typing 'bar'
  cy.get('input').type('bar')
})
```

To manually release modifiers within a test after using `{release: false}`, use
another `type` command and the modifier will be released after it.

```javascript
// 'altKey' will be true while typing 'foo'
cy.get('input').type('{alt}foo', { release: false })
// 'altKey' will be true during the 'get' and 'click' commands
cy.get('button').click()
// 'altKey' will be released after this command
cy.get('input').type('{alt}')
// 'altKey' will be false during the 'get' and 'click' commands
cy.get('button').click()
```

### Global Shortcuts

`.type()` requires a focusable element as the subject, since it's usually
intended to type into something that's an input or textarea. Although there
_are_ a few cases where it's valid to "type" into something other than an input
or textarea:

- Keyboard shortcuts where the listener is on the `document` or `body`.
- Holding modifier keys and clicking an arbitrary element.

To support this, the `body` can be used as the DOM element to type into (even
though it's _not_ a focusable element).

#### Use keyboard shortcuts in body

```javascript
// all of the type events are fired on the body
cy.get('body').type(
  '{uparrow}{uparrow}{downarrow}{downarrow}{leftarrow}{rightarrow}{leftarrow}{rightarrow}ba'
)
```

#### Do a shift + click

```javascript
// execute a SHIFT + click on the first <li>
// {release: false} is necessary so that
// SHIFT will not be released after the type command
cy.get('body').type('{shift}', { release: false }).get('li:first').click()
```

### Options

#### Force typing regardless of its actionable state

Forcing typing overrides the
[actionable checks](/guides/core-concepts/interacting-with-elements#Forcing)
Cypress applies and will automatically fire the events.

```javascript
cy.get('input[type=text]').type('Test all the things', { force: true })
```

## Notes

### Supported Elements

- ^HTML `<body>` and `<textarea>` elements.
- Elements with a defined `tabindex` attribute.
- Elements with a defined `contenteditable` attribute.
- ^HTML `<input>` elements with a defined `type` attribute of one of the
  following:
  - `text`
  - `password`
  - `email`
  - `number`
  - `date`
  - `week`
  - `month`
  - `time`
  - `datetime-local`
  - `search`
  - `url`
  - `tel`

### Actionability

`.type()` is an "action command" that follows all the rules of
[Actionability](/guides/core-concepts/interacting-with-elements).

### Events

#### When element is not in focus

If the element is currently not in focus, before issuing any keystrokes Cypress
will first issue a [`.click()`](/api/commands/click) to the element to bring it
into focus.

#### Events that fire

Once the element is in focus, Cypress will begin firing keyboard events.

The following events will be fired based on what key was pressed identical to
the event spec:

- `keydown`
- `keypress`
- `beforeinput`
- `textInput`
- `input`
- `keyup`

Additionally `change` events will be fired either when the `{enter}` key is
pressed (and the value has changed since the last focus event), or whenever the
element loses focus. This matches browser behavior.

Events that should not fire on non input types such as elements with `tabindex`
do not fire their `textInput` or `input` events. Only typing into elements which
cause the actual value or text to change will fire those events.

#### Event Firing

The following rules have been implemented that match real browser behavior (and
the spec):

1. Cypress respects not firing subsequent events if previous ones were canceled.
2. Cypress will fire `keypress` _only_ if that key is supposed to actually fire
   `keypress`.
3. Cypress will fire `textInput` _only_ if typing that key would have inserted
   an actual character.
4. Cypress will fire `input` _only_ if typing that key modifies or changes the
   value of the element.

#### Event Cancellation

Cypress respects all default browser behavior when events are canceled.

```javascript
// prevent the characters from being inserted
// by canceling keydown, keypress, or textInput
$('#username').on('keydown', (e) => {
  e.preventDefault()
})

// Cypress will not insert any characters if keydown, keypress, or textInput
// are cancelled - which matches the default browser behavior
cy.get('#username').type('bob@gmail.com').should('have.value', '') // true
```

#### Preventing `mousedown` does not prevent typing

In a real browser, preventing `mousedown` on a form field will prevent it from
receiving focus and thus prevent it from being able to be typed into. Currently,
Cypress does not factor this in.
[open an issue](https://github.com/cypress-io/cypress/issues/new/choose) if you
need this to be fixed.

#### Key Events Table

Cypress prints out a table of key events that detail the keys that were pressed
when clicking on type within the [Command Log](#Command-Log). Each character
will contain the `which` character code and the events that happened as a result
of that key press.

Events that were `defaultPrevented` may prevent other events from firing and
those will show up as empty. For instance, canceling `keydown` will not fire
`keypress` or `textInput` or `input`, but will fire `keyup` (which matches the
spec).

Additionally, events that cause a `change` event to fire (such as typing
`{enter}`) will display with the `change` event column as `true`.

Any modifiers activated for the event are also listed in a `modifiers` column.

<DocsImage src="/img/api/type/key-events-table-shown-in-console-for-testing-typing.png" alt="Cypress .type() key events table" ></DocsImage>

### Tabbing

#### Typing `tab` key does not work

In the meantime, you can use the experimental
[cypress-plugin-tab](https://github.com/Bkucera/cypress-plugin-tab) and can
thumbs up [this issue](https://github.com/cypress-io/cypress/issues/299).

### Modifiers

#### Modifier effects

In a real browser, if a user holds `SHIFT` and types `a`, a capital `A` will be
typed into the input. Currently, Cypress does not simulate that behavior.

Modifiers are simulated by setting their corresponding values to `true` for key
and click events. So, for example, activating the `{shift}` modifier will set
`event.shiftKey` to true for any key events, such as `keydown`.

```javascript
// app code
document.querySelector('input:first').addEventListener('keydown', (e) => {
  // e.shiftKey will be true
})

// in test
cy.get('input:first').type('{shift}a')
```

In the example above, a lowercase `a` will be typed, because that's the literal
character specified. To type a capital `A`, you can use `.type('{shift}A')` (or
`.type('A')` if you don't care about the `shiftKey` property on any key events).

This holds true for other special key combinations as well (that may be
OS-specific). For example, on OSX, typing `ALT + SHIFT + K` creates the special
character ``. Like with capitalization, `.type()` will not output ``, but the
letter `k`.

Similarly, modifiers will not affect arrow keys or deletion keys. For example
`{ctrl}{backspace}` will not delete an entire word.
[open an issue](https://github.com/cypress-io/cypress/issues/new) if you need
modifier effects to be implemented.

### Form Submission

#### Implicit form submission behavior

Cypress automatically matches the spec and browser behavior for pressing the
`{enter}` key when the input belongs to a `<form>`.

This behavior is defined here:
[Form Implicit Submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission).

For instance the following will submit the form.

```html
<form action="/login">
  <input id="username" />
  <input id="password" />
  <button type="submit">Log In</button>
</form>
```

```javascript
cy.get('#username').type('bob@burgers.com')
cy.get('#password').type('password123{enter}')
```

Because there are multiple `inputs` and one `submit` button, Cypress submits the
form (and fires submit events) as well as a synthetic `click` event to the
`button`.

The spec defines the "submit" button as the first `input[type=submit]` or
`button[type!=button]` from the form.

Additionally Cypress handles these 4 other situations as defined in the spec:

1. Does not submit a form if there are multiple inputs and no `submit` button.
2. Does not submit a form if the `submit` button is disabled.
3. Submits a form, but does not fire synthetic `click` event, if there is 1
   `input` and no `submit` button
4. Submits form and fires a synthetic `click` event to the `submit` when it
   exists.

If the form's `submit` event is `preventedDefault` the form will not actually be
submitted.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.type()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.type()` will automatically wait for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.type()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.type()` can time out waiting for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.type()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**Type into the input**

```javascript
cy.get('input[name=firstName]').type('Jane Lane')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/type/type-in-input-shown-in-command-log.png" alt="Command Log type" ></DocsImage>

When clicking on `type` within the command log, the console outputs the
following:

<DocsImage src="/img/api/type/console-log-of-typing-with-entire-key-events-table-for-each-character.png" alt="Console Log type" ></DocsImage>

## History

| Version                                       | Changes                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [6.1.0](/guides/references/changelog#6-1-0)   | Added option `scrollBehavior`                                                                                             |
| [5.6.0](/guides/references/changelog#5.6.0)   | Support single key combination syntax                                                                                     |
| [5.5.0](/guides/references/changelog#5.5.0)   | Support `beforeinput` event                                                                                               |
| [3.4.1](/guides/references/changelog#3-4-1)   | Added `parseSpecialCharSequences` option                                                                                  |
| [3.3.0](/guides/references/changelog#3-3-0)   | Added `{insert}`, `{pageup}` and `{pagedown}` character sequences                                                         |
| [3.2.0](/guides/references/changelog#3-2-0)   | Added `{home}` and `{end}` character sequences                                                                            |
| [0.20.0](/guides/references/changelog#0-20-0) | Supports for typing in inputs of type `date`, `time`, `month`, and `week`                                                 |
| [0.17.1](/guides/references/changelog#0-17-1) | Added `ctrl`, `cmd`, `shift`, and `alt` keyboard modifiers                                                                |
| [0.16.3](/guides/references/changelog#0-16-3) | Supports for typing in elements with `tabindex` attribute                                                                 |
| [0.16.2](/guides/references/changelog#0-16-2) | Added `{downarrow}` and `{uparrow}` character sequences                                                                   |
| [0.8.0](/guides/references/changelog#0-8-0)   | Outputs Key Events Table to console on click                                                                              |
| [0.8.0](/guides/references/changelog#0-8-0)   | Added `{selectall}`, `{del}`, `{backspace}`, `{esc}`, `{{}`, `{enter}`, `{leftarrow}`, `{rightarrow}` character sequences |
| [0.8.0](/guides/references/changelog#0-8-0)   | Added small delay (10ms) between each keystroke during `cy.type()`                                                        |
| [0.6.12](/guides/references/changelog#0-6-12) | Added option `force`                                                                                                      |

## See also

- [`.blur()`](/api/commands/blur)
- [`.clear()`](/api/commands/clear)
- [`.click()`](/api/commands/click)
- [`.focus()`](/api/commands/focus)
- [`.submit()`](/api/commands/submit)
- [`Cypress.Keyboard`](/api/cypress-api/keyboard-api)
