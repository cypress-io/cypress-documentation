---
title: Auth0 Authentication
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn
- Programmatically authenticate with  {% url "Auth0" https://auth0.com %} via a custom Cypress command
- Adapting your  {% url "Auth0" https://auth0.com %} application for programmatic authentication during testing

{% endnote %}

{% note success Why authenticate programmatically? %}

Typically logging in a user by authenticating via a third-party provider requires visiting login pages hosted on different domain in your app. Since each Cypress test is limited to visiting domains of the same origin, we can subvert visiting and testing third-party login pages by programmatically interacting with the third-party authentication API endpoints to login a user.

{% endnote %}

# Configure Auth0 Application for Testing with Cypress

**Note: This guide is setup for testing against an [Auth0][auth0] Single Page Application using the [Classic Universal Login Experience][auth0classiclogin].  This configuration is recommended for a "Test Tenant" and/or "Test API" setup for automated/end-to-end testing.**

On the Auth0 Dashboard, click the "Create Application" button, name your application and select "Single Page Application".

Once created, visit the [Application Settings][auth0applicationsettings] tab under your application.

Add your local development URL and port (e.g "http://localhost:3000") under the following sections:
  - Allowed Callback URLs
  - Allowed Logout URLs
  - Allowed Web Origins
  - Allowed Origins (CORS)

In the bottom of [Application Settings][auth0applicationsettings], click [Show Advanced Settings][auth0appadvancedsettings], select "Grant Types" tab and check "Password" (unchecked by default).

Next, click your Tenant icon (upper right avatar menu) to go to your [Tenant Settings][auth0tenantsettings].

On the [General][auth0tenantgeneral] tab go to the [API Authorization Settings][auth0tenantapiauth]
  - Set "Default Audience" to the Audience URL for the Application you are testing (e.g. https://your-api-id.auth0.com/api/v2/)
  - Set "Default Directory" to **"Username-Password-Authentication"**

Refer to the [Auth0 Tenant Settings documentation][auth0tenantsettingsdoc] for additional details.

# Cypress Setup for Testing Auth0

Below is a command to programmatically login into [Auth0][auth0], using the [/oauth/token endpoint][auth0OauthTokenEndpoint] and set an item in localStorage with the `access_token` and `id_token` it returns.  These will be used in our application code to verify we are authenticated under test.

```jsx
// cypress/support/commands.js
Cypress.Commands.add("loginByAuth0Api", (username: string, password: string) => {
cy.log(`Logging in as ${username}`);
  const client_id = Cypress.env("auth0_client_id");
  const client_secret = Cypress.env("auth0_client_secret");
  const audience = Cypress.env("auth0_audience");
  const scope = Cypress.env("auth0_scope");

  cy.request({
    method: "POST",
    url: `https://${Cypress.env("auth0_domain")}/oauth/token`,
    body: {
      grant_type: "password",
      username,
      password,
      audience,
      scope,
      client_id,
      client_secret,
    },
  }).then(({ body }) => {
    const claims = jwt.decode(body.id_token);
    const { nickname, name, picture, updated_at, email, email_verified, sub, exp } = claims;

    const item = {
      body: {
        ...body,
        decodedToken: {
          claims,
          user: {
            nickname,
            name,
            picture,
            updated_at,
            email,
            email_verified,
            sub,
          },
          audience,
          client_id,
        },
      },
      expiresAt: exp,
    };

    window.localStorage.setItem('auth0Cypress', JSON.stringify(item));

    cy.visit("/");
  });
});
```

An update to our [AppAuth0.tsx component](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppAuth0.tsx) is needed to conditionally use the `auth0Cypress` localStorage item.

In the code below, we conditionally apply a `useEffect` block based on being under test with Cypress (using `window.Cypress`).

In addition, we will update the export to be wrapped with `withAuthenticationRequired` if we are not under test in Cypress.  This allows our application to work with the [Auth0][auth0] redirect login flow in development/production but not when under test in Cypress.

```jsx
// src/containers/AppAuth0.tsx

// initial imports ...

import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

