---
title: attachFile
---

Attaches a file or files to an HTML5 input element or simulates dragging a file or files into the browser.

## Syntax

```javascript
.attachFile(file)
.attachFile(file, options)
.attachFile([file1, file2, ...])
.attachFile([file1, file2, ...], options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('input[type=file]').attachFile('file.json')
cy.get('input[type=file]').attachFile(['file.json', 'file2.json'])
cy.get('input[type=file]').attachFile({
  contents: Buffer.from('foo'),
  fileName: 'file.json',
  lastModified: Date.now(),
})
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
// Errors, cannot be chained off 'cy'
cy.attachFile('file.json')

// Will attempt to find a file called 'file contents'
// on disk, probably not what you intended
cy.get('input[type=file]').attachFile('file contents')
```

### Arguments

**<Icon name="angle-right"></Icon> file** **_(String, Array, Object or Buffer)_**

Either a single file, or an array of files. A file can be:

- A path to a file within the project root (the directory that contains the default Cypress configuration file). Eg: `'path/to/file.json'`
- `@alias` - An alias of any type, previously stored using `.as()`. Eg: `'@alias'`
- A `Buffer()` containing binary data, such as that returned by `cy.readFile('file.json', { encoding: null })`. Eg: `Buffer.from('foo')`
- An object with a non-null `contents` property, specifying details about the file. Eg: `{contents: '@alias', fileName: 'file.json'}`

If an object is provided, it can have the following properties.

