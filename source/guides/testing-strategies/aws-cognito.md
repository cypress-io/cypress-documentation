---
title: Amazon Cognito Programmatic Authentication
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn


{% endnote %}

```
1. Describe the 3rd party: what it is, its purpose
2. 
```

[Amazon Cognito][cognito] is an authentication provider apart of [Amazon Web Services (AWS)][aws].  It "lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily" and scales to millions of users and supports sign-in with social identity providers, such as Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0."

Testing applications deployed with [Amazon Cognito][cognito] can use different strategies; mocking and testing the full stack.

The documentation for [Amazon Cognito][cognito] recommends using the [Auth library][awsamplifyauth] from the [AWS Amplify Framework][awsamplifyframework] to interact with a deployed [Amazon Cognito][cognito] instance.

Using the [AWS Amplify Framework Auth library][awsamplifyauth], we are able to programmatically drive the creation and authentication of users against a fully deployed back end.

This illustrates the limited code from the [AWS Amplify Framework][awsamplifyframework] needed to programmatically log an existing a user into an application.

```jsx
// Add 'aws-amplify' library into your application

// Configure Auth category with your Amazon Cognito credentials
Amplify.configure({
  Auth: {
    identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX', // Amazon Cognito Identity Pool ID
    region: 'XX-XXXX-X', // Amazon Cognito Region
  }
})

// Call Auth.signIn with user credentials
Auth.signIn(username, password)
  .then((user) => console.log(user))
  .catch((err) => console.log(err))
```

In a project using [AWS Amplify][awsamplifyframework], we can build two ways to login to our application: using our UI or programmatically via API.

