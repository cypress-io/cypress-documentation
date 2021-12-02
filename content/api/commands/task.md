---
title: task
---

Execute code in [Node](https://nodejs.org) via the `task` plugin event.

<Alert type="warning">

<strong class="alert-header">Anti-Pattern</strong>

We do not recommend starting a web server using `cy.task()`. Read about
[best practices](/guides/references/best-practices#Web-Servers) here.

</Alert>

## Syntax

```javascript
cy.task(event)
cy.task(event, arg)
cy.task(event, arg, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
// in test
cy.task('log', 'This will be output to the terminal')
```

:::cypress-plugin-example

```javascript
on('task', {
  log(message) {
    console.log(message)

    return null
  },
})
```

:::

The `task` plugin event handler can return a value or a promise. The command
will fail if `undefined` is returned or if the promise is resolved with
`undefined`. This helps catch typos or cases where the task event is not
handled.

If you do not need to return a value, explicitly return `null` to signal that
the given event has been handled.

### Arguments

**<Icon name="angle-right"></Icon> event** **_(String)_**

An event name to be handled via the `task` event in the
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function.

**<Icon name="angle-right"></Icon> arg** **_(Object)_**

An argument to send along with the event. This can be any value that can be
serialized by
[JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
Unserializable types such as functions, regular expressions, or symbols will be
omitted to `null`.

If you need to pass multiple arguments, use an object

```javascript
// in test
cy.task('hello', { greeting: 'Hello', name: 'World' })
```

:::cypress-plugin-example

```js
on('task', {
  // deconstruct the individual properties
  hello({ greeting, name }) {
    console.log('%s, %s', greeting, name)

    return null
  },
})
```

:::

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.task()`.

| Option    | Default                                                    | Description                                                                              |
| --------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                     | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout` | [`taskTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.task()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.task()` yields the value returned or resolved by the `task` event in
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin).

## Examples

`cy.task()` provides an escape hatch for running arbitrary Node code, so you can
take actions necessary for your tests outside of the scope of Cypress. This is
great for:

- Seeding your test database.
- Storing state in Node that you want persisted between spec files.
- Performing parallel tasks, like making multiple http requests outside of
  Cypress.
- Running an external process.

### Read a file that might not exist

Command [cy.readFile()](/api/commands/readfile) assumes the file exists. If you
need to read a file that might not exist, use `cy.task`.

```javascript
// in test
cy.task('readFileMaybe', 'my-file.txt').then((textOrNull) => { ... })
```

:::cypress-plugin-example

```javascript
const fs = require('fs')
```

```js
on('task', {
  readFileMaybe(filename) {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf8')
    }

    return null
  },
})
```

:::

### Return number of files in the folder

```javascript
// in test
cy.task('countFiles', 'cypress/downloads').then((count) => { ... })
```

:::cypress-plugin-example

```javascript
const fs = require('fs')
```

```js
on('task', {
  countFiles(folderName) {
    return new Promise((resolve, reject) => {
      fs.readdir(folderName, (err, files) => {
        if (err) {
          return reject(err)
        }

        resolve(files.length)
      })
    })
  },
})
```

:::

### Seed a database

```js
// in test
describe('e2e', () => {
  beforeEach(() => {
    cy.task('defaults:db')
    cy.visit('/')
  })

  it('displays article values', () => {
    cy.get('.article-list').should('have.length', 10)
  })
})
```

:::cypress-plugin-example

```js
// we require some code in our app that
// is responsible for seeding our database
const db = require('../../server/src/db')
```

```js
on('task', {
  'defaults:db': () => {
    return db.seed('defaults')
  },
})
```

:::

### Return a Promise from an asynchronous task

```javascript
// in test
cy.task('pause', 1000)
```

:::cypress-plugin-example

```javascript
on('task', {
  pause(ms) {
    return new Promise((resolve) => {
      // tasks should not resolve with undefined
      setTimeout(() => resolve(null), ms)
    })
  },
})
```

:::

### Save a variable across non same-origin URL visits

When visiting non same-origin URL, Cypress will
[change the hosted URL to the new URL](/guides/guides/web-security), wiping the
state of any local variables. We want to save a variable across visiting non
same-origin URLs.

We can save the variable and retrieve the saved variable outside of the test
using `cy.task()` as shown below.

```javascript
// in test
describe('Href visit', () => {
  it('captures href', () => {
    cy.visit('https://www.mywebapp.com')
    cy.get('a')
      .invoke('attr', 'href')
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

:::cypress-plugin-example

```js
let href
```

```js
on('task', {
  setHref: (val) => {
    return (href = val)
  },
  getHref: () => {
    return href
  },
})
```

:::

### Command options

#### Change the timeout

You can increase the time allowed to execute the task, although _we do not
recommend executing tasks that take a long time to exit_.

Cypress will _not_ continue running any other commands until `cy.task()` has
finished, so a long-running command will drastically slow down your test runs.

```javascript
// will fail if seeding the database takes longer than 20 seconds to finish
cy.task('seedDatabase', null, { timeout: 20000 })
```

## Notes

### Tasks must end

#### Tasks that do not end are not supported

`cy.task()` does not support tasks that do not end, such as:

- Starting a server.
- A task that watches for file changes.
- Any process that needs to be manually interrupted to stop.

A task must end within the `taskTimeout` or Cypress will fail the current test.

### Tasks are merged automatically

Sometimes you might be using plugins that export their tasks for registration.
Cypress automatically merges `on('task')` objects for you. For example if you
are using
[cypress-skip-and-only-ui](https://github.com/bahmutov/cypress-skip-and-only-ui)
plugin and want to install your own task to read a file that might not exist:

:::cypress-plugin-example

```js
const skipAndOnlyTask = require('cypress-skip-and-only-ui/task')
const fs = require('fs')
const myTask = {
  readFileMaybe(filename) {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf8')
    }

    return null
  },
}
```

```js
// register plugin's task
on('task', skipAndOnlyTask)
// and register my own task
on('task', myTask)
```

:::

See [#2284](https://github.com/cypress-io/cypress/issues/2284) for
implementation.

<Alert type="warning">

<strong class="alert-header">Duplicate task keys</strong>

If multiple task objects use the same key, the later registration will overwrite
that particular key, similar to how merging multiple objects with duplicate keys
will overwrite the first one.

</Alert>

### Reset timeout via `Cypress.config()`

You can change the timeout of `cy.task()` for the remainder of the tests by
setting the new values for `taskTimeout` within
[Cypress.config()](/api/cypress-api/config).

```js
Cypress.config('taskTimeout', 30000)
Cypress.config('taskTimeout') // => 30000
```

### Set timeout in the test configuration

You can configure the `cy.task()` timeout within a suite or test by passing the
new configuration value within the
[test configuration](/guides/references/configuration#Test-Configuration).

This will set the timeout throughout the duration of the tests, then return it
to the default `taskTimeout` when complete.

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

### Allows a single argument only

The syntax `cy.task(name, arg, options)` only has place for a single argument to
be passed from the test code to the plugins code. In the situations where you
would like to pass multiple arguments, place them into an object to be
destructured inside the task code. For example, if you would like to execute a
database query and pass the database profile name you could do:

```javascript
// in test
const dbName = 'stagingA'
const query = 'SELECT * FROM users'

cy.task('queryDatabase', { dbName, query })
```

:::cypress-plugin-example

```js
const mysql = require('mysql')
// the connection strings for different databases could
// come from the Cypress configuration or from environment variables
const connections = {
  stagingA: {
    host: 'staging.my.co',
    user: 'test',
    password: '***',
    database: 'users',
  },
  stagingB: {
    host: 'staging-b.my.co',
    user: 'test',
    password: '***',
    database: 'users',
  },
}

// querying the database from Node
function queryDB(connectionInfo, query) {
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
```

```js
on('task', {
  // destructure the argument into the individual fields
  queryDatabase({ dbName, query }) {
    const connectionInfo = connections[dbName]

    if (!connectionInfo) {
      throw new Error(`Do not have DB connection under name ${dbName}`)
    }

    return queryDB(connectionInfo, query)
  },
})
```

:::

### Argument should be serializable

The argument `arg` sent via `cy.task(name, arg)` should be serializable; it
cannot have circular dependencies (issue
[#5539](https://github.com/cypress-io/cypress/issues/5539)). If there are any
special fields like `Date`, you are responsible for their conversion (issue
[#4980](https://github.com/cypress-io/cypress/issues/4980)):

```javascript
// in test
cy.task('date', new Date()).then((s) => {
  // the yielded result is a string
  // we need to convert it to Date object
  const result = new Date(s)
})
```

:::cypress-plugin-example

```javascript
on('task', {
  date(s) {
    // s is a string, so convert it to Date
    const d = new Date(s)

    // do something with the date
    // and return it back
    return d
  },
})
```

:::

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.task()` requires being chained off of `cy`.</li><li>`cy.task()`
requires the task to eventually end.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.task()` will only run assertions you have chained once, and will
not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.task()` can time out waiting for the task to end.</li></List>

## Command Log

This example uses the
[Return number of files in the folder](#Return-number-of-files-in-the-folder)
task defined above.

```javascript
cy.task('countFiles', 'cypress/integration')
```

The command above will display in the Command Log as:

<!-- Code to reproduce screenshot:
configure the countFiles task in the Cypress configuration and call it in a spec file as shown in above example
-->

<DocsImage src="/img/api/task/task-count-files.png" alt="Command Log task" ></DocsImage>

When clicking on the `task` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/task/console-shows-task-result.png" alt="Console Log task" ></DocsImage>

## History

| Version                                     | Changes                   |
| ------------------------------------------- | ------------------------- |
| [3.0.0](/guides/references/changelog#3-0-0) | `cy.task()` command added |

## See also

- [`cy.exec()`](/api/commands/exec)
- [`cy.fixture()`](/api/commands/fixture)
- [`cy.readFile()`](/api/commands/readfile)
- [`cy.request()`](/api/commands/request)
- [`cy.writeFile()`](/api/commands/writefile)
- [Blog: Incredibly Powerful cy.task()](https://glebbahmutov.com/blog/powerful-cy-task/)
- [Blog: Rolling for a Test](https://glebbahmutov.com/blog/rolling-for-test/)
- [Universal Code Test with Cypress](https://glebbahmutov.com/blog/universal-code-test/)
- repository
  [cypress-db-example](https://github.com/bahmutov/cypress-db-example) shows how
  to connect to a Sqlite3 database and use it during tests.
- [Blog: Testing Mongo with Cypress](https://glebbahmutov.com/blog/testing-mongo-with-cypress/)
  shows how to access the MongoDB during Cypress API tests locally and on
  CircleCI.
