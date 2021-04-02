---
title: GraphQL
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- Strategies for testing GraphQL API's with Cypress

</Alert>

## Alias multiple queries or mutations

In the `beforeEach`, we will use [cy.intercept()](/api/commands/intercept) to capture all requests for a GraphQL endpoint (e.g. `/graphql`), use conditionals to match the query or mutation and set an alias for using `req.alias`.

```js
// Utility function to match GraphQL Query or Mutation based on the operation name
const hasQueryOrMutation = (req, operationName) =>
  req.body.hasOwnProperty('query') && req.body.query.includes(operationName)

context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', apiGraphQL, (req) => {
      const { body } = req
      if (hasQueryOrMutation(req, 'Login')) {
        req.alias = 'gqlIsUserLoggedInQuery'
      }

      if (hasQueryOrMutation(req, 'GetLaunchList')) {
        req.alias = 'gqlGetLaunchListQuery'
      }

      if (hasQueryOrMutation(req, 'LaunchDetails')) {
        req.alias = 'gqlLaunchDetailsQuery'
      }

      if (hasQueryOrMutation(req, 'BookTrips')) {
        req.alias = 'gqlBookTripsMutation'
      }

      if (hasQueryOrMutation(req, 'GetMyTrips')) {
        req.alias = 'gqlGetMyTripsQuery'
      }
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
context('Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', apiGraphQL, (req) => {
      const { body } = req

      if (hasQueryOrMutation(req, 'GetLaunchList')) {
        req.alias = 'gqlGetLaunchListQuery'
      }

      // ...
    })
  })

  it('should not display the load more button on the launches page', () => {
    cy.intercept('POST', apiGraphQL, (req) => {
      const { body } = req
      if (hasQueryOrMutation(req, 'GetLaunchList')) {
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
