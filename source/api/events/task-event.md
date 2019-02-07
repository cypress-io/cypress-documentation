---
title: task
---

The `task` event allows you to execute code in {% url "Node.js" https://nodejs.org %} in conjunction with {% url `cy.task()` task %}.

{% note warning 'Anti-Pattern' %}
We do not recommend starting a web server using the `task` event. Read about {% url 'best practices' best-practices#Web-Servers %} here.
{% endnote %}

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`task` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} args**

The arguments originally passed to {% url `cy.task()` task %}.

# Usage

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `task` event.

**{% fa fa-check-circle green %} Correct Usage**
```javascript
// require code from your own node app
const database = require('../../app/database')

// in background file
on('task', {
  'seed:database' () {
    return database.seed()
  }
})
```

In a spec file or support file you can trigger `task` event using {% url `cy.task()` task %}.

```javascript
// in test
cy.task('seed:database')
```

The `task` event should be provided an object with string keys and function values. The string keys (i.e. 'seed:database') are used by {% url `cy.task()` task %} to execute the associated function.

You can return a value from the function, or return a promise and it will be awaited by {% url `cy.task()` task %}.

```javascript
on('task', {
  'return:value' () {
    return 'all good'
  },

  'return:promise' () {
    return new Promise((resolve) => {
      // ... more code here
    })
  }
})
```

However, the task will fail if `undefined` is returned or resolved by the returned promise. This helps catch typos or cases where the task event is not handled. If you don't need to return or resolve a value, return or resolve `null`.

```javascript
on('task', {
  'return:null' () {
    // ... some code with no meaningful return value
    return null
  },

  'resolve:null' () {
    return new Promise((resolve) => {
    // ... some code with no meaningful return value
      resolve(null)
    })
  }
})
```

{% url `cy.task()` task %} and the `task` event provide an escape hatch for running arbitrary Node code, so you can take actions necessary for your tests outside of the scope of Cypress. This is great for:

- Seeding your test database.
- Storing state in Node that you want persisted between spec files.
- Performing parallel tasks, like making multiple http requests outside of Cypress.
- Running an external process.

# Examples

## Read a JSON file's contents

{% note info %}
This serves as a demonstration only. We recommend using {% url "`cy.fixture()`" fixture %} or {% url "`cy.readFile()`" readfile %} for a more robust implementation of reading a file in your tests.
{% endnote %}

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
const fs = require('fs-extra')

// in background/index.js
on('task', {
  readJson: (filename) => {
    // reads the file relative to current working directory
    return fs.readJson(path.join(process.cwd(), filename)
  }
})
```

## Seed a database

```javascript
// in test
describe('e2e', () => {
  beforeEach(() => {
    cy.task('seed:database')
    cy.visit('/')
  })

  it('displays article values', () => {
    cy.get('.article-list')
      .should('have.length', 10)
  })
})
```

```javascript
// in background/index.js

// require some code from your own app that
// is responsible the database
const database = require('../../app/database')

module.exports = (on, config) => {
  on('task', {
    'seed:database': () => {
      return database.seed()
    }
  })
}
```

# Options

## Change the timeout

You can increase the time allowed to execute the task, although *we do not recommend executing tasks that take a long time to exit*.

Cypress will *not* continue running any other commands until {% url `cy.task()` task %} has finished, so a long-running command will drastically slow down your test runs.

```javascript
// will fail if seeding the database takes longer than 20 seconds to finish
cy.task('seed:database', null, { timeout: 20000 })
```

# Notes

## Tasks must end

{% note warning 'Anti-Pattern' %}
Tasks that do not end are not supported. Read about {% url 'best practices' best-practices#Web-Servers %} here.
{% endnote %}

The `task` event does not support tasks that do not end, such as:

- Starting a server.
- A task that watches for file changes.
- Any process that needs to be manually interrupted to stop.

A task must end within the `taskTimeout` or Cypress will fail the current test.

## Task conflicts

It is possible to call `on('task', { /* tasks */ })` multiple times. This makes it possible to potentially try to register the same task multiple times. This is most likely to happen in the case of using a plugin that receives the `on` function.

```javascript
// cypress/background/index.js
const somePlugin = require('some-plugin')

module.exports = (on, config) => {
  on('task', {
    'seed:database': () => {
      // seed the database one way
    }
  })

  somePlugin(on, config)
}

// some-plugin's code
module.exports = (on, config) => {
  on('task', {
    'seed:database': () => {
      // seed the database another way
    }
  })
}
```

Both you and 'some-plugin' attempt to register the `seed:database` task. In such a case, the last one registered will win out and overwrite the earlier registration. So in the above code, only the plugin's `seed:database` handler will be executed when `cy.task('seed:database')` is called.

If you wish for your own handler to be executed, call `somePlugin(on, config)` earlier than your own task registration.

```javascript
// cypress/background/index.js
const somePlugin = require('some-plugin')

module.exports = (on, config) => {
  somePlugin(on, config)

  on('task', {
    'seed:database': () => {
      // seed the database one way
    }
  })
}
```

# See also

- {% url `cy.task()` task %}
- {% url `cy.exec()` exec %}
- {% url `cy.fixture()` fixture %}
- {% url `cy.readFile()` readfile %}
- {% url `cy.request()` request %}
- {% url `cy.writeFile()` writefile %}
