---
title: selectFile
---

Selects a file or files in an HTML5 input element or simulates dragging a file
or files into the browser.

## Syntax

```javascript
.selectFile(file)
.selectFile(file, options)
.selectFile([file1, file2, ...])
.selectFile([file1, file2, ...], options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('input[type=file]').selectFile('file.json')
cy.get('input[type=file]').selectFile(['file.json', 'file2.json'])

cy.get('input[type=file]').selectFile({
  contents: Cypress.Buffer.from('file contents'),
  fileName: 'file.txt',
  mimeType: 'text/plain',
  lastModified: Date.now(),
})

cy.get('input[type=file]').selectFile('file.json', { action: 'drag-drop' })
cy.document().selectFile('file.json', { action: 'drag-drop' })
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
// Errors, cannot be chained off 'cy'
cy.selectFile('file.json')

// Will attempt to find a file called 'file contents'
// on disk, probably not what you intended
cy.get('input[type=file]').selectFile('file contents')
```

### Arguments

**<Icon name="angle-right"></Icon> file** **_(String, Array, Object or
Cypress.Buffer)_**

Either a single file, or an array of files. A file can be:

- A path to a file within the project root (the directory that contains the
  default Cypress configuration file). Eg: `'path/to/file.json'`
- `@alias` - An alias of any type, previously stored using `.as()`. Eg:
  `'@alias'`
