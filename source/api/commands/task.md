---
title: task
---

Execute code in {% url "Node" https://nodejs.org %} via the `task` plugin event.

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
module.exports = (on, config) => {
  on('task', {
    log (message) {
      console.log(message)

      return null
    }
  })
}
```

## Arguments

**{% fa fa-angle-right %} event** ***(String)***

An event name to be handled via the `task` event in the {% url "`pluginsFile`" configuration#Folders-Files %}.

**{% fa fa-angle-right %} arg** ***(Object)***

An argument to send along with the event. This can be any value that can be serialized by {% url "JSON.stringify()" https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify %}. Unserializable types such as functions, regular expressions, or symbols will be omitted to `null`.

If you need to pass multiple arguments, use an object

```javascript
// in test
cy.task('hello', { greeting: 'Hello', name: 'World' })
```

```javascript
// in plugins/index.js
module.exports = (on, config) => {
  on('task', {
    // deconstruct the individual properties
    hello ({ greeting, name }) {
      console.log('%s, %s', greeting, name)

      return null
    }
  })
}
```

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.task()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `taskTimeout` configuration#Timeouts %} | {% usage_options timeout cy.task %}

## Yields {% helper_icon yields %}

`cy.task()` yields the value returned or resolved by the `task` event in the {% url "`pluginsFile`" configuration#Folders-Files %}.

# Examples

## Event

`cy.task()` provides an escape hatch for running arbitrary Node code, so you can take actions necessary for your tests outside of the scope of Cypress. This is great for:

- Seeding your test database.
- Storing state in Node that you want persisted between spec files.
- Performing parallel tasks, like making multiple http requests outside of Cypress.
- Running an external process.

In the `task` plugin event, the command will fail if `undefined` is returned. This helps catch typos or cases where the task event is not handled.

If you do not need to return a value, explicitly return `null` to signal that the given event has been handled.

### Read a file that might not exist

Command {% url "`cy.readFile()`" readfile %} assumes the file exists. If you need to read a file that might not exist, use `cy.task`.

```javascript
// in test
cy.task('readFileMaybe', 'my-file.txt').then((textOrNull) => { ... })
```

```javascript
// in plugins/index.js
const fs = require('fs')

module.exports = (on, config) => {
  on('task', {
    readFileMaybe (filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8')
      }

      return null
    }
  })
}
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
// in plugins/index.js
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

### Return a Promise from an asynchronous task

```javascript
// in test
cy.task('pause', 1000)
```

```javascript
// in plugins/index.js
module.exports = (on, config) => {
  on('task', {
    pause (ms) {
      return new Promise((resolve) => {
        // tasks should not resolve with undefined
        setTimeout(() => resolve(null), ms)
      })
    }
  })
}
```

### Save a variable across non same-origin URL visits

When visiting non same-origin URL, Cypress will {% url "change the hosted URL to the new URL" web-security %}, wiping the state of any local variables. We want to save a variable across visiting non same-origin URLs.

We can save the variable and retrieve the saved variable outside of the test using `cy.task()` as shown below.

```javascript
// in test
describe('Href visit', () => {
  it('captures href', () => {
    cy.visit('https://www.mywebapp.com')
    cy.get('a').invoke('attr', 'href')
      .then((href) => {
        // href is not same-origin as current url
        // like https://www.anotherwebapp.com
        cy.task('setHref', href)
      })
  })

  it('visit href', () => {
    cy.task('getHref').then((href) => {
      // visit non same-origin url https://www.anotherwebapp.com
      cy.visit(href)
    })
  })
})
```

```javascript
// in plugins/index.js
let href

module.exports = (on, config) => {
  on('task', {
    setHref: (val) => {
      return href = val
    },
    getHref: () => {
      return href
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

## Tasks are merged automatically

Sometimes you might be using plugins that export their tasks for registration. Cypress automatically merges `on('task')` objects for you. For example if you are using {% url 'cypress-skip-and-only-ui' https://github.com/bahmutov/cypress-skip-and-only-ui %} plugin and want to install your own task to read a file that might not exist:

```javascript
// in plugins/index.js file
const skipAndOnlyTask = require('cypress-skip-and-only-ui/task')
const fs = require('fs')
const myTask = {
  readFileMaybe (filename) {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf8')
    }

    return null
  }
}