| Option         | Description                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `contents`     | The contents of the file. This can be a string shorthand as described above, a `Buffer()` containing binary data or a non-Buffer object, which will be converted into a string with `JSON.stringify()` and `utf8` encoded.                           |
| `fileName`     | The name of the file. If `contents` is a path on disk, this defaults to the actual filename. In any other case, this defaults to an empty string.                                                                                                  |
| `lastModified` | The file's last modified timestamp, in milliseconds elapsed since the UNIX epoch (eg. [`Date.prototype.getTime()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)). This defaults to `Date.now()`. |

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.attachFile()`.

| Option              | Default                                                               | Description                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`            | `'input'`                                                             | Switches attachFile between modes. Valid values are `input` and `drag-n-drop`. See [Actions](#Actions) below for more details.                                      |
| `animationDistanceThreshold` | [`animationDistanceThreshold`](/guides/references/configuration#Actionability) | The distance in pixels an element must exceed over time to be [considered animating](/guides/core-concepts/interacting-with-elements#Animations). |
| `force`             | `false`                                                               | Forces the action, disables [waiting for actionability](#Assertions).                                                                                               |
| `log`               | `true`                                                                | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log).                                                                           |
| `timeout`           | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)  | Time to wait for `.attachFile()` to resolve before [timing out](#Timeouts).                                                                                               |
| `waitForAnimations` | [`waitForAnimations`](/guides/references/configuration#Actionability) | Whether to wait for elements to [finish animating](/guides/core-concepts/interacting-with-elements#Animations) before executing the command.                        |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.attachFile()` yields the same subject it was given from the previous command.</li></List>

### Action

Depending on the `action` set in the `options` argument, `.attachFile()` can simulate two different user behaviors:

#### `input` (default)

By default, `attachFile()` runs in 'input' mode, mimicking a user selecting one or more files on an HTML5 input element. In this mode, the [subject](/guides/core-concepts/introduction-to-cypress#Subject-Management) must be a single `input` element with `type="file"`, or a `label` element connected to an input (either with its `for` attribute or by containing the input).

#### `drag-n-drop`

Setting the action to `drag-n-drop` changes the behavior of the command to instead mimic a user dragging files from the operating system into the browser, and dropping them over the selected subject. In this mode, the subject can be any DOM element or the `document` as a whole.

## Examples

### From a file on disk

```javascript
cy.get('input[type=file]').attachFile('path/to/file.json')
cy.get('input[type=file]').attachFile('path/to/file.png')
```

If given a path, `.attachFile()` will search for the file relative to the project root and attach the file exactly as it exists on disk. This is the preferred way to work with files on disk, avoiding many encoding-related pitfalls.

### On a hidden input

```javascript
cy.get('input[type=file]').attachFile('file.json', { force: true })
```

In many cases in modern applications, the underlying file input is hidden from view, and activated by a user clicking on a button. In these cases, you will need to tell Cypress to ignore its actionability checks and attach the file even though a user would not be able to directly activate the file input.

### From a fixture
```javascript
cy.fixture('file.json', { encoding: null }).as('myFixture')
cy.get('input[type=file]').attachFile('@myFixture')
```

Note the use of `null` encoding. By default, `cy.fixture()` and `cy.readFile()` attempt to interpret files read from disk, which would result in a JSON file being decoded and re-encoded as a utf-8 string - the contents would be preserved, but formatting would not be and the encoding might change. See [`cy.fixture`](/api/commands/fixture) or [`cy.readFile`](/api/commands/readfile) for more details on file encoding.

### From an API response

```javascript
cy.request('http://localhost:8888/users/827')
  .its('body')
  .as('responseBody')

cy.get('input[type=file]').attachFile('@responseBody')
```

### Processing data inside the test

```javascript
cy.readFile('users.json').then((users => {
  users[0].username = 'JohnCena'
})).as('myFile')

cy.get('input[type=file]').attachFile('@myFile')
```

### Attaching multiple files

```javascript
cy.get('input[type=file]').attachFile([
  'file1.json',
  'file2.json',
  'file3.json',
])
```

<Alert type="warning">

This will fail unless the file input has the `multiple` property.

</Alert>

### Attaching a file with custom filename and lastModified

```javascript
cy.get('input[type=file]').attachFile({
  contents: 'path/to/file.json',
  fileName: 'users.json',
  lastModified: new Date('Feb 18 1989').valueOf()
})
```

### Dropping a file on the document

```javascript
cy.document().attachFile('file.json', { action: 'drag-n-drop' })
```

## Notes

### Existence

#### Default file existence assertion

Whenever resolving a file path, `.attachFile()` asserts that the file exists and will fail if it does not exist. It will retry reading the file if it does not initially exist until the file exists or the command times out.

```javascript
// will fail after the defaultCommandTimeout is reached
cy.get('input[type=file]').attachFile('does-not-exist.yaml')
```

### Actionability

#### The element must first reach actionability

`.attachFile()` is an "action command" that follows all the rules
of [Actionability](/guides/core-concepts/interacting-with-elements).

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.attachFile()` requires being chained off a command that yields DOM
element(s). With the `input` action (default), it further requires a single `input` element with `type="file"`, or a `label` element attached to one.</li><li>If given a path, `.attachFile()` requires the file must exist.</li><li>If given an alias, `.attachFile()` requires that the subject of the alias must not be `null` or `undefined`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.attachFile()` will automatically wait for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.attachFile()` can time out waiting for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements).</li><li>
`.attachFile()` can time out waiting for a file to exist on disk or for an
alias to resolve.</li></List>

## Command Log

**_Attach file to input_**

```javascript
cy.get('.file-input').attachFile(Buffer.from('Hello world'))
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/attachfile/attach-file-during-test.png" alt="Command log for attachFile" ></DocsImage>

When clicking on `attachFile` within the command log, the console outputs the
following:

<DocsImage src="/img/api/attachfile/attach-file-in-console.png" alt="console.log for attachFile" ></DocsImage>

## History

| Version                                     | Changes                                                  |
| ------------------------------------------- | -------------------------------------------------------- |
| [10.0.0](/guides/references/changelog#10.0.0) | `.attachFile()` command added                        |

## See also

- [Guide: Variables and Aliases](/guides/core-concepts/variables-and-aliases)
- [`.fixture()`](/api/commands/fixture)
- [`.get()`](/api/commands/get)
- [`.readFile()`](/api/commands/readfile)
