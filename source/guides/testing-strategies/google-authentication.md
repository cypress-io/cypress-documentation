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