// ...

const AppAuth0 = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  // ...

  useEffect(() => {
      (async function waitForToken() {
        const token = await getAccessTokenSilently();
        authService.send("AUTH0", { user, token });
      })();
    }, [user, getAccessTokenSilently]);

  // If under test in Cypress, get credentials from "auth0Cypress" localstorage item and send event to our state management to log the user into the SPA
  if (window.Cypress) {
    useEffect(() => {
      const auth0 = JSON.parse(localStorage.getItem("auth0Cypress")!);
      authService.send("AUTH0", {
        user: auth0.body.decodedToken.user,
        token: auth0.body.access_token,
      });
    }, []);
  } else {
    useEffect(() => {
      (async function waitForToken() {
        const token = await getAccessTokenSilently();
        authService.send("AUTH0", { user, token });
      })();
    }, [isAuthenticated, user, getAccessTokenSilently]);
  }

  // ...

  const isLoggedIn =
    isAuthenticated &&
    (authState.matches("authorized") ||
      authState.matches("refreshing") ||
      authState.matches("updating"));

  return (
    <div className={classes.root}>
      // ...
    </div>
  );
};

// Conditional export wrapped with `withAuthenticationRequired` if we are not under test in Cypress.
let appAuth0 = window.Cypress ? AppAuth0 : withAuthenticationRequired(AppAuth0);
export default appAuth0
```

Below is our test to login as a user via [Auth0][auth0], complete the onboarding process and logout.

Note: The [runnable version of this test](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui-auth-providers/auth0.spec.ts) is in the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

```jsx
import { isMobile } from '../../support/utils'

describe('Auth0', function () {
  beforeEach(function () {
    cy.task('db:seed')

    cy.server()
    cy.route('POST', '/bankAccounts').as('createBankAccount')

    cy.loginByAuth0Api(Cypress.env('auth_username'), Cypress.env('auth_password'))
  })

  it('should allow a visitor to login, onboard and logout', function () {
    cy.contains('Get Started').should('be.visible')

    // Onboarding
    cy.getBySel('user-onboarding-dialog').should('be.visible')
    cy.getBySel('user-onboarding-next').click()

    cy.getBySel('user-onboarding-dialog-title').should('contain', 'Create Bank Account')

    cy.getBySelLike('bankName-input').type('The Best Bank')
    cy.getBySelLike('accountNumber-input').type('123456789')
    cy.getBySelLike('routingNumber-input').type('987654321')
    cy.getBySelLike('submit').click()

    cy.wait('@createBankAccount')

    cy.getBySel('user-onboarding-dialog-title').should('contain', 'Finished')
    cy.getBySel('user-onboarding-dialog-content').should('contain', 'You\'re all set!')
    cy.getBySel('user-onboarding-next').click()

    cy.getBySel('transaction-list').should('be.visible')

    // Logout User
    if (isMobile()) {
      cy.getBySel('sidenav-toggle').click()
    }

    cy.getBySel('sidenav-signout').click()

    cy.location('pathname').should('eq', '/')
  })

  it('shows onboarding', function () {
    cy.contains('Get Started').should('be.visible')
  })
})
```

# Adapting an Auth0 App for Testing

{% note info Note %}
The previous sections focused on the recommended Okta authentication practice within Cypress tests. To use this practice it is assumed you are testing an app appropriately built or adapted to use Okta.

The following sections provides guidance on building or adapting an app to use Okta authentication.

{% endnote %}

The {% url "Cypress Real World App" https://github.com/cypress-io/cypress-realworld-app %} is used and provides configuration and runnable code for both the React SPA and the Express back end.

The front end uses the {% url "auth0-react SDK" https://github.com/auth0/auth0-react %} for React Single Page Applications (SPA), which uses the {% url "auth0-spa-js SDK" https://github.com/auth0/auth0-spa-js %} underneath.  The back end uses {% url "express-jwt" https://github.com/auth0/express-jwt %} to validate JWT's against {% url "Auth0" https://auth0.com %}.


In addition, setup and configuration of [Auth0][auth0] and Cypress against and [Auth0 User Store](https://auth0.com/docs/connections/database#using-the-auth0-user-store) and authenticates users with an email/username and password are provided.


## Real World App Application Configuration

With our [Auth0][auth0] application and tenant setup, we need to add environment variables to our [Cypress Real World App]https://github.com/cypress-io/cypress-realworld-app `.env` or with the values from our [Auth0][auth0] application and for our test user.

```jsx
// .env
AUTH_USERNAME = 'username@domain.com'
AUTH_PASSWORD = 's3cret1234$'
AUTH0_CLIENT_SECRET = 'your-auth0-client-secret'
REACT_APP_AUTH_TOKEN_NAME = 'authAccessToken'
REACT_APP_AUTH0_DOMAIN = 'your-auth0-domain.auth0.com'
REACT_APP_AUTH0_CLIENTID = '1234567890'
REACT_APP_AUTH0_AUDIENCE = 'https://your-auth0-domain.auth0.com/api/v2/'
REACT_APP_AUTH0_SCOPE = 'openid email profile'
```

## Adapting the back end

In order to validate API requests from the frontend, we install [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa) and configure validation for JWT's from [Auth0](https://auth0.com).

```jsx
// backend/helpers.ts
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'

