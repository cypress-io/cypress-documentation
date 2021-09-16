---
title: exec
---

Execute a system command.

<Alert type="warning">

<strong class="alert-header">Anti-Pattern</strong>

Don't try to start a web server from `cy.exec()`.

Read about [best practices](/guides/references/best-practices#Web-Servers) here.

</Alert>

## Syntax

```javascript
cy.exec(command)
cy.exec(command, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.exec('npm run build')
```

### Arguments

**<Icon name="angle-right"></Icon> command** **_(String)_**

The system command to be executed from the project root (the directory that
contains the Cypress [configuration file](/guides/references/configuration)).

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.exec()`.

| Option              | Default                                                    | Description                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `log`               | `true`                                                     | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                                     |
| `env`               | `{}`                                                       | Object of environment variables to set before the command executes (e.g. `{USERNAME: 'johndoe'}`). Will be merged with existing system environment variables |
| `failOnNonZeroExit` | `true`                                                     | whether to fail if the command exits with a non-zero code                                                                                                    |
| `timeout`           | [`execTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.exec()` to resolve before [timing out](#Timeouts)                                                                                       |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.exec()` yields an object with the following properties:

- `code`
- `stdout`
- `stderr`

## Examples

### Command

`cy.exec()` provides an escape hatch for running arbitrary system commands, so
you can take actions necessary for your test outside the scope of Cypress. This
is great for:

- Running build scripts
- Seeding your test database
- Starting processes
- Killing processes

#### Run a build command

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

#### Seed the database and assert it was successful

```javascript
cy.exec('rake db:seed').its('code').should('eq', 0)
```

#### Run an arbitrary script and assert its output

```javascript
cy.exec('npm run my-script')
  .its('stdout')
  .should('contain', 'Done running the script')
```

#### Write to a file to create a fixture from response body

```javascript
cy.intercept('POST', '/comments').as('postComment')
cy.get('.add-comment').click()
cy.wait('@postComment').then(({ response }) => {
  cy.exec(
    `echo ${JSON.stringify(response.body)} >cypress/fixtures/comment.json`
  )
  cy.fixture('comment.json').should('deep.eq', response.body)
})
```

### Options

#### Change the timeout

You can increase the time allowed to execute the command, although _we don't
recommend executing commands that take a long time to exit_.

Cypress will _not_ continue running any other commands until `cy.exec()` has
finished, so a long-running command will drastically slow down your test cycle.

```javascript
// will fail if script takes longer than 20 seconds to finish
cy.exec('npm run build', { timeout: 20000 })
```

#### Choose to not fail on non-zero exit and assert on code and stderr

```javascript
cy.exec('man bear pig', { failOnNonZeroExit: false }).then((result) => {
  expect(result.code).to.eq(1)
  expect(result.stderr).to.contain('No manual entry for bear')
})
```

#### Specify environment variables

```javascript
cy.exec('echo $USERNAME', { env: { USERNAME: 'johndoe' } })
  .its('stdout')
  .should('contain', 'johndoe')
```

## Notes

### Commands Must Exit

#### Commands that do not exit are not supported

`cy.exec()` does not support commands that don't exit, such as:

- Starting a `rails server`
- A task that runs a watch
- Any process that needs to be manually interrupted to stop

A command must exit within the `execTimeout` or Cypress will kill the command's
process and fail the current test.

### Reset timeout via `Cypress.config()`

You can change the timeout of `cy.exec()` for the remainder of the tests by
setting the new values for `execTimeout` within
[Cypress.config()](/api/cypress-api/config).

```js
Cypress.config('execTimeout', 30000)
Cypress.config('execTimeout') // => 30000
```

### Set timeout in the test configuration

You can configure the `cy.exec()` timeout within a suite or test by passing the
new configuration value within the
[test configuration](/guides/references/configuration#Test-Configuration).

This will set the timeout throughout the duration of the tests, then return it
to the default `execTimeout` when complete.

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

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.exec()` requires being chained off of `cy`.</li><li>`cy.exec()`
requires the executed system command to eventually exit.</li><li>`cy.exec()`
requires that the exit code be `0` when `failOnNonZeroExit` is
`true`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.exec()` will only run assertions you have chained once, and will
not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.exec()` can time out waiting for the system command to
exist.</li></List>

## Command Log

**_List the contents of your package.json file”_**

```javascript
if (Cypress.platform === 'win32') {
  cy.exec('print package.json').its('stderr').should('be.empty')
} else {
  cy.exec('cat package.json').its('stderr').should('be.empty')
}
```

The command above will display in the Command Log as:

<DocsImage src="/img/api/exec/exec-cat-in-shell.png" alt="Command Log exec" ></DocsImage>

When clicking on the `exec` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/exec/console-shows-code-shell-stderr-and-stdout-for-exec.png" alt="console.log exec" ></DocsImage>

## See also

- [`cy.readFile()`](/api/commands/readfile)
- [`cy.request()`](/api/commands/request)
- [`cy.task()`](/api/commands/task)
- [`cy.writeFile()`](/api/commands/writefile)