// register plugin's task
on('task', skipAndOnlyTask)
// and register my own task
on('task', myTask)
```

See {% issue 2284 '#2284' %} for implementation.

{% note warning Duplicate task keys %}
If multiple task objects use the same key, the later registration will overwrite that particular key, similar to how merging multiple objects with duplicate keys will overwrite the first one.
{% endnote %}

## Reset timeout via `Cypress.config()`

You can change the timeout of `cy.task()` for the remainder of the tests by setting the new values for `taskTimeout` within {% url "`Cypress.config()`" config %}.

```js
Cypress.config('taskTimeout', 30000)
Cypress.config('taskTimeout') // => 30000
```

## Set timeout in the test configuration

You can configure the `cy.task()` timeout within a suite or test by passing the new configuration value within the {% url "test configuration" configuration#Test-Configuration %}.

This will set the timeout throughout the duration of the tests, then return it to the default `taskTimeout` when complete.

```js
describe('has data available from database', { taskTimeout: 90000 }, () => {
  before(() => {
    cy.task('seedDatabase')
  })

  // tests

  after(() => {
    cy.task('resetDatabase')
  })
})
```

## Allows a single argument only

The syntax `cy.task(name, arg, options)` only has place for a single argument to be passed from the test code to the plugins code. In the situations where you would like to pass multiple arguments, place them into an object to be destructured inside the task code. For example, if you would like to execute a database query and pass the database profile name you could do:

```javascript
// in test
const dbName = 'stagingA'
const query = 'SELECT * FROM users'

cy.task('queryDatabase', { dbName, query })
```

```javascript
// in plugins/index.js
const mysql = require('mysql')
// the connection strings for different databases could
// come from a config file, or from environment variables
const connections = {
  stagingA: {
    host: 'staging.my.co',
    user: 'test',
    password: '***',
    database: 'users'
  },
  stagingB: {
    host: 'staging-b.my.co',
    user: 'test',
    password: '***',
    database: 'users'
  }
}

// querying the database from Node
function queryDB (connectionInfo, query) {
  const connection = mysql.createConnection(connectionInfo)

  connection.connect()

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        return reject(error)
      }

      connection.end()

      return resolve(results)
    })
  })
}
module.exports = (on, config) => {
  on('task', {
    // destructure the argument into the individual fields
    queryDatabase ({ dbName, query }) {
      const connectionInfo = connections[dbName]

      if (!connectionInfo) {
        throw new Error(`Do not have DB connection under name ${dbName}`)
      }

      return queryDB(connectionInfo, query)
    }
  })
}
```

## Argument should be serializable

The argument `arg` sent via `cy.task(name, arg)` should be serializable; it cannot have circular dependencies (issue {% issue 5539 %}). If there are any special fields like `Date`, you are responsible for their conversion (issue {% issue 4980 %}):

```javascript
// in test
cy.task('date', new Date())
  .then((s) => {
    // the yielded result is a string
    // we need to convert it to Date object
    const result = new Date(s)
  })
```

```javascript
// in plugins/index.js
module.exports = (on, config) => {
  on('task', {
    date (s) {
      // s is a string, so convert it to Date
      const d = new Date(s)

      // do something with the date
      // and return it back
      return d
    }
  })
}
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements task cy.task %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.task %}

## Timeouts {% helper_icon timeout %}

{% timeouts task cy.task %}

# Command Log

### List the contents of the default `cypress.json` configuration file

```javascript
cy.task('readJson', 'cypress.json')
```

The command above will display in the Command Log as:

{% imgTag /img/api/task/task-read-cypress-json.png "Command Log task" %}

When clicking on the `task` command within the command log, the console outputs the following:

{% imgTag /img/api/task/console-shows-task-result.png "Console Log task" %}

{% history %}
{% url "3.0.0" changelog#3-0-0 %} | `cy.task()` command added
{% endhistory %}

# See also

- {% url `cy.exec()` exec %}
- {% url `cy.fixture()` fixture %}
- {% url `cy.readFile()` readfile %}
- {% url `cy.request()` request %}
- {% url `cy.writeFile()` writefile %}
- {% url "Blog: Incredibly Powerful cy.task()" https://glebbahmutov.com/blog/powerful-cy-task/ %}
- {% url "Blog: Rolling for a Test" https://glebbahmutov.com/blog/rolling-for-test/ %}
- {% url "Universal Code Test with Cypress" https://glebbahmutov.com/blog/universal-code-test/ %}
