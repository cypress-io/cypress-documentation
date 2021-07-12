# User Settings Overview & Setup

@robert I looked over it. It looks solid and I like the direction and detail. It would be useful to have a section at the top that explains the goals of the beforeEach for the given test. It might be helpful to show the test before the beforeEach so that users have context.

---

Within this section, we will be testing the user settings section of the RWA. The user settings section can be found by clicking on the "My Account" link in the left sidebar. We will be recreating some of the tests that exist within the `cypress/tests/ui/user-settings.spec.ts` file, which you can also view on GitHub [here](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui/user-settings.spec.ts).

![User%20Settings%20Overview%20&%20Setup%20ce4eacbf366b4978891ec77f9ff70df8/Screen_Shot_2021-06-29_at_9.51.44_AM.png](User%20Settings%20Overview%20&%20Setup%20ce4eacbf366b4978891ec77f9ff70df8/Screen_Shot_2021-06-29_at_9.51.44_AM.png)

Create a new file called `user-settings.spec.ts` within `cypress/tests/rwt`.

![User%20Settings%20Overview%20&%20Setup%20ce4eacbf366b4978891ec77f9ff70df8/Screen_Shot_2021-06-29_at_10.06.35_AM.png](User%20Settings%20Overview%20&%20Setup%20ce4eacbf366b4978891ec77f9ff70df8/Screen_Shot_2021-06-29_at_10.06.35_AM.png)

Next create a describe block and name it "User Settings"

```jsx
describe('User Settings', () => {})
```

Next we will need to add a `beforeEach()` as there are quite a lot of things we need to do before each test is run.

```jsx
describe('User Settings', () => {
  beforeEach(() => {})
})
```

