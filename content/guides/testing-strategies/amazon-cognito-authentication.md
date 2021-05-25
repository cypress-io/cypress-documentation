---
title: Amazon Cognito Authentication
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- Programmatically authenticate with [Amazon Cognito](https://aws.amazon.com/cognito) via a custom Cypress command
- Adapting your [Amazon Cognito](https://aws.amazon.com/cognito) application for programmatic authentication during testing

</Alert>

<Alert type="success">

<strong class="alert-header">Why authenticate programmatically?</strong>

Typically, logging in a user within your app by authenticating via a third-party provider requires visiting login pages hosted on a different domain. Since each Cypress test is limited to visiting domains of the same origin, we can subvert visiting and testing third-party login pages by programmatically interacting with the third-party authentication API to login a user.

</Alert>

## What is Amazon Cognito?

Amazon [Cognito](https://aws.amazon.com/cognito) is an authentication provider apart of [Amazon Web Services (AWS)](https://aws.amazon.com).

It "lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily" and "scales to millions of users and supports sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0."

## Programmatic Authentication with Amazon Cognito

The documentation for [Amazon Cognito](https://aws.amazon.com/cognito) recommends using the [AWS Amplify Framework Authentication Library](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html) from the [AWS Amplify Framework](https://aws.amazon.com/amplify/framework/) to interact with a deployed [Amazon Cognito](https://aws.amazon.com/cognito) instance.

Using the [AWS Amplify Framework Authentication Library](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html), we are able to programmatically drive the creation and authentication of users against a fully deployed back end.

This illustrates the limited code from the [AWS Amplify Framework](https://aws.amazon.com/amplify/framework/) needed to programmatically log an existing a user into an application.

```jsx
// Add 'aws-amplify' library into your application

// Configure Auth category with your Amazon Cognito credentials
Amplify.configure({
  Auth: {
    identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX', // Amazon Cognito Identity Pool ID
    region: 'XX-XXXX-X', // Amazon Cognito Region
  },
})

// Call Auth.signIn with user credentials
Auth.signIn(username, password)
  .then((user) => console.log(user))
  .catch((err) => console.log(err))
```

## Amazon Cognito Setup

If not already setup, you will need to [create an account](https://docs.amplify.aws/start/getting-started/installation/q/integration/react#sign-up-for-an-aws-account) with [Amazon Web Services (AWS)](https://aws.amazon.com).

An [Amazon Cognito](https://aws.amazon.com/cognito) integration is available in the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

Clone the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) and install the [AWS Amazon Amplify CLI](https://docs.amplify.aws/CLI) as follows:

```jsx
npm install -g @aws-amplify/cli
```

The [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) is configured with an optional
[Amazon Cognito](https://aws.amazon.com/cognito) instance via the [AWS Amplify Framework Authentication Library](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html).

The [AWS Amazon Amplify CLI](https://docs.amplify.aws/CLI) is used to provision the [Amazon Web Services (AWS)](https://aws.amazon.com) infrastructure needed to configure your environment and cloud resources.

First, run the [amplify init](https://docs.amplify.aws/cli/start/workflows#initialize-new-project) command to initialize the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app). This will provision the project with your [AWS](https://aws.amazon.com) credentials.

```jsx
amplify init
```

Next, run the [amplify push](https://docs.amplify.aws/cli/start/workflows#amplify-push) command to create the [Amazon Cognito](https://aws.amazon.com/cognito) resources in the cloud:

```jsx
amplify push
```

<Alert type="info">

<strong class="alert-header">Note</strong>

Use the `yarn dev:cognito` command when starting the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

</Alert>

## Setting Amazon Cognito app credentials in Cypress

First, we need to configure Cypress to use the [AWS Cognito](https://aws.amazon.com/cognito) environment variables set in `.env` inside of the `cypress/plugins/index.js` file. In addition, we are using the `aws-exports.js` supplied during the [AWS Amplify CLI](https://docs.amplify.aws/CLI) build process.

```jsx
// cypress/plugins/index.js
// initial imports ...

const awsConfig = require(path.join(__dirname, '../../aws-exports-es5.js'))

dotenv.config()

export default (on, config) => {
  // ...
  config.env.cognito_username = process.env.AWS_COGNITO_USERNAME
  config.env.cognito_password = process.env.AWS_COGNITO_PASSWORD
  config.env.awsConfig = awsConfig.default

  // plugins code ...

  return config
}
```

## Custom Command for Amazon Cognito Authentication

Next, we'll write a command to perform a programmatic login into [Amazon Cognito](https://aws.amazon.com/cognito) and set items in localStorage with the authenticated users details, which we will use in our application code to verify we are authenticated under test.

In this `loginByCognitoApi` command, we call `Auth.signIn`, then use that response to set the items inside of localStorage for the UI to know that our user is logged into the application.

```jsx
// cypress/support/auth-provider-commands/cognito.ts

import Amplify, { Auth } from 'aws-amplify'

Amplify.configure(Cypress.env('awsConfig'))

// Amazon Cognito
Cypress.Commands.add('loginByCognitoApi', (username, password) => {
  const log = Cypress.log({
    displayName: 'COGNITO LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  })

  log.snapshot('before')

  const signIn = Auth.signIn({ username, password })

  cy.wrap(signIn, { log: false }).then((cognitoResponse) => {
    const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.idToken`,
      cognitoResponse.signInUserSession.idToken.jwtToken
    )

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.accessToken`,
      cognitoResponse.signInUserSession.accessToken.jwtToken
    )

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.refreshToken`,
      cognitoResponse.signInUserSession.refreshToken.token
    )

    window.localStorage.setItem(
      `${keyPrefixWithUsername}.clockDrift`,
      cognitoResponse.signInUserSession.clockDrift
    )

    window.localStorage.setItem(
      `${cognitoResponse.keyPrefix}.LastAuthUser`,
      cognitoResponse.username
    )

    window.localStorage.setItem('amplify-authenticator-authState', 'signedIn')
    log.snapshot('after')
    log.end()
  })

  cy.visit('/')
})
```

Finally, we can use our `loginByCognitoApi` command in at test. Below is our test to login as a user via [Amazon Cognito](https://aws.amazon.com/cognito), complete the onboarding process and logout.

<Alert type="success">

The [runnable version of this test](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/ui-auth-providers/cognito.spec.ts) is in the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

</Alert>

```jsx
describe('Cognito', function () {
  beforeEach(function () {
    // Seed database with test data
    cy.task('db:seed')

    // Programmatically login via Amazon Cognito API
    cy.loginByCognitoApi(
      Cypress.env('cognito_username'),
      Cypress.env('cognito_password')
    )
  })

  it('shows onboarding', function () {
    cy.contains('Get Started').should('be.visible')
  })
})
```

## Adapting an Amazon Cognito App for Testing

The [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) is used and provides configuration and runnable code for both the React SPA and the Express back end.

The front end uses the [AWS Amplify Framework Authentication Library](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html). The back end uses the [express-jwt](https://github.com/auth0/express-jwt) to validate JWTs from [Amazon Cognito](https://aws.amazon.com/cognito).

### Adapting the back end

In order to validate API requests from the frontend, we install [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa) and configure validation for JWT's from [Amazon Cognito](https://aws.amazon.com/cognito).

```jsx
// backend/helpers.ts
// ... initial imports
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'

// ...

const awsCognitoJwtConfig = {
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://cognito-idp.${awsConfig.aws_cognito_region}.amazonaws.com/${awsConfig.aws_user_pools_id}/.well-known/jwks.json`,
  }),

  issuer: `https://cognito-idp.${awsConfig.aws_cognito_region}.amazonaws.com/${awsConfig.aws_user_pools_id}`,
  algorithms: ['RS256'],
}

export const checkCognitoJwt = jwt(awsCognitoJwtConfig).unless({
  path: ['/testData/*'],
})
```

Once this helper is defined, we can use globally to apply to all routes:

```jsx
// backend/app.ts
// initial imports ...
import { checkCognitoJwt } from './helpers'

// ...

if (process.env.REACT_APP_AWS_COGNITO) {
  app.use(checkCognitoJwt)
}

// routes ...
```

### Adapting the front end

We need to update our front end React app to allow for authentication with [Amazon Cognito](https://aws.amazon.com/cognito) using the [AWS Amplify Framework Authentication Library](https://aws-amplify.github.io/amplify-js/api/classes/authclass.html).

First, we create a `AppCognito.tsx` container, based off of the `App.tsx` component.

A `useEffect` hook is added to get the access token for the authenticated user and send an `COGNITO` event with the `user` and `token` objects to work with the existing authentication layer (`authMachine.ts`). We use the `AmplifyAuthenticator` component to provide the login form from [Amazon Cognito](https://aws.amazon.com/cognito).

```jsx
// src/containers/AppOkta.tsx
// initial imports ...
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

import awsConfig from "../aws-exports";

Amplify.configure(awsConfig);

// ...

const AppCognito: React.FC = () => {

  // ...

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        authService.send("COGNITO", { user: authData });
      }
    });
  }, []);

  // ...

  return isLoggedIn ? (
    // ...
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignUp slot="sign-up" usernameAlias="email" />
        <AmplifySignIn slot="sign-in" usernameAlias="email" />
      </AmplifyAuthenticator>
    </Container>
  );
};

export default AppCognito;
```

<Alert type="success">

<strong class="alert-header">Try it out</strong>

The complete [AppCognito.tsx component](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppCognito.tsx) is in the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app).

</Alert>

Next, we update our entry point (`index.tsx`) to use our `AppCognito.tsx` component.

```jsx
// src/index.tsx
// ... initial imports
import AppCognito from './containers/AppCognito'

// ...

if (process.env.REACT_APP_AWS_COGNITO) {
  ReactDOM.render(
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <AppCognito />
      </ThemeProvider>
    </Router>,
    document.getElementById('root')
  )
}
```
