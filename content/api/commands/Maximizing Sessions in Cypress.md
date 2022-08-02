# Maximizing Sessions in Cypress

As you likely know, Cypress ensures consistent results through test isolation,
where test isolation is the practice of resetting the state _before_ each test.

Cleaning up state ensures the operations of one test does not affect another
test downstream. When writing tests, the goal for the test is reliably pass when
ran standalone or in a randomized order. If you have set up your tests in a way
that requires the state of a previous test, this could potentially break your
tests.

A known downside of test isolation is the need to rebuild test and application
state before each test kicks off. This in in itself takes time to setup before
the real heavy lifting can be performed to ensure your application is truly
performing as expected.

This can lead to two issues:

1. longer tests time

If a spec is structured correctly, each concept should be it's own test for
multiple reasons, readability, easier debugging and requirement traceability.
However, if a spec contains multiple tests that required authentication and
random data generate to properly conduct assertions on an application, its
noticeable, and possibly acceptable to increase test times to ensure test
isolation. The real problem is when multiple specs need this same setup in order
for the application to be testable and when these tests need to scale for form
factor testing.

Lets be real - the time it takes for tests to run not only impacts dev
turnaround time, but it impacts how long CI runs and how much it costs to ensure
a software change is correct.

2. poorly written tests

To reduce slow setup times, some developers have opted to remove separation of
test concerns by writing all assertions within the same test. Now, why is this
bad? remember, testing in Cypress is all about readability and simplicity. When
all requirements are encompassed by an umbrella test, it not only impacts
maintainability by makes it harder to debug your application when something does
going wrong, but it can lead to missed test requirements without the proper spec
structure.

## So how can you reduce the overall test time while continuing to write reliable, flake-free tests?

Through the usage of `cy.session()` (provided by Cypress) and `cy.dataSession()`
(provided via the cypress-data-session plugin)!

I'm confused, aren't cy.session and cy.dataSession the same thing, only one is a
plugin?

Nope! Not quite -- although both shared the term sessions and have similar
application programming interfaces (APIs), each command serves a different
purpose.

## What is `cy.session()`?

Remember a test starts it will have a clean slate - this mean the test,
application and browser state have been reset and cleared to ensure proper test
isolation.

What this means is each test is kicked off in a simulated new browser instance
where no cookies have been set and data has been added to local or session
storage for the application to utilize. While a valid testing scenario, there
are many scenarios where an application may rely on and/or behave differently
when cookies, local storage and/or session storage data has been stored on the
browser. This is where `cy.session()` comes in.

`cy.session()` is a Cypress-provided command which enables you to perform a
series of repeatable commands to setup and validate the _data stored on the
browser_ your tests or application under test will use. This data might be:

`cy.session()` is a Cypress-provided command which enables you to perform a
series of repeatable commands to setup and validate the data your application
expects to be stored on the browser. This data might be:

- one or more cookies the application's server leverages to verify the user's
  login state when a request is made
- immutable user data, like preferred payment method, the application would pull
  from local storage to pre-populate a payment from in a checkout workflow.
- the current state of an interface stored in session storage, like whether or
  not a user has saved their user setting edits

Once the set of repeatable setup commands have completed, `cy.session()` will
store all cookies, local storage and session storage values, which can be
validated and re-used in later tests or specs. As long as the restored session
passes validation, there setup commands are skipped, which reduced the overall
setup time to re-build the browser state for the application.

Quick example - log in as an existing user

```js
describe('bank accounts', () => {
  it('log-in to see accounts', () => {
    const username = 'ashley_williams'
    const password = Cypress.env('ashley_williams_password')

    cy.session(
      username,
      () => {
        cy.visit('/home')
        cy.contains('button', 'login').click()
        cy.get('.login-form')
          .should('be.visible')
          .within(() => {
            cy.get('[placeholder=username]').type(username)
            cy.get('[placeholder=password]').type()
            cy.contains('button', 'login').click()
          })

        cy.location('pathname').should('equal', '/rooms')
      },
      {
        validate() {
          cy.getCookie('sess.id')
            .should('exist')
            .should('have.property', 'value', '189jd09su')
          cy.window().then((win) => {
            expect(win.sessionStorage.length).to.have.length(1)
            expect(win.sessionStorage.getItem('themePreference')).to.equal(
              'dark-mode'
            )
          })
        },
      }
    )

    cy.visit('/home')

    cy.get('.accounts')
      .should('have.length', 1)
      .should('have.class', 'dark-mode')
  })
})
```

## What is `cy.dataSession()`?

`cy.dataSession()` is a custom command, shipped with the `cypress-data-session`
plugin, which enables you to perform a series of repeatable commands to setup
and validate **complex data** your tests will use. This data might be:

- mocked intercept responses
- an expensive database query result
- randomized new user attributes, like username or password, for creating new
  users

Once the set of repeatable setup commands have completed, `cy.dataSession()`
will store whatever information is returned from the setup callback. Then, like
`cy.session()`, as long as the restored dataSession passes validation, the data
setup commands are skipped and the saved dataSession values can be used in
tests, which also reduces the overall setup time required to regenerate data for
a test.

Quick example - create new user

## Quick Comparison