The first thing we need to do is to make sure we have a cleanly seeded database before each test. We can do this by using a custom Cypress [task](https://docs.cypress.io/api/commands/task) that is included in the repo.

```jsx
describe('User Settings', () => {
  beforeEach(() => {
    cy.task('db:seed')
  })
})
```

This task can be found inside of `cypress/plugins/index.ts` around line `53` . It looks like this:

```jsx
async "db:seed"() {
  // seed database with test data
  const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
  return data;
},
```

The task is simply hitting an API endpoint that will re-seed the database each time a `POST` request is made to it.

With this task inside of our `beforeEach()` we will now have a freshly seeded database before each test in this file is run.

# Logging In

Since we are testing user settings, we will need to automatically login before each test in order to get access to the user settings page. We will utilize another custom Cypress command within the repo to do this.

```jsx
cy.database('find', 'users').then((user: User) => {
  cy.loginByXstate(user.username)
})
```

We are actually utilizing two custom Cypress commands together. The first is `cy.database` and the other is `cy.loginByXstate` .

Since we are using Typescript in this repo, we also need to import our `User` model into our test. So the entire test file up to this point should look like this:

```jsx
import { User } from '../../../src/models'

describe('User Settings', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.database('find', 'users').then((user: User) => {
      cy.loginByXstate(user.username)
    })
  })
})
```

We will break down what each of these commands is doing so you understand what is going on.

# cy.database

The `cy.database` command can be found in `cypress/support/commands.ts` around line `303` . It looks something like this.

```jsx
Cypress.Commands.add(
  'database',
  (operation, entity, query, logTask = false) => {
    const params = {
      entity,
      query,
    }

    const log = Cypress.log({
      name: 'database',
      displayName: 'DATABASE',
      message: [`🔎 ${operation}ing within ${entity} data`],
      // @ts-ignore
      autoEnd: false,
      consoleProps() {
        return params
      },
    })

    return cy
      .task(`${operation}:database`, params, { log: logTask })
      .then((data) => {
        log.snapshot()
        log.end()
        return data
      })
  }
)
```

The first thing we are doing, is creating a `params` object which is comprised of the `entity` and `query` that are passed into the command.

```jsx
Cypress.Commands.add("database", (operation, entity, query, logTask = false) => {
  const params = {
    entity,
    query,
  };

/ ...
```

Make sure to link back to the lesson where we discuss Cypress.log() in the testing your first application section.

Next, we are creating a custom log with `Cypress.log()` . We discussed how `Cypress.log()` works back in the "Testing your first application section."

Finally, we are returning a custom task which is responsible for performing an `operation` upon our database.

```jsx
return cy
  .task(`${operation}:database`, params, { log: logTask })
  .then((data) => {
    log.snapshot()
    log.end()
    return data
  })
```

This task can be found in `cypress/plugins/index.ts` around line `65` and looks like this:

```jsx
"find:database"(queryPayload) {
  return queryDatabase(queryPayload, (data, attrs) => _.find(data.results, attrs));
},
```

This task performs a database lookup for whatever `entity` we pass into it. Which in our case is `users` .

```jsx
// cypress/tests/rwt/user-settings.spec.ts

cy.database('find', 'users').then((user: User) => {
  // find all users in the db
  cy.loginByXstate(user.username)
})
```

We then take the first user that gets returned and pass their username into `cy.loginByXstate` to log in to the application as that user.

Let's take a look and see how the `cy.loginByXstate` command works.

# cy.loginByXstate

The `cy.loginByXstate` command can be found in `cypress/support/commands.ts` around line `131` . It looks something like this:

```jsx
Cypress.Commands.add(
  'loginByXstate',
  (username, password = Cypress.env('defaultPassword')) => {
    const log = Cypress.log({
      name: 'loginbyxstate',
      displayName: 'LOGIN BY XSTATE',
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    })

    cy.intercept('POST', '/login').as('loginUser')
    cy.intercept('GET', '/checkAuth').as('getUserProfile')
    cy.visit('/signin', { log: false }).then(() => {
      log.snapshot('before')
    })

    cy.window({ log: false }).then((win) =>
      win.authService.send('LOGIN', { username, password })
    )

    return cy.wait('@loginUser').then((loginUser) => {
      log.set({
        consoleProps() {
          return {
            username,
            password,
            // @ts-ignore
            userId: loginUser.response.body.user.id,
          }
        },
      })

      log.snapshot('after')
      log.end()
    })
  }
)
```

There is a lot going on in this custom command, but we will break it down step by step.

First, the command expects a username or password when it is invoked. We are providing a default password, if one is not passed in by using [Cypress.env()](https://docs.cypress.io/api/cypress-api/env). `Cypress.env()` allows us to pass environment variables into Cypress.

This environment variable can be found in `cypress/plugins/index.ts` around line `15` .

```jsx
config.env.defaultPassword = process.env.SEED_DEFAULT_USER_PASSWORD
```

On the left hand side we are setting the `Cypress.env()` with our environment variable from the `.env` file in the root of the project around line `10`

```jsx
SEED_DEFAULT_USER_PASSWORD = s3cret
```

Next, we are creating some custom logging with `Cypress.log()` .

Then, we visit the `/signin` route and take a `DOM` snapshot of the page.

```jsx
cy.visit('/signin', { log: false }).then(() => {
  log.snapshot('before')
})
```

Then, we are using [cy.intercept](https://docs.cypress.io/api/commands/intercept) to capture our `POST` request to our login route.

```jsx
cy.intercept('POST', '/login').as('loginUser')
```

This will grab the response from our `POST` request and create an alias called `loginUser` .

Next, we login our user, by updating the [XState](https://xstate.js.org/docs/) store, which is responsible for handling all of our client side state. It is very similar to [Redux](https://redux.js.org/).

```jsx
cy.window({ log: false }).then((win) =>
  win.authService.send('LOGIN', { username, password })
)
```

XState is attached to the `window` object, so we are using `cy.window()` to grab the `window` object from the browser. Then we are triggering the `LOGIN` action with our username and password, which updates XState, and logs in the user.

We are then using [cy.wait](https://docs.cypress.io/api/commands/wait) to wait until the `POST` request to `/login` has completed within our `cy.intercept()` just a few lines above.

```jsx
return cy.wait("@loginUser").then((loginUser) => {
    log.set({
      consoleProps() {
        return {
          username,
          password,
          // @ts-ignore
          userId: loginUser.response.body.user.id,
        };
      },
    });
```

Once it has completed, we set our custom log to log the users information. This information will be logged to the browser's console when we click on this step in the Cypress UI.

Finally, we take a `DOM` snapshot and end the command.

```jsx
log.snapshot('after')
log.end()
```

The last thing we want to do is click on the "My Account" link in the left hand sidebar to take us to the user settings page.

```jsx
cy.getBySel('sidenav-user-settings').click()
```

Our entire test file up until this point should look like this:

```jsx
import { User } from '../../../src/models'

describe('User Settings', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.database('find', 'users').then((user: User) => {
      cy.loginByXstate(user.username)
    })

    cy.getBySel('sidenav-user-settings').click()
  })
})
```

# Mobile View

Within this repo, we are using various CI providers to show how to run your Cypress tests in parallel. For one of these "jobs" we are running our tests against a mobile viewport, which basically means we tell the CI provider to run the tests against a browser window that is a specific length & width to mimic a mobile device.

If you look at the app on mobile, or simulate a mobile device with your browser's dev tools, you will see that the left hand sidebar disappears. We have to first click on the hamburger menu in the upper left hand corner to open the side bar. The element we need to `get`, can be selected with:

```jsx
cy.getBySel('sidenav-toggle').click()
```

However, we only want this to be run on mobile sized devices. How can we do this, without having to write an entirely different test specifically for mobile devices? Well, since Cypress is just JavaScript, we can use some JS to do it.

Let's update our test file to look like the following:

```jsx
import { User } from '../../../src/models'
import { isMobile } from '../../support/utils'

describe('User Settings', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.database('find', 'users').then((user: User) => {
      cy.loginByXstate(user.username)
    })

    if (isMobile()) {
      cy.getBySel('sidenav-toggle').click()
    }

    cy.getBySel('sidenav-user-settings').click()
  })
})
```

The `isMobile()` is a utility function included within the repo which can be found in `cypress/support/utils.ts` and looks like this.

```jsx
export const isMobile = () => {
  return (
    Cypress.config('viewportWidth') <
    Cypress.env('mobileViewportWidthBreakpoint')
  )
}
```

This simple function returns a `boolean` if the viewport width is less than our mobile viewport breakpoint environment variable.

```jsx
// This is coming from the cypress.json file around line 6.
Cypress.config('viewportWidth')
```

```jsx
// This is coming from the cypress.json file around line 14.
Cypress.env('mobileViewportWidthBreakpoint')
```

# Wrap Up

In this lesson, we setup the `beforeEach()` for our user settings tests. We learned about the `cy.database` custom command and the `cy.loginByXstate` command. We also learned how to conditionally get an element from the page depending upon if the browser is a mobile viewport or not.
