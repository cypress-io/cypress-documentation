---
title: Working with GraphQL
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- Best practices to alias multiple GraphQL queries or mutations for a group of
  tests.
- Overriding an existing intercept to modify the query or mutation response
- Asserting against a GraphQL query or mutation response

</Alert>

The strategies below follow best known practices for waiting and asserting
against GraphQL queries or mutations.

Waiting and asserting on GraphQL API requests rely on matching a query or
mutation name in the POST body.

Using [cy.intercept()](/api/commands/intercept) we can override the response to
a GraphQL query or mutation by declaring an intercept at the beginning of the
test or closer to the expectation.

## Alias multiple queries or mutations

In the `beforeEach`, we will use [cy.intercept()](/api/commands/intercept) to
capture all requests for a GraphQL endpoint (e.g. `/graphql`), use conditionals
to match the query or mutation and set an alias for using `req.alias`.

First, we'll create a set of utility functions to help match and alias our
queries and mutations.

```js
// utils/graphql-test-utils.js

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req, operationName) => {
  const { body } = req
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}
```

In our test file, we can import these utilities and use them to alias the
queries and mutations for our tests in a `beforeEach`.

```js
// app.cy.js
import { aliasQuery, aliasMutation } from '../utils/graphql-test-utils'

context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/graphql', (req) => {
      // Queries
      aliasQuery(req, 'GetLaunchList')
      aliasQuery(req, 'LaunchDetails')
      aliasQuery(req, 'GetMyTrips')

      // Mutations
      aliasMutation(req, 'Login')
      aliasMutation(req, 'BookTrips')
    })
  })
  // ...
})
```

## Expectations for Query or Mutation Results

Expectations can be made against the response of an intercepted GraphQL query or
mutation using [cy.wait()](/api/commands/wait).

```js
// app.cy.js
import { aliasQuery } from '../utils/graphql-test-utils'

context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/graphql', (req) => {
      // Queries
      aliasQuery(req, 'Login')

      // ...
    })
  })

  it('should verify login data', () => {
    cy.wait('@gqlLoginQuery')
      .its('response.body.data.login')
      .should('have.property', 'id')
      .and('have.property', 'token')
  })
})
```

## Modifying a Query or Mutation Response

In the test below, the response is modified to test the UI for a single page of
results.

```js
// app.cy.js
import { hasOperationName, aliasQuery } from '../utils/graphql-test-utils'

context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/graphql', (req) => {
      // Queries
      aliasQuery(req, 'GetLaunchList')

      // ...
    })
  })

  it('should not display the load more button on the launches page', () => {
    cy.intercept('POST', 'http://localhost:3000/graphql', (req) => {
      const { body } = req
      if (hasOperationName(req, 'GetLaunchList')) {
        // Declare the alias from the initial intercept in the beforeEach
        req.alias = 'gqlGetLaunchListQuery'

        // Set req.fixture or use req.reply to modify portions of the response
        req.reply((res) => {
          // Modify the response body directly
          res.body.data.launches.hasMore = false
          res.body.data.launches.launches = res.body.data.launches.launches.slice(
            5
          )
        })
      }
    })

    // Must visit after cy.intercept
    cy.visit('/')

    cy.wait('@gqlGetLaunchListQuery')
      .its('response.body.data.launches')
      .should((launches) => {
        expect(launches.hasMore).to.be.false
        expect(launches.length).to.be.lte(20)
      })

    cy.get('#launch-list').its('length').should('be.gte', 1).and('be.lt', 20)
    cy.contains('button', 'Load More').should('not.exist')
  })
})
```