dotenv.config()

const auth0JwtConfig = {
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
}
```

Next, we'll define an Express middleware function to be use in our routes to verify the [Auth0][auth0] JWT sent by the front end API requests as the `Bearer` token.

```jsx
// backend/helpers.ts

// ...

export const checkJwt = jwt(auth0JwtConfig).unless({ path: ['/testData/*'] })
```

Once this helper is defined, we can use globally to apply to all routes:

```jsx
// backend/app.ts
// initial imports ...
import { checkJwt } from './helpers'

// ...

if (process.env.REACT_APP_AUTH0) {
  app.use(checkJwt)
}

// routes ...
```

## Adapting the front end

We need to update our front end React app to allow for authentication with [Auth0][auth0]. As mentioned above, the [auth0-react][auth0react] SDK for React Single Page Applications (SPA) is used.

First, we create a `AppAuth0.tsx` container to render our application as it is authenticated with [Auth0][auth0].  The component is identical to the `App.tsx` component, but uses the `useAuth0` React Hook, removes the need for the Sign Up and Sign In routes and wraps the component with the `withAuthenticationRequired` higher order function (HOC).

A `useEffect` hook is added to get the access token for the authenticated user and send an `AUTH0` event with the `user` and `token` objects to work with the existing authentication layer (`authMachine.ts`).

```jsx
// src/containers/AppAuth0.tsx

// initial imports ...

import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

// ...

const AppAuth0 = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  // ...

  useEffect(() => {
      (async function waitForToken() {
        const token = await getAccessTokenSilently();
        authService.send("AUTH0", { user, token });
      })();
    }, [user, getAccessTokenSilently]);

  // ...

  const isLoggedIn =
    isAuthenticated &&
    (authState.matches("authorized") ||
      authState.matches("refreshing") ||
      authState.matches("updating"));

  return (
    <div className={classes.root}>
      // ...
    </div>
  );
};

export default withAuthenticationRequired(AppAuth0);
```

Note: The full [AppAuth0.tsx component](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppAuth0.tsx) is in the [Cypress Real World App]https://github.com/cypress-io/cypress-realworld-app.

Next, we update our entry point (`index.tsx`) to wrap our application with the `<Auth0Provider>` from the [auth0-react][auth0react] SDK providing a custom `onRedirectCallback`.  We pass props for the Auth0 environment variables set in `.env` above, and render our `<AppAuth0>` component as the application.

```jsx
// src/index.tsx

// initial imports ...

import AppAuth0 from "./containers/AppAuth0";

// ..

const onRedirectCallback = (appState: any) => {
  history.replace((appState && appState.returnTo) || window.location.pathname);
};

