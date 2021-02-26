---
title: Google Authentication
---

{% note info %}

# {% fa fa-graduation-cap %} What you'll learn

- Programmatically authenticate with {% url "Google" https://google.com %} via a custom Cypress command
- Adapting your  {% url "Google" https://google.com %} application for programmatic authentication during testing
{% endnote %}

{% note success Why authenticate programmatically? %}
Typically, logging in a user within your app by authenticating via a third-party provider requires visiting login pages hosted on a different domain. Since each Cypress test is limited to visiting domains of the same origin, we can subvert visiting and testing third-party login pages by programmatically interacting with the third-party authentication API to login a user.
{% endnote %}


# Google Developer Console Setup

{% note info %}
The technique we will use for testing is to use the {% url "Google OAuth 2.0 Playground" https://developers.google.com/oauthplayground %} to create a refresh token that can be exchanged for an access token and id token during the testing phase.

{% endnote %}


## Google Project and Application Setup

The technique we will use for testing is to use the {% url "Google OAuth 2.0 Playground" https://developers.google.com/oauthplayground %} to create a refresh token that can be exchanged for an access token and id token during the testing phase.

First, a {% url "Google" https://google.com %} project is required.  If you don't already have a project, you can create one using the {% url "Google Cloud Console" https://console.cloud.google.com %}.  More information is available in the {% url "Google Cloud APIs Getting Started" https://cloud.google.com/apis/docs/getting-started#creating_a_google_project %}.

Next, use the {% url "Google API Console" https://console.developers.google.com/APIs %} to {% url "create credentials" https://console.developers.google.com/apis/credentials %} for your web application.  In the top navigation, click `Create Credentials` and choose `OAuth client ID`.

On the `Create OAuth client ID` page, enter the following:

- Application Type: Web Application
- Name: Your Web Application Name
- Authorized JavaScript origins: http://localhost:3000
- Authorized redirect URIs: http://localhost:3000/callback and https://developers.google.com/oauthplayground

Once saved, note the client ID and client secret.  You can find these under the "OAuth 2.0 Client IDs" on the {% url "Google API Credentials" https://console.developers.google.com/apis/credentials %} page.

## Using the Google OAuth 2.0 Playground to Create Testing Credentials

{% note info %}
The refresh token from this process is unique to the authenticated Google user. This process must be repeated for each user intended for testing.

{% endnote %}

Note the client id and client secret from the previous step and visit the {% url "Google OAuth 2.0 Playground" https://developers.google.com/oauthplayground %}.

Click the `gear` icon in the upper right corner to reveal a `OAuth 2.0 configuration` panel.  In this panel set the follow:
- OAuth flow: Server-side
- Access type: Offline
- Check `Use your own OAuth credentials`.
- OAuth Client ID: Your Google Application Client ID
- OAuth Client secret: Your Google Application Client Secret

Select the Google APIs needed for your application under `Step 1 (Select & authorize APIs)`, including the `https://www.googleapis.com/auth/userinfo.profile` endpoint under `Google OAuth2 API v2` at a minimum.  Click `Authorize APIs`.

Next, sign in with Google credentials to your test Google user account.

You will be redirected back to the {% url "Google OAuth 2.0 Playground" https://developers.google.com/oauthplayground %} under `Step 2 (Exchange authorization code for tokens)`.  Click the `Exchange authorization code for token` button.

You will be taken to `Step 3 (Configure request to API)`.  Note the returned refresh token to be used with testing.

# Setting Google app credentials in Cypress

To have access to test user credentials within our tests we need to configure Cypress to use the {% url "Google" https://google.com %} environment variables set in `.env` inside of the `cypress/plugins/index.js` file.

```jsx
// .env
REACT_APP_GOOGLE_CLIENTID = 'your-client-id'
REACT_APP_GOOGLE_CLIENT_SECRET = 'your-client-secret'
GOOGLE_REFRESH_TOKEN = 'your-refresh-token'
```

```jsx
// cypress/plugins/index.js
// initial imports ...

dotenv.config()

export default (on, config) => {
  // ...
  config.env.googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN
  config.env.googleClientId = process.env.REACT_APP_GOOGLE_CLIENTID
  config.env.googleClientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET

  // plugins code ...

  return config
}
```

# Custom Command for Google Authentication

Next, we will write a command named `loginByGoogleApi` to perform a programmatic login into {% url "Google" https://google.com %} and set an item in localStorage with the authenticated users details, which we will use in our application code to verify we are authenticated under test.

The `loginByGoogleApi` command will execute the following steps:

1. Use the refresh token from the {% url "Google OAuth 2.0 Playground" https://developers.google.com/oauthplayground %} to perform the programmatic login, exchanging the refresh token for an `access_token`.
2. Use the `access_token` returned to get the Google User profile.
3. Finally the `oktaCypress` localStorage item is set with the `access token` and user profile.

```jsx
// cypress/support/commands.js
Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google')
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body)
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      }

      window.localStorage.setItem('googleCypress', JSON.stringify(userItem))
      cy.visit('/')
    })
  })
})
```

With our Google app setup properly, necessary environment variables in place, and our `loginByGoogleApi` command implemented, we will be able to authenticate with Google while our app is under test.  Below is a test to login as a user via {% url "Google" https://google.com %}, complete the onboarding process and logout.

```jsx
describe('Google', function () {
  beforeEach(function () {
    cy.task('db:seed')
    cy.loginByGoogleApi()
  })

  it('shows onboarding', function () {
    cy.contains('Get Started').should('be.visible')
  })
})
```

{% note success Try it out %}
The [runnable version of this test](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui-auth-providers/google.spec.ts) is in the {% url "Cypress Real World App" https://github.com/cypress-io/cypress-realworld-app %}.
{% endnote %}

# Adapting an Google App for Testing

{% note info Note %}
The previous sections focused on the recommended Google authentication practice within Cypress tests. To use this practice it is assumed you are testing an app appropriately built or adapted to use Okta.

The following sections provides guidance on building or adapting an app to use Okta authentication.
{% endnote %}

The {% url "Cypress Real World App" https://github.com/cypress-io/cypress-realworld-app %} is used and provides configuration and runnable code for both the React SPA and the Express back end.

The front end uses the {% url "react-google-login component" https://github.com/anthonyjgrove/react-google-login %} and the back end uses {% url "express-jwt" https://github.com/auth0/express-jwt %} to validate the JWT provided by {% url "Google" https://google.com %}.

{% note info Note %}
Use the `yarn dev:google` command when starting the {% url "Cypress Real World App" https://github.com/cypress-io/cypress-realworld-app %}.
{% endnote %}


## Adapting the back end

In order to validate API requests from the frontend, we install [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa) and configure validation for JWT's from {% url "Google" https://google.com %}.

```jsx
// backend/helpers.ts
import jwt from 'express-jwt'
import jwksRsa from "jwks-rsa"

dotenv.config()
const googleJwtConfig = {
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
  }),
  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_GOOGLE_CLIENTID,
  issuer: 'accounts.google.com',
  algorithms: ['RS256'],
}
```

Next, we'll define an Express middleware function to be use in our routes to verify the {% url "Google" https://google.com %} JWT sent by the front end API requests as the `Bearer` token.

```jsx
// backend/helpers.ts
// ...
export const checkJwt = jwt(googleJwtConfig).unless({ path: ['/testData/*'] })
```

Once this helper is defined, we can use globally to apply to all routes:

```jsx
// backend/app.ts
// initial imports ...
import { checkJwt } from './helpers'

// ...
if (process.env.REACT_APP_GOOGLE) {
  app.use(checkJwt)
}
// routes ...
```

## Adapting the front end

We need to update our front end React app to allow for authentication with [Google](https://google.com). As mentioned above, the front end uses the {% url "react-google-login component" https://github.com/anthonyjgrove/react-google-login %} to perform the login.

First, we create a `AppGoogle.tsx` container to render our application as it is authenticated with [Google](https://google.com).  The component is identical to the `App.tsx` component, but has the addition of a `GoogleLogin` component in place of the original Sign Up and Sign In components.


A `useGoogleLogin` hook is added to send a `GOOGLE` event with the `user` and `token` objects to work with the existing authentication layer (`authMachine.ts`).


```jsx
// src/containers/AppGoogle.tsx
// initial imports ...
import { GoogleLogin, useGoogleLogin } from "react-google-login"
// ...
const AppGoogle= () => {
  // ...
  useGoogleLogin({
      clientId: process.env.REACT_APP_GOOGLE_CLIENTID!,
      onSuccess: (res) => {
      authService.send("GOOGLE", { user: res.profileObj, token: res.tokenId });
    },
    cookiePolicy: "single_host_origin",
    isSignedIn: true,
  });
  // ...
  const isLoggedIn =
    isAuthenticated &&
    (authState.matches("authorized") ||
      authState.matches("refreshing") ||
      authState.matches("updating"));
  return (
    <div className={classes.root}>
      // ...
      {authState.matches("unauthorized") && (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENTID!}
              buttonText="Login"
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </Container>
      )}
    </div>
  );
};
export default AppGoogle;
```


{% note info %}
The full [AppGoogle.tsx component](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppGoogle.tsx) is in the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

{% endnote %}

Next, we update our entry point (`index.tsx`) to conditionally load the `AppGoogle` component if we start the application with the `REACT_APP_GOOGLE` environment variable set to `true`.

```jsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { history } from "./utils/historyUtils";
import App from "./containers/App";
import AppGoogle from "./containers/AppGoogle";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#fff",
    },
  },
});
ReactDOM.render(
  <Router history={history}>
    <ThemeProvider theme={theme}>
      {process.env.REACT_APP_GOOGLE ? <AppGoogle /> : <App />}
    </ThemeProvider>
  </Router>,
  document.getElementById("root")
);
```
