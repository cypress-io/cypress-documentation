---
title: task
---

Execute code in {% url "Node.js" https://nodejs.org %} via the `task` plugin event.

{% note warning 'Anti-Pattern' %}
We do not recommend starting a web server using `cy.task()`. Read about {% url 'best practices' best-practices#Web-Servers %} here.
{% endnote %}

# Syntax

```javascript
cy.task(event)
cy.task(event, arg)
cy.task(event, arg, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
// in test
cy.task('log', 'This will be output to the terminal')
```
```javascript
// in plugins file
on('task', {
  log (message) {
    console.log(message)
    return null
  }
})
```

## Arguments

**{% fa fa-angle-right %} event** ***(String)***

An event name to be handled via the `task` event in the {% url "`pluginsFile`" configuration#Folders-Files %}.

**{% fa fa-angle-right %} arg** ***(Object)***

An argument to send along with the event. This can be any value that can be serialized by {% url "JSON.stringify()" https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify %}. Unserializable types such as functions, regular expressions, or symbols will be omitted to `null`.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.task()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `taskTimeout` configuration#Timeouts %} | {% usage_options timeout cy.task %}

## Yields {% helper_icon yields %}

`cy.task()` yields the value returned or resolved by the `task` event in the {% url "`pluginsFile`" configuration#Folders-Files %}.

# Examples

## Command

`cy.task()` provides an escape hatch for running arbitrary Node code, so you can take actions necessary for your tests outside of the scope of Cypress. This is great for:

- Seeding your test database.
- Storing state in Node that you want persisted between spec files.
- Performing parallel tasks, like making multiple http requests outside of Cypress.
- Running an external process.

In the `task` plugin event, the command will fail if `undefined` is returned. This helps catch typos or cases where the task event is not handled.

If you do not need to return a value, explicitly return `null` to signal that the given event has been handled.

### Read a JSON file's contents

Note: this serves as a demonstration only. We recommend using {% url "`cy.fixture()`" fixture %} or {% url "`cy.readFile()`" readfile %} for a more robust implementation of reading a file in your tests.

```javascript
// in test
cy.task('readJson', 'cypress.json').then((data) => {
  // data equals:
  // {
  //   projectId: '12345',
  //   ...
  // }
})
```

```javascript
// in plugins/index.js file
on('task', {
  readJson: (filename) => {
    // reads the file relative to current working directory
    return fsExtra.readJson(path.join(process.cwd(), filename)
  }
})
```

### Seed a database

```javascript
// in test
describe('e2e', () => {
  beforeEach(() => {
    cy.task('defaults:db')
    cy.visit('/')
  })

  it('displays article values', () => {
    cy.get('.article-list')
      .should('have.length', 10)
  })
})
```

```javascript
// in plugins/index.js file
// we require some code in our app that
// is responsible for seeding our database
const db = require('../../server/src/db')

module.exports = (on, config) => {
  on('task', {
    'defaults:db': () => {
      return db.seed('defaults')
    }
  })
}
```

## Options

### Change the timeout

You can increase the time allowed to execute the task, although *we do not recommend executing tasks that take a long time to exit*.

Cypress will *not* continue running any other commands until `cy.task()` has finished, so a long-running command will drastically slow down your test runs.

```javascript
// will fail if seeding the database takes longer than 20 seconds to finish
cy.task('seedDatabase', null, { timeout: 20000 })
```

# Notes

## Tasks must end

### Tasks that do not end are not supported

`cy.task()` does not support tasks that do not end, such as:

- Starting a server.
- A task that watches for file changes.
- Any process that needs to be manually interrupted to stop.

A task must end within the `taskTimeout` or Cypress will fail the current test.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements task cy.task %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.task %}

## Timeouts {% helper_icon timeout %}

{% timeouts task cy.task %}

# Command Log

### List the contents of `cypress.json`

```javascript
cy.task('readJson', 'cypress.json')
```

The command above will display in the Command Log as:

![Command Log task](/img/api/task/task-read-cypress-json.png)

When clicking on the `task` command within the command log, the console outputs the following:

![console.log task](/img/api/task/console-shows-task-result.png)

# See also

- {% url `cy.exec()` exec %}
- {% url `cy.fixture()` fixture %}
- {% url `cy.readFile()` readfile %}
- {% url `cy.request()` request %}
- {% url `cy.writeFile()` writefile %}
- {% url "Blog: Incredibly Powerful cy.task()" https://glebbahmutov.com/blog/powerful-cy-task/ %}
- {% url "Blog: Rolling for a Test" https://glebbahmutov.com/blog/rolling-for-test/ %}