An implementation for use with [AWS Cognito](https://github.com/cypress-io/cypress-realworld-app/blob/develop/src/containers/AppCognito.tsx) is available in the [Cypress Real World App][cypressrwa].

Clone the [Cypress Real World App][cypressrwa] and install the [AWS Amplify CLI][awsamplifycli] as follows:

```jsx
npm install -g @aws-amplify/cli
```

The [Cypress Real World App][cypressrwa] is initialized with the [AWS Cognito][cognito] setup via the [Amplify Authentication][amplifyauth].

With the [Amplify CLI][awsamplifycliconfig] configured for your environment, run the [amplify push][amplifypush] command to create the [Amplify Authentication][amplifyauth] resources in the cloud:

```jsx
amplify push
```

## Login to Amazon Cognito via API

Since this functionality will be use throughout our tests, it is best to define it's functionality in a reusable [Cypress Task][cypresstask].

We can create a [Cypress Task][cypresstask], `loginCognitoUserByApi`, to login via API to our application, thus bypassing the authentication UI and speeding up our tests.

First, we'll need to import configuration for our [AWS Cognito][cognito] instance.  Here, we are using the `aws-exports.js` supplied during the [AWS Amplify][awsamplify] build process. In addition, we required the necessary AWS modules and set their configuration.

```jsx
// cypress/plugins/index.js

const awsConfig = require('../../aws-exports').default
const AWS = require("aws-sdk")
const Amplify = require('aws-amplify').default
const { default: Auth } = require("@aws-amplify/auth")

const {
  aws_project_region,
  aws_cognito_identity_pool_id,
  aws_cognito_region,
  aws_user_pools_id,
  aws_user_pools_web_client_id,
} = awsConfig

AWS.config.update({ region: aws_project_region })
Amplify.configure(awsConfig)
```

Once complete, we can define our [Cypress Task][cypresstask] for `loginCognitoUserByApi` and dynamically set our [Amazon Cognito][cognito] environment variables for use throughout our tests. 

```jsx
// cypress/plugins/index.js

// ...

const loginCognitoUserByApi = async ({ username, password }) => {
  global.fetch = require("node-fetch");

  return await Auth.signIn({ username, password });
};

module.exports = (on, config) => {
  on("task", {
    loginCognitoUserByApi,
  });

  return config;
};
```

The complete plugins file defining our task.

```jsx
// cypress/plugins/index.js

const awsConfig = require("../../aws-exports").default;
const AWS = require("aws-sdk");
const Amplify = require("aws-amplify").default;
const { default: Auth } = require("@aws-amplify/auth");

const {
  aws_project_region,
  aws_cognito_identity_pool_id,
  aws_cognito_region,
  aws_user_pools_id,
  aws_user_pools_web_client_id,
} = awsConfig;

AWS.config.update({ region: aws_project_region });
Amplify.configure(awsConfig);

const loginCognitoUserByApi = async ({ username, password }) => {
  global.fetch = require("node-fetch");

  return await Auth.signIn({ username, password });
};

module.exports = (on, config) => {
  on("task", {
    loginCognitoUserByApi,
  });

  return config;
};
```

Once we have our `loginByCognitoApi` [Cypress Task][cypresstask] to perform the login, we can write a [Cypress Command][cypresscommands] to use the task and set the appropriate items in localStorage.

In this `loginByCognitoApi` command, we call our `loginByCognitoApi` task, save it to an alias (cognitoResponse), then use that response to set the items inside of localStorage for the UI to know that our user is logged into the application.

```jsx
// cypress/support/commands.js

Cypress.Commands.add('loginByCognitoApi', (username, password) =>
  {return cy
    .task("loginByCognitoApi", {
      username,
      password,
    })
    .as("cognitoResponse")
    .get("@cognitoResponse")
    .then((cognitoResponse) => {
      const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;
      window.localStorage.setItem(
        `${keyPrefixWithUsername}.idToken`,
        cognitoResponse.signInUserSession.idToken.jwtToken
      );
      window.localStorage.setItem(
        `${keyPrefixWithUsername}.accessToken`,
        cognitoResponse.signInUserSession.accessToken.jwtToken
      );
      window.localStorage.setItem(
        `${keyPrefixWithUsername}.refreshToken`,
        cognitoResponse.signInUserSession.refreshToken.token
      );
      window.localStorage.setItem(
        `${keyPrefixWithUsername}.clockDrift`,
        cognitoResponse.signInUserSession.clockDrift
      );
      window.localStorage.setItem(
        `${cognitoResponse.keyPrefix}.LastAuthUser`,
        cognitoResponse.username
      );
      window.localStorage.setItem("amplify-authenticator-authState", "signedIn");

      cy.visit("/");
    })}
)
```

Using our `loginByCognitoApi` command, we can write a test bypassing the login UI.

Before each test, we login to our application using a [fixture][cypressfixture] of predefined [Amazon Cognito][cognito] accounts previously provisioned for testing.

```jsx
describe('Cognito Authentication by API', () => {
  beforeEach(() => {
    cy.fixture('cognito-users').then((users) => {
      const user = users[0]
      cy.loginByCognitoApi(user.username, `s3cret123$`)
    });
  })

  it('display the home page after logged in', () => {
    cy.getBySel('new-post-button').should("be.visible")
  });
})
```


[cypressrwa]: https://github.com/cypress-io/cypress-realworld-app
[cypressrecipes]: https://github.com/cypress-io/cypress-example-recipes
[cypresscommands]: https://on.cypress.io/api/commands
[cypresstask]: https://on.cypress.io/api/task
[cypressfixture]: https://on.cypress.io/api/fixture
[aws]: https://aws.amazon.com
[cognito]: https://aws.amazon.com/cognito
[awsamplifyframework]: https://aws.amazon.com/amplify/framework/ 
[awsamplifyauth]: https://aws-amplify.github.io/amplify-js/api/classes/authclass.html
[awsamplifycli]: https://docs.amplify.aws/cli
[awsamplifycliconfig]: https://docs.amplify.aws/cli/start/install#configure-the-amplify-cli
[amplifyauth]: https://docs.amplify.aws/cli/auth/overview 
[amplifypush]: https://docs.amplify.aws/cli/start/workflows#amplify-push 
