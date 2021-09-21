---
title: Okta Authentication
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- Programmatically authenticate with [Okta](https://okta.com) via a custom
  Cypress command
- Adapting your [Okta](https://okta.com) application for programmatic
  authentication during testing

</Alert>

<Alert type="warning">

The scope of this guide is to demonstrate authentication solely against the
[Okta Universal Directory](https://www.okta.com/products/universal-directory/).
Future guides will expand to include cover [Okta](https://okta.com)
authentication with other identity providers.

</Alert>

<Alert type="success">

<strong class="alert-header">Why authenticate programmatically?</strong>

Typically, logging in a user within your app by authenticating via a third-party
provider requires visiting login pages hosted on a different domain. Since each
Cypress test is limited to visiting domains of the same origin, we can subvert
visiting and testing third-party login pages by programmatically interacting
with the third-party authentication API to login a user.

</Alert>

## Okta Developer Console Setup

If not already setup, you will need to
[create an Okta application](https://okta.com) within the Okta Developer
Console. Once the Okta application is created, the Okta Developer Console will
provide a **Client ID**, which will used alongside your **Okta domain** to
[configure Okta SDKs](https://developer.okta.com/docs/guides/sign-into-spa/react/configure-the-sdk/)
as shown in the subsequent sections of this guide.

## Setting Okta app credentials in Cypress

To have access to test user credentials within our tests we need to configure
Cypress to use the [Okta](https://okta.com) environment variables set in `.env`
inside of the `cypress/plugins/index.js` file.

:::cypress-plugin-example

```js
// initial imports ...
dotenv.config()
```

```js
// ...
config.env.auth_username = process.env.AUTH_USERNAME
config.env.auth_password = process.env.AUTH_PASSWORD
config.env.okta_domain = process.env.REACT_APP_OKTA_DOMAIN
config.env.okta_client_id = process.env.REACT_APP_OKTA_CLIENTID

// plugins code ...

return config
```

:::

## Custom Command for Okta Authentication

Next, we will write a command named `loginByOktaApi` to perform a programmatic
login into [Okta](https://okta.com) and set an item in localStorage with the
authenticated users details, which we will use in our application code to verify
we are authenticated under test.

The `loginByOktaApi` command will execute the following steps:

1. Use the
   [Okta Authentication API](https://developer.okta.com/docs/reference/api/authn/)
   to perform the programmatic login.
2. Then uses an instance of `OktaAuth` client from the
   [Okta Auth SDK](https://github.com/okta/okta-auth-js) to gain the `id_token`
   once a session token is obtained.
3. Finally the `oktaCypress` localStorage item is set with the `access token`
   and user profile.

```jsx
// cypress/support/commands.js
import { OktaAuth } from '@okta/okta-auth-js'

// Okta
Cypress.Commands.add('loginByOktaApi', (username, password) => {
  cy.request({
    method: 'POST',
    url: `https://${Cypress.env('okta_domain')}/api/v1/authn`,
    body: {
      username,
      password,
    },
  }).then(({ body }) => {
    const user = body._embedded.user
    const config = {
      issuer: `https://${Cypress.env('okta_domain')}/oauth2/default`,
      clientId: Cypress.env('okta_client_id'),
      redirectUri: 'http://localhost:3000/implicit/callback',
      scope: ['openid', 'email', 'profile'],
    }

    const authClient = new OktaAuth(config)

    return authClient.token
      .getWithoutPrompt({ sessionToken: body.sessionToken })
      .then(({ tokens }) => {
        const userItem = {
          token: tokens.accessToken.value,
          user: {
            sub: user.id,
            email: user.profile.login,
            given_name: user.profile.firstName,
            family_name: user.profile.lastName,
            preferred_username: user.profile.login,
          },
        }

        window.localStorage.setItem('oktaCypress', JSON.stringify(userItem))

        log.snapshot('after')
        log.end()
      })
  })
})
```

With our Okta app setup properly in Okta Developer console, necessary
environment variables in place, and our `loginByOktaApi` command implemented, we
will be able to authenticate with Okta while our app is under test. Below is a
test to login as a user via [Okta](https://okta.com), complete the onboarding
process and logout.

```jsx
describe('Okta', function () {
  beforeEach(function () {
    cy.task('db:seed')
    cy.loginByOktaApi(
      Cypress.env('auth_username'),
      Cypress.env('auth_password')
    )
  })

  it('shows onboarding', function () {
    cy.contains('Get Started').should('be.visible')
  })
})
```

<Alert type="success">

<strong class="alert-header">Try it out</strong>

The
[runnable version of this test](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui-auth-providers/okta.spec.ts)
is in the
[Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

</Alert>

## Adapting an Okta App for Testing

<Alert type="info">

<strong class="alert-header">Note</strong>

The previous sections focused on the recommended Okta authentication practice
within Cypress tests. To use this practice it is assumed you are testing an app
appropriately built or adapted to use Okta.

The following sections provides guidance on building or adapting an app to use
Okta authentication.

</Alert>

The
[Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) is
used and provides configuration and runnable code for both the React SPA and the
Express back end.

The front end uses the [Okta React SDK](https://github.com/okta/okta-react) for
React Single Page Applications (SPA), which uses the
[Okta Auth SDK](https://github.com/okta/okta-auth-js) underneath. The back end
uses the
[Okta JWT Verifier for Node.js](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier)
to validate JWTs from [Okta](https://okta.com).

<Alert type="info">

<strong class="alert-header">Note</strong>

Use the `yarn dev:okta` command when starting the
[Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

</Alert>

### Adapting the back end

In order to validate API requests from the frontend, we install
[Okta JWT Verifier for Node.js](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier)
and configure it using the Okta Domain and Client ID provided after
[Creating an Okta application](https://developer.okta.com/docs/guides/sign-into-spa/react/create-okta-application/).

```jsx
// backend/helpers.ts
import OktaJwtVerifier from '@okta/jwt-verifier'

dotenv.config()

// Okta Validate the JWT Signature
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `https://${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`,
  clientId: process.env.REACT_APP_OKTA_CLIENTID,
  assertClaims: {
    aud: 'api://default',
    cid: process.env.REACT_APP_OKTA_CLIENTID,
  },
})
```

Next, we'll define an Express middleware function to be use in our routes to
verify the [Okta](https://okta.com) JWT sent by the front end API requests as
the `Bearer` token.

```jsx
// backend/helpers.ts

// ...

export const verifyOktaToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]

    oktaJwtVerifier
      .verifyAccessToken(bearerToken, 'api://default')
      .then((jwt) => {
        // the token is valid
        req.user = {
          // @ts-ignore
          sub: jwt.sub,
        }

        return next()
      })
      .catch((err) => {
        // a validation failed, inspect the error
        console.log('error', err)
      })
  } else {
    res.status(401).send({
      error: 'Unauthorized',
    })
  }
}
```

Once this helper is defined, we can use it globally to apply to all routes:

```jsx
// backend/app.ts
// initial imports ...
import { verifyOktaToken } from './helpers'

// ...

if (process.env.REACT_APP_OKTA) {
  app.use(verifyOktaToken)
}

// routes ...
```

### Adapting the front end

We need to update our front end React app to allow for authentication with
[Okta](https://okta.com) using the
[Okta React SDK](https://github.com/okta/okta-react).

First, we create a `AppOkta.tsx` container, based off of the `App.tsx`
component.

`AppOkta.tsx` uses the `useOktaAuth` React Hook, replaces the Sign Up and Sign
In routes with a `SecureRoute` and `LoginCallback` and wraps the component with
the `withOktaAuth` higher order component (HOC).

A `useEffect` hook is added to get the access token for the authenticated user
and send an `OKTA` event with the `user` and `token` objects to work with the
existing authentication layer (`authMachine.ts`). We define a route for
`implicit/callback` to render the `LoginCallback` component and a `SecureRoute`
for the root path.

```jsx
// src/containers/AppOkta.tsx
// initial imports ...
import {
  LoginCallback,
  SecureRoute,
  useOktaAuth,
  withOktaAuth,
} from '@okta/okta-react'

// ...

const AppOkta: React.FC = () => {
  const { authState, oktaAuth } = useOktaAuth()

  // ...

  useEffect(() => {
    if (authState.isAuthenticated) {
      oktaAuth.getUser().then((user) => {
        authService.send('OKTA', { user, token: oktaAuthState.accessToken })
      })
    }
  }, [authState, oktaAuth])

  // ...

  return (
    <div className={classes.root}>
      // ...
      {authState.matches('unauthorized') && (
        <>
          <Route path="/implicit/callback" component={LoginCallback} />
          <SecureRoute exact path="/" />
        </>
      )}
      // ...
    </div>
  )
}

export default withOktaAuth(AppOkta)
```

<Alert type="success">

The full
[AppOkta.tsx component](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppOkta.tsx)
is in the
[Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

</Alert>

Next, we update our entry point (`index.tsx`) to wrap our application with the
`<Security>` component from the
[Okta React SDK](https://github.com/okta/okta-react) providing `issuer`,
`clientId` from our Okta application, along with a `redirectUri` as props using
the `REACT_APP_OKTA` variables are defined in our `.env`.

```jsx
// src/index.tsx

// initial imports ...
import { OktaAuth } from '@okta/okta-auth-js'
import { Security } from '@okta/okta-react'
import AppOkta from './containers/AppOkta'

// ...

const oktaAuth = new OktaAuth({
  issuer: `https://${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`,
  clientId: process.env.REACT_APP_OKTA_CLIENTID,
  redirectUri: window.location.origin + '/implicit/callback',
})

ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={theme}>
      {process.env.REACT_APP_OKTA ? (
        <Security oktaAuth={oktaAuth}>
          <AppOkta />
        </Security>
      ) : (
        <App />
      )}
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
)
```

An update to our
[AppOkta.tsx component](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppOkta.tsx)
is needed to conditionally use the `oktaCypress` localStorage item.

In the code below, we conditionally apply a `useEffect` block based on being
under test with Cypress (using `window.Cypress`).

In addition, we will update the export to be wrapped with the `withOktaAuth`
higher order component only if we are not under test in Cypress. This allows our
application to work with the [Okta](https://okta.com) redirect login flow in
development/production but not when under test in Cypress.

```jsx
// src/containers/AppOkta.tsx
// initial imports ...
import { LoginCallback, SecureRoute, useOktaAuth, withOktaAuth } from "@okta/okta-react";

// ...

const AppOkta: React.FC = () => {
  const { authState, oktaAuth } = useOktaAuth();

  // ...

  // If under test in Cypress, get credentials from "oktaCypress" localstorage item and send event to our state management to log the user into the SPA
  if (window.Cypress) {
    useEffect(() => {
      const okta = JSON.parse(localStorage.getItem("oktaCypress")!);
      authService.send("OKTA", {
        user: okta.user,
        token: okta.token,
      });
    }, []);
  } else {
    useEffect(() => {
      if (authState.isAuthenticated) {
        oktaAuth.getUser().then((user) => {
          authService.send("OKTA", { user, token: oktaAuthState.accessToken });
        });
      }
    }, [authState, oktaAuth]);
  }

  // ...

  return (
    <div className={classes.root}>

      // ...

      {authState.matches("unauthorized") && (
        <>
          <Route path="/implicit/callback" component={LoginCallback} />
          <SecureRoute exact path="/" />
        </>
      )}

      // ...
    </div>
  );
};

// Conditional export wrapped with `withOktaAuth` if we are not under test in Cypress
let appOkta = window.Cypress ? AppOkta : withOktaAuth(AppOkta);
export default appOkta;
```
