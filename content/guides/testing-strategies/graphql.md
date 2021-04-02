---
title: GraphQL
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- Strategies for testing GraphQL API's with Cypress

</Alert>

## Alias multiple queries or mutations

In the `beforeEach`, we will use [cy.intercept()](/api/commands/intercept) to capture all requests for a GraphQL endpoint (e.g. `/graphql`), use conditionals to match the query or mutation and set an alias for using `req.alias`.

First, we'll create a set of utility functions to help match and alias our queries and mutations.

```js
// utils/graphql-test-utils.js

// Utility to match GraphQL mutation based on the operation name
export const hasMutation = (req, operationName) => {
  const { body } = req
  return (
    body.hasOwnProperty('query') &&
    body.query.includes(`mutation ${operationName}`)
  )
}

// Utility to match GraphQL query based on the operation name
export const hasQuery = (req, operationName) => {
  const { body } = req
  return (
    body.hasOwnProperty('query') &&
    body.query.includes(`query ${operationName}`)
  )
}

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
  if (hasQuery(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
  if (hasMutation(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}
```

In our test file, we can import these utilities and use them to alias the queries and mutations for our tests in a `beforeEach`.

```js
// app.spec.js
import {
  hasQuery,
  aliasQuery,
  aliasMutation,
} from '../utils/graphql-test-utils'

context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', apiGraphQL, (req) => {
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

```js
cy.wait('@gqlIsUserLoggedInQuery').then((resp) => {
  expect(resp.response.body.data.login.id).to.exist
  expect(resp.response.body.data.login.token).to.exist
})
```

## Override Query or Mutation in Test

```js
// app.spec.js
import { hasQuery, aliasQuery } from '../utils/graphql-test-utils'

context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', apiGraphQL, (req) => {
      // Queries
      aliasQuery(req, 'GetLaunchList')

      // ...
    })
  })

  it('should not display the load more button on the launches page', () => {
    cy.intercept('POST', apiGraphQL, (req) => {
      const { body } = req
      if (hasQuery(req, 'GetLaunchList')) {
        req.alias = 'gqlGetLaunchListQuery'
        req.continue((res) => {
          res.body.data.launches.hasMore = false
          res.body.data.launches.launches = res.body.data.launches.launches.slice(
            5
          )
        })
      }
    })

    // Must visit after cy.intercept
    cy.visit('/')

    cy.wait('@gqlGetLaunchListQuery').then((resp) => {
      expect(resp.response.body.data.launches.hasMore).to.be.false
      expect(resp.response.body.data.launches.launches.length).to.be.lte(20)
    })

    cy.getBySelLike('launch-list-tile').its('length').should('be.gte', 1)
    cy.getBySelLike('launch-list-tile').its('length').should('be.lt', 20)

    cy.getBySelLike('launches-load-more-button').should('not.exist')
  })
})
```
