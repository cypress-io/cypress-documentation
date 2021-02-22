---
title: writeFile
---

Write to a file with the specified contents.

# Syntax

```javascript
cy.writeFile(filePath, contents)
cy.writeFile(filePath, contents, encoding)
cy.writeFile(filePath, contents, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.writeFile('menu.json')
```

## Arguments

**{% fa fa-angle-right %} filePath** ***(String)***

A path to a file within the project root (the directory that contains the default `cypress.json`).

**{% fa fa-angle-right %} contents** ***(String, Array, or Object)***

The contents to be written to the file.

**{% fa fa-angle-right %} encoding**  ***(String)***

The encoding to be used when writing to the file. The following encodings are supported:

* `ascii`
* `base64`
* `binary`
* `hex`
* `latin1`
* `utf8`
* `utf-8`
* `ucs2`
* `ucs-2`
* `utf16le`
* `utf-16le`

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `cy.writeFile()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`flag` | `w` | File system flag as used with {% url `fs.writeFile` https://nodejs.org/api/fs.html#fs_file_system_flags %}
`encoding` | `utf8` | The encoding to be used when writing to the file

{% note info %}
To use encoding with other options, have your options object be your third parameter and include encoding there. This is the same behavior as {% url `fs.writeFile` https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback %}.
{% endnote %}

## Yields {% helper_icon yields %}

{% yields sets_subject cy.writeFile 'yields the value of the <code>contents</code> argument' %}

# Examples

## Text

### Write some text to a `txt` file

If the path to the file does not exist, the file and its path will be created. If the file already exists, it will be over-written.

```javascript
cy.writeFile('path/to/message.txt', 'Hello World')
cy.readFile('path/to/message.txt').then((text) => {
  expect(text).to.equal('Hello World') // true
})
```

`{projectRoot}/path/to/message.txt` will be created with the following contents:

```text
 "Hello World"
```

## JSON

### Write JSON to a file

JavaScript arrays and objects are stringified and formatted into text.

```javascript
cy.writeFile('path/to/data.json', { name: 'Eliza', email: 'eliza@example.com' })
cy.readFile('path/to/data.json').then((user) => {
  expect(user.name).to.equal('Eliza') // true
})
```

`{projectRoot}/path/to/data.json` will be created with the following contents:

```json
{
  "name": "Eliza",
  "email": "eliza@example.com"
}
```

### Write response data to a fixture file

```javascript
cy.request('https://jsonplaceholder.typicode.com/users').then((response) => {
  cy.writeFile('cypress/fixtures/users.json', response.body)
})

// our fixture file is now generated and can be used
cy.fixture('users').then((users) => {
  expect(users[0].name).to.exist
})
```

## Encoding

### Specify the encoding as a String

```javascript
cy.writeFile('path/to/ascii.txt', 'Hello World', 'ascii'))
```

`{projectRoot}/path/to/message.txt` will be created with the following contents:

```text
Hello World
```

### Specify the encoding as part of the options object

```javascript
cy.writeFile('path/to/ascii.txt', 'Hello World', { encoding: 'ascii', flag: 'a+' })
```

## Flags

### Append contents to the end of a file

```javascript
cy.writeFile('path/to/message.txt', 'Hello World', { flag: 'a+' })
```

Note that appending assumes plain text file. If you want to merge a JSON object for example, you need to read it first, add new properties, then write the combined result back.

```javascript
const filename = '/path/to/file.json'

cy.readFile(filename).then((obj) => {
  obj.id = '1234'
  // write the merged object
  cy.writeFile(filename, obj)
})
```

Similarly, if you need to push new items to an array

```javascript
const filename = '/path/to/list.json'

cy.readFile(filename).then((list) => {
  list.push({ item: 'example' })
  // write the merged array
  cy.writeFile(filename, list)
})
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements write_file cy.writeFile %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.writeFile %}

## Timeouts {% helper_icon timeout %}

{% timeouts automation cy.writeFile %}

# Command Log

***Write an array to a file***

```javascript
cy.writeFile('info.log', ['foo', 'bar', 'baz'])
```

The command above will display in the Command Log as:

{% imgTag /img/api/writefile/write-data-to-system-file-for-testing.png "Command Log writeFile" %}

When clicking on the `writeFile` command within the command log, the console outputs the following:

{% imgTag /img/api/writefile/console-log-shows-contents-written-to-file.png "Console Log writeFile" %}

{% history %}
{% url "4.0.0" changelog#4-0-0 %} | `cy.writeFile()` now yields `null` instead of `contents`
{% url "3.1.1" changelog#3-1-1 %} | Added `flag` option and appending with `a+`
{% url "1.0.0" changelog#1.0.0 %} | `cy.writeFile()` command added
{% endhistory %}

# See also

- {% url `cy.readFile()` readfile %}
