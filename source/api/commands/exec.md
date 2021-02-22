---
title: exec
---

Execute a system command.

{% note warning 'Anti-Pattern' %}
Don't try to start a web server from `cy.exec()`.

Read about {% url 'best practices' best-practices#Web-Servers %} here.
{% endnote %}

# Syntax

```javascript
cy.exec(command)
cy.exec(command, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.exec('npm run build')
```

## Arguments

**{% fa fa-angle-right %} command** ***(String)***

The system command to be executed from the project root (the directory that contains the default `cypress.json` configuration file).

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.exec()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`env` | `{}` | Object of environment variables to set before the command executes (e.g. `{USERNAME: 'johndoe'}`). Will be merged with existing system environment variables
`failOnNonZeroExit` | `true` | whether to fail if the command exits with a non-zero code
`timeout` | {% url `execTimeout` configuration#Timeouts %} | {% usage_options timeout cy.exec %}

## Yields {% helper_icon yields %}

`cy.exec()` yields an object with the following properties:

- `code`
- `stdout`
- `stderr`

# Examples

## Command

`cy.exec()` provides an escape hatch for running arbitrary system commands, so you can take actions necessary for your test outside the scope of Cypress. This is great for:

- Running build scripts
- Seeding your test database
- Starting processes
- Killing processes

### Run a build command

```javascript
cy.exec('npm run build').then((result) => {
  // yields the 'result' object
  // {
  //   code: 0,
  //   stdout: "Files successfully built",
  //   stderr: ""
  // }
})
```

### Seed the database and assert it was successful

```javascript
cy.exec('rake db:seed').its('code').should('eq', 0)
```

### Run an arbitrary script and assert its output

```javascript
cy.exec('npm run my-script').its('stdout').should('contain', 'Done running the script')
```

### Write to a file to create a fixture from response body

```javascript
cy.intercept('POST', '/comments').as('postComment')
cy.get('.add-comment').click()
cy.wait('@postComment').then(({ response }) => {
  cy.exec(`echo ${JSON.stringify(response.body)} >cypress/fixtures/comment.json`)
  cy.fixture('comment.json').should('deep.eq', response.body)
})
```

## Options

### Change the timeout

You can increase the time allowed to execute the command, although *we don't recommend executing commands that take a long time to exit*.

Cypress will *not* continue running any other commands until `cy.exec()` has finished, so a long-running command will drastically slow down your test cycle.

```javascript
// will fail if script takes longer than 20 seconds to finish
cy.exec('npm run build', { timeout: 20000 })
```

### Choose to not fail on non-zero exit and assert on code and stderr

```javascript
cy.exec('man bear pig', { failOnNonZeroExit: false }).then((obj) => {
  expect(obj.code).to.eq(1)
  expect(obj.stderr).to.contain('No manual entry for bear')
```

### Specify environment variables

```javascript
cy.exec('echo $USERNAME', { env: { USERNAME: 'johndoe' } })
  .its('stdout').should('contain', 'johndoe')
```

# Notes

## Commands Must Exit

### Commands that do not exit are not supported

`cy.exec()` does not support commands that don't exit, such as:

- Starting a `rails server`
- A task that runs a watch
- Any process that needs to be manually interrupted to stop

A command must exit within the `execTimeout` or Cypress will kill the command's process and fail the current test.

## Reset timeout via `Cypress.config()`

You can change the timeout of `cy.exec()` for the remainder of the tests by setting the new values for `execTimeout` within {% url "`Cypress.config()`" config %}.

```js
Cypress.config('execTimeout', 30000)
Cypress.config('execTimeout') // => 30000
```

## Set timeout in the test configuration

You can configure the `cy.exec()` timeout within a suite or test by passing the new configuration value within the {% url "test configuration" configuration#Test-Configuration %}.

This will set the timeout throughout the duration of the tests, then return it to the default `execTimeout` when complete.

```js
describe('has data available from database', { execTimeout: 90000 }, () => {
  before(() => {
    cy.exec('rake db:seed')
  })

  // tests

  after(() => {
    cy.exec('rake db:reset')
  })
})
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements exec cy.exec %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.exec %}

## Timeouts {% helper_icon timeout %}

{% timeouts exec cy.exec %}

# Command Log

***List the contents of the default `cypress.json` configuration file***

```javascript
if (Cypress.platform === 'win32') {
  cy.exec('print cypress.json')
    .its('stderr').should('be.empty')
} else {
  cy.exec('cat cypress.json')
    .its('stderr').should('be.empty')
}
```

The command above will display in the Command Log as:

{% imgTag /img/api/exec/exec-cat-in-shell.png "Command Log exec" %}

When clicking on the `exec` command within the command log, the console outputs the following:

{% imgTag /img/api/exec/console-shows-code-shell-stderr-and-stdout-for-exec.png "console.log exec" %}

# See also

- {% url `cy.readFile()` readfile %}
- {% url `cy.request()` request %}
- {% url `cy.task()` task %}
- {% url `cy.writeFile()` writefile %}