- An
  [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
  containing binary data, such as `Uint8Array.from('123')`.
  [`Cypress.Buffer`](/api/utilities/buffer) instances, such as those returned by
  `cy.readFile('file.json', { encoding: null })` or created by
  `Cypress.Buffer.from('foo')` are `TypedArray` instances.
- An object with a non-null `contents` property, specifying details about the
  file. Eg: `{contents: '@alias', fileName: 'file.json'}`

If an object is provided, it can have the following properties.

| Option         | Description                                                                                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents`     | The contents of the file. This can be a string shorthand as described above, a `TypedArray` instance containing binary data (such as a `Cypress.Buffer` instance) or a non-TypedArray object, which will be converted into a string with `JSON.stringify()` and `utf8` encoded. |
| `fileName`     | The name of the file. If `contents` is a path on disk, this defaults to the actual filename. In any other case, this defaults to an empty string.                                                                                                                               |
| `mimeType`     | The [mimeType](https://developer.mozilla.org/en-US/docs/Web/API/File/type) of the file. If omitted, it will be inferred from the file extension. If one cannot be inferred, it will default to an empty string.                                                                 |
| `lastModified` | The file's last modified timestamp, in milliseconds elapsed since the UNIX epoch (eg. [`Date.prototype.getTime()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)). This defaults to `Date.now()`.                              |

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.selectFile()`.

| Option                       | Default                                                                        | Description                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`                     | `'select'`                                                                     | Switches modes. Valid values are `select` and `drag-drop`. See [Actions](#Actions) below for more details.                                        |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations). |
| `force`                      | `false`                                                                        | Forces the action, disables [waiting for actionability](#Assertions).                                                                             |
| `log`                        | `true`                                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log).                                                         |
| `timeout`                    | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)           | Time to wait for `.selectFile()` to resolve before [timing out](#Timeouts).                                                                       |
| `waitForAnimations`          | [`waitForAnimations`](/guides/references/configuration#Actionability)          | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.      |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `.selectFile()` yields the same subject it was given from the previous
  command.

### Action

Depending on the `action` set in the `options` argument, `.selectFile()` can
simulate two different user behaviors:

#### `select` (default)

By default, `.selectFile()` runs in 'select' mode, mimicking a user selecting
one or more files on an HTML5 input element. In this mode, the
[subject](/guides/core-concepts/introduction-to-cypress#Subject-Management) must
be a single `input` element with `type="file"`, or a `label` element connected
to an input (either with its `for` attribute or by containing the input).

#### `drag-drop`

Setting the action to `drag-drop` changes the behavior of the command to instead
mimic a user dragging files from the operating system into the browser, and
dropping them over the selected subject. In this mode, the subject can be any
DOM element or the `document` as a whole.

## Examples

### From a file on disk

```javascript
cy.get('input[type=file]').selectFile('path/to/file.json')
cy.get('input[type=file]').selectFile('path/to/file.png')
```

If given a path, `.selectFile()` will search for the file relative to the
project root and attach the file exactly as it exists on disk. This is the
preferred way to work with files on disk, avoiding many encoding-related
pitfalls.

### On a hidden input

```javascript
cy.get('input[type=file]').selectFile('file.json', { force: true })
```

In many cases in modern applications, the underlying file input is hidden from
view, and activated by a user clicking on a button. In these cases, you will
need to tell Cypress to ignore its actionability checks and select the file even
though a user would not be able to directly activate the file input.

### From a fixture

```javascript
cy.fixture('file.json', { encoding: null }).as('myFixture')
cy.get('input[type=file]').selectFile('@myFixture')
```

Note the use of `null` encoding. By default, `cy.fixture()` and `cy.readFile()`
attempt to interpret files read from disk, which would result in a JSON file
being decoded and re-encoded as a utf-8 string - the contents would be
preserved, but formatting would not be and the encoding might change. See
[`cy.fixture`](/api/commands/fixture) or [`cy.readFile`](/api/commands/readfile)
for more details on file encoding.

### From an API response

```javascript
cy.request('http://localhost:8888/users/827').its('body').as('responseBody')

cy.get('input[type=file]').selectFile('@responseBody')
```

### Processing data inside the test

```javascript
cy.readFile('users.json')
  .then((users) => {
    users[0].username = 'JohnCena'
  })
  .as('myFile')

cy.get('input[type=file]').selectFile('@myFile')
```

### Selecting multiple files

```javascript
cy.get('input[type=file]').selectFile([
  'file1.json',
  'file2.json',
  'file3.json',
])
```

<Alert type="warning">

This will fail unless the file input has the `multiple` property.

</Alert>

### Selecting a file with custom filename, mimeType and lastModified

```javascript
cy.get('input[type=file]').selectFile({
  contents: 'path/to/file.json',
  fileName: 'custom-name.json',
  mimeType: 'text/plain', // Overrides the 'application/json' mimeType detected from the .json extension
  lastModified: new Date('Feb 18 1989').valueOf(),
})
```

### Dropping a file on the document

```javascript
cy.document().selectFile('file.json', { action: 'drag-drop' })
```

## Notes

### Existence

#### Default file existence assertion

Whenever resolving a file path, `.selectFile()` asserts that the file exists and
will fail if it does not exist. It will retry reading the file if it does not
initially exist until the file exists or the command times out.

```javascript
// will fail after the defaultCommandTimeout is reached
cy.get('input[type=file]').selectFile('does-not-exist.yaml')
```

### Actionability

#### The element must first reach actionability

`.selectFile()` is an "action command" that follows all the rules of
[Actionability](/guides/core-concepts/interacting-with-elements).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `.selectFile()` requires being chained off a command that yields DOM
  element(s). With the `input` action (default), it further requires a single
  `input` element with `type="file"`, or a `label` element attached to one.
- If given a path, `.selectFile()` requires the file must exist.
- If given an alias, `.selectFile()` requires that the subject of the alias must
  not be `null` or `undefined`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `.selectFile()` will automatically wait for the element to reach an
  [actionable state](/guides/core-concepts/interacting-with-elements).

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `.selectFile()` can time out waiting for the element to reach an
  [actionable state](/guides/core-concepts/interacting-with-elements).
- `.selectFile()` can time out waiting for a file to exist on disk or for an
  alias to resolve.

## Command Log

**_Select file for input_**

```javascript
cy.get('.file-input').selectFile(Cypress.Buffer.from('Hello world'))
```

<!--
Below screenshots generated from this HTML:

<form>
  <input id="basic" type="file" className="file-input" />
</form>

And this test:

it('should attach a file', () => {
  cy.get('.file-input').selectFile(Cypress.Buffer.from('Hello world'))
})
-->

The commands above will display in the Command Log as:

<DocsImage src="/img/api/selectfile/selectfile-command-log.png" alt="Command log for selectFile" ></DocsImage>

When clicking on `selectFile` within the command log, the console outputs the
following:

<DocsImage src="/img/api/selectfile/selectfile-console.png" alt="console.log for selectFile" ></DocsImage>

## History

| Version                                     | Changes                                                  |
| ------------------------------------------- | -------------------------------------------------------- |
| [9.3.0](/guides/references/changelog#9.3.0) | `.selectFile()` command added                            |
| [9.4.0](/guides/references/changelog#9.4.0) | Support for `TypedArray`s and `mimeType` property added. |

### Community Recognition

The `.selectFile()` command draws heavy inspiration from the now-deprecated
Cypress File Upload plugin. It was made possible by
[@abramenal](https://github.com/abramenal) and contributors to the
[cypress-file-upload](https://github.com/abramenal/cypress-file-upload#contributors)
repository.

## See also

- [Guide: Variables and Aliases](/guides/core-concepts/variables-and-aliases)
- [`.fixture()`](/api/commands/fixture)
- [`.get()`](/api/commands/get)
- [`.readFile()`](/api/commands/readfile)
