# Real World App Overview

The Real World App (RWA) is an application created by the Cypress team that demonstrates real-world usage of Cypress testing methods, patterns, and workflows. Essentially, this application is a [Venmo](https://venmo.com/) clone. You can sign up for an account, add your bank account and send/receive money from your friends.

Throughout this section, we will be using this application to learn a whole host of new Cypress features, testing strategies and best practices. Before we begin, however, it is important that you clone this repo down onto your machine to get everything setup and working properly. We have made this process as simple and painless as possible.

You can find the repo [here](https://github.com/cypress-io/cypress-realworld-app).

It might be best to first fork a copy of the repo and then clone the forked version. You will then need to install all of the npm dependencies with.

```bash
yarn install
```

You can then run the application with

```bash
yarn dev
```

Once the application is up and running, a browser window should be automatically opened to `[localhost:3000](http://localhost:3000)` where you should see the Sign in page.

<DocsImage
src="/img/guides/real-world-testing/real-world-examples/real-world-app-overview/Screen_Shot_2021-06-28_at_11.32.22_AM.png"
alt="real world app sign in page"></DocsImage>

Make sure to also read the `[README.md](http://readme.md)` file for additional information and instructions.

You use one of the default users to log in to the app, or you can make your own too. We recommend you first login with one of the default users so you can see some of the sample data which is seeded in the app.

You can list out all of the default users with this command.

```bash
yarn list:dev:users
```

Every user's password is `s3cret` .

For example you can use the following username and password to log in.

```bash
Username: Katharina_Bernier
Password: s3cret
```

Once logged in, you will be presented with the main dashboard.

<DocsImage
src="/img/guides/real-world-testing/real-world-examples/real-world-app-overview/Screen_Shot_2021-06-28_at_11.35.29_AM.png"
alt="real world app dashboard"></DocsImage>

Make sure to click around on the various links in the top nav and sidebar and play around with the application. You don't need to spend a ton of time here, but having a general sense of what the app does will be very important for future lessons. Since we are going to be writing several tests for this application, we need to have a good understanding of what it does so that we can write the proper tests.

## Wrap Up

In this lesson we learned about the Real World App (RWA) and how to get it up and running on our local machines.