<!-- - `cy.session()` handles creating and persisting data stored in the browser, where as `cy.dataSession()` handles creating and persisting test data.
- `cy.session()` yeilds `null` and is not chainable, where as `cy.dataSession()`
- When a persisted data is applied in `cy.session()`, it is referred to as a restored session. When a persisted data is applied in `cy.session()`, it is referred to as a recreated session.
- When a validation handler is provided, `cy.session()` always run it after a new session is created to ensure it was created correctly, where as `cy.dataSession()` will only run the validation handler when a session is recreated (persisted data is applied).
<!-- - Both `cy.session()`  and `cy.dataSession()` will  re-uses the setup handler to recreate an session that failed validation to ensure the expected session result is created consistently. -->
<!-- - `cy.dataSession()` provides additional setup API's that `cy.session()` expects to be included in setup handler if needed.
- `cy.dataSession()` provides a recreated (persisted data is applied) handler to allow additional and/or different setup if the dataSession has already been used. -->

| overview                                    | cy.session()                                                                                                                                                   | cy.dataSession()                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| command purpose                             | create and persists data stored on the browser                                                                                                                 | create and persists test data                                                                               |
| status terminology (key difference in bold) | <ul><li>created (new)</li><li>**restored (applied existing)**</li><li>recreated (failed validation & created new)</li><li>failed (failed validation)</li></ul> | <ul><li>created (new)</li><li>**recreated (applied existing)**</li><li>failed (failed validation)</li></ul> |
| yeilds                                      | `null`                                                                                                                                                         | the data returned from `setup` or `recreate` handlers (also available as an alias)                          |
| chainable                                   | no                                                                                                                                                             | yes                                                                                                         |
| persists across specs                       | yes                                                                                                                                                            | yes                                                                                                         |

## Using `cy.session()` and `cy.dataSession()` together

```js
describe('finance tracker', () => {
  const login = (username, password) => {
    return cy.session(username, () => {
      cy.visit('/home')
      cy.contains('button', 'login').click()
      cy.get('.login-form')
      .should('be.visible')
        .within(() => {
          cy.get('[placeholder=username]').type(username)
          cy.get('[placeholder=password]').type(password)
          cy.contains('button', 'login').click()
        })

        cy.location('pathname').should('equal', '/rooms')
    }, {
      validate() {
        cy.getCookie('sess.id')
          .should('exist')
          .should('have.property', 'value', '189jd09su')
        cy.window().then((win) => {
          expect(win.sessionStorage.length).to.have.length(1)
          expect(win.sessionStorage.getItem('themePreference')).to.equal('dark-mode')
        })
      }
    })
  }

  // this does not highlight cypress-data-session,,,,,,
  // need an idea for a better example???
  const loadFinances = (username) => {
    cy.dataSession({
      name: username,
      setup: () => {
        // reseed database with transactions
        return cy.fixtures('finance_transactions.json').then((details) => {
          cy.task('createFinances', details)
        })
      },
      validate: (userTransactions) => {
        // verify database has not changed
        return cy.task('getFinances', username).then((details) => {
          const expensesMatch = Cypress._.isEqual(userTransactions.expenses, details.expenses)
          const incomesMatch = Cypress._.isEqual(userTransactions.incomes, details.incomes)
          return expensesMatch && incomesMatch
        })
      },
    })
  })

  it('view monthly expenses', function () {
    loadFinances('ashley_williams')
    login('ashley_williams', Cypress.env(`${username}_password`))

    cy.visit('/tracker')
    cy.get('.expense_transactions').should('have.length', 10)
  })

  it('view monthly incomes', function () {
    login('ashley_williams', Cypress.env(`${username}_password`))

    cy.visit('/tracker')
    cy.get('.income_transactions').should('have.length', 2)
  })

  it('deletes invalid expense', () => {
    login('ashley_williams', Cypress.env(`${username}_password`))
    cy.visit('/tracker')
    cy.get('.expense_transactions')
      .should('have.length', 10)
      .eq(1)
      .find('delete').click()
  })

  it('deletes different invalid expense', () => {
    login('ashley_williams', Cypress.env(`${username}_password`))

    cy.visit('/tracker')
    cy.get('.expense_transactions')
      .should('have.length', 10)
      .eq(9)
      .find('delete').click()
  })
})
```

<!--

cy.session - command to

cy.dataSession -



```
// create a user and log in
beforeEach(() => {
    const username = 'Gleb-' + Cypress._.random(1e3)
    const password = 'secret!'
    cy.dataSession({
        name: 'user',
        setup() {
            cy.visit('/').get('#create-account').should('be.visible')

            cy.get('.login-form')
                .should('be.visible')
                .within(() => {
                    cy.get('[placeholder=username]').type(username)
                    cy.get('[placeholder=password]').type(password)
                    cy.contains('button', 'login').click()
                })

                cy.location('pathname').should('equal', '/rooms')

                cy.getCookie('connect.sid')
                .should('exist')
                .then(cookie => {
                    // what we return is saved for the dataSession
                    return {
                        cookie,
                        username,
                    }
                })
        },
        validate(saved) {
            return cy.task('findUser', saved.username).then(Boolean)
        },
        recreate(saved) {
            // no we need to ge tlogged in - diff than setup
            cy.setCookie('connect.sid', saved.cookie.value)
            cy.visit('/rooms') // end on same page as original login flow
        },
        shareAcrossSpecs: true,
    })
})


// automatically saved as an alias set on disk
it('is logged in', function () {
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-name', this.user.username)
})

```

key differences:
- yeilds session data useDebugValue
- wraps datas session value as an alias
- Cypress data session allows an advanced way of manupilating data by not incurring costs for an entity that may already exist. -->