if (process.env.REACT_APP_AUTH0) {
  ReactDOM.render(
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID!}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope={process.env.REACT_APP_AUTH0_SCOPE}
      onRedirectCallback={onRedirectCallback}
    >
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <AppAuth0 />
        </ThemeProvider>
      </Router>
    </Auth0Provider>,
    document.getElementById("root")
  );
} else {
  // render passport-local App.tsx
}
```

# Auth0 Rate Limiting Logins

Be aware of the rate limit statement in the Auth0 documentation:

Note: [Auth0 Rate Limit](https://auth0.com/docs/connections/database/rate-limits) - "If a user attempts to login 20 times per minute as the same user from the same location, regardless of having the correct credentials, the rate limit will come into effect. When this happens, the user can make 10 attempts per minute."

This limit can be reached as the size of a test suite grows along with enabling [parallelized runs][cypressparallelization] to speed up test run duration.

If you run into this rate limit, a programmatic approach can be added to the `loginByAuth0` command to clear a blocked IP prior to the test run.

Next you'll need to obtain a [API token][auth0mgmtapiaccesstoken] to interact with the [Auth0 Management API][auth0mgmtapi]. This token is a JSON Web Token (JWT) and it contains specific granted permissions for the API.

Add this token as environment variable `AUTH0_MGMT_API_TOKEN` to our [Cypress Real World App]https://github.com/cypress-io/cypress-realworld-app `.env` with your API token.

```jsx
// .env
// ... additional keys
AUTH0_MGMT_API_TOKEN = 'YOUR-MANAGEMENT-API-TOKEN'
```

With this token in place, we can add interaction with the [Auth0 Anomaly remove the blocked IP address endpoint][auth0mgmtremoveip] to our `loginByAuth0Api` command.  This will send a delete request to [Auth0 Management API][auth0mgmtapi] anomaly endpoint to unblock an IP that may become blocked during the test run.

@TODO: explain icanhazip

```jsx
Cypress.Commands.add('loginByAuth0Api', (username, password) => {
  // Useful when rate limited by Auth0
  cy.exec('curl -4 icanhazip.com')
    .its('stdout')
    .then((ip) => {
      cy.request({
        method: 'DELETE',
        url: `https://${Cypress.env('auth0_domain')}/api/v2/anomaly/blocks/ips/${ip}`,
        auth: {
          bearer: Cypress.env('auth0_mgmt_api_token'),
        },
      })
    })

  // ... remaining loginByAuth0Api command
})
```

https://github.com/cypress-io/cypress-realworld-app: https://github.com/cypress-io/cypress-realworld-app
[cypressrecipes]: https://github.com/cypress-io/cypress-example-recipes
[cypresscommands]: https://on.cypress.io/api/commands
[cypresstask]: https://on.cypress.io/api/task
[cypressfixture]: https://on.cypress.io/api/fixture
[cypressparallelization]: https://on.cypress.io/parallelization
[expressjwt]: https://github.com/auth0/express-jwt
[auth0mgmtapi]: https://auth0.com/docs/api/management/v2
[auth0mgmtremoveip]: https://auth0.com/docs/api/management/v2#!/Anomaly/delete_ips_by_id
[auth0mgmtapiaccesstoken]: https://auth0.com/docs/api/management/v2/tokens
[auth0classiclogin]: https://auth0.com/docs/universal-login/classic
[auth0tenantsettings]: https://manage.auth0.com/#/tenant
[auth0tenantsettingsdoc]: https://auth0.com/docs/dashboard/reference/settings-tenant
[auth0tenantgeneral]: https://auth0.com/docs/dashboard/reference/settings-tenant#general
[auth0tenantapiauth]: https://auth0.com/docs/dashboard/reference/settings-tenant#api-authorization-settings 
[auth0tenantsettingsmigrations]: https://auth0.com/docs/dashboard/reference/settings-tenant#migrations
[auth0applicationsettings]: https://auth0.com/docs/dashboard/reference/settings-application
[auth0appadvancedsettings]: https://auth0.com/docs/dashboard/reference/settings-application#advanced-settings
[auth0OauthTokenEndpoint]: https://auth0.com/docs/protocols/protocol-oauth2#token-endpoint