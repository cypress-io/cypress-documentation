---
title: readFile
---

Read a file and yield its contents.

## Syntax

```javascript
cy.readFile(filePath)
cy.readFile(filePath, encoding)
cy.readFile(filePath, options)
cy.readFile(filePath, encoding, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.readFile('menu.json')
```

### Arguments

**<Icon name="angle-right"></Icon> filePath** **_(String)_**

A path to a file within the project root (the directory that contains the
[Cypress configuration file](/guides/references/configuration)).

**<Icon name="angle-right"></Icon> encoding** **_(String)_**

The encoding to be used when reading the file. The following encodings are
supported:

- `'ascii'`
- `'base64'`
- `'binary'`
- `'hex'`
- `'latin1'`
- `'utf8'`
- `'utf-8'`
- `'ucs2'`
- `'ucs-2'`
- `'utf16le'`
- `'utf-16le'`
- `null`

Using `null` explicitly will return the file as a `Buffer`, regardless of file
extension.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.readFile()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.readFile()` to resolve before [timing out](#Timeouts)               |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.readFile()` yields the contents of the file.</li></List>

## Examples

### Text

#### Read a `.txt` file

For any file other than JSON, the contents of the file are returned.

```text
// path/to/message.txt

Hello World
```

```javascript
cy.readFile('path/to/message.txt').should('eq', 'Hello World') // true
```

### JSON

For JSON, the contents yielded are parsed into JavaScript and returned.

```javascript
// data.json

{
  "name": "Eliza",
  "email": "eliza@example.com"
}
```

```javascript
cy.readFile('path/to/data.json').its('name').should('eq', 'Eliza') // true
```

### YAML

#### Get translation data from a YAML file

```javascript
const YAML = require('yamljs')

cy.readFile('languages/en.yml').then((str) => {
  // parse the string into object literal
  const english = YAML.parse(str)

  cy.get('#sidebar')
    .find('.sidebar-title')
    .each(($el, i) => {
      englishTitle = english.sidebar[i]

      expect($el.text()).to.eq(englishTitle)
    })
})
```

### Encoding

#### Specify the encoding with the second argument

```javascript
cy.readFile('path/to/logo.png', 'base64').then((logo) => {
  // logo will be encoded as base64
  // and should look something like this:
  // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
})
```

#### Read

```javascript
cy.fixture('path/to/logo.png', null).then((logo) => {
  // logo will be read as a buffer
  // and should look something like this:
  // Buffer([0, 0, ...])
})
```

### Playing MP3 file

```javascript
cy.readFile('audio/sound.mp3', 'base64').then((mp3) => {
  const uri = 'data:audio/mp3;base64,' + mp3
  const audio = new Audio(uri)

  audio.play()
})
```

## Notes

### Existence

#### Default file existence assertion

By default, `cy.readFile()` asserts that the file exists and will fail if it
does not exist. It will retry reading the file if it does not initially exist
until the file exists or the command times out.

```javascript
// will fail after the defaultCommandTimeout is reached
cy.readFile('does-not-exist.yaml')
```

#### Asserting file non-existence

You can assert that a file does not exist like so:

```javascript
// will pass if the file does not exist
cy.readFile('does-not-exist.yaml').should('not.exist')
```

#### Read a file that might not exist

[See our example on using `cy.task()` to read a file that _may_ not exist.](/api/commands/task#Read-a-file-that-might-not-exist)

### Retries

#### Automatic retries

`cy.readFile()` will continue to read the file until it passes all of its
assertions.

```javascript
// if this assertion fails cy.readFile will poll the file
// until it eventually passes its assertions (or times out)
cy.readFile('some/nested/path/story.txt').should('eq', 'Once upon a time...')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.readFile()` requires being chained off of
`cy`.</li><li>`cy.readFile()` requires the file must
exist.</li><li>`cy.readFile()` requires the file be successfully read from
disk.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.readFile()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.readFile()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_List the contents of your package.json file_**

```javascript
cy.readFile('package.json')
```

The command above will display in the Command Log as:

<!-- Code to reproduce screenshot:
  in spec file:
  use cy.readFile('package.json') as shown in the example above
-->

<DocsImage src="/img/api/readfile/readfile-can-get-content-of-system-files-in-tests.png" alt="Command Log readFile" ></DocsImage>

When clicking on the `readFile` command within the command log, the console
outputs the following:

<DocsImage src="/img/api/readfile/console-log-shows-content-from-file-formatted-as-javascript.png" alt="Console Log readFile" ></DocsImage>

## See also

- [`cy.exec()`](/api/commands/exec)
- [`cy.fixture()`](/api/commands/fixture) for a similar command with caching
- [`cy.task()`](/api/commands/task)
- [`cy.writeFile()`](/api/commands/writefile)
