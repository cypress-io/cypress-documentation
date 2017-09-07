---
title: Installing Cypress
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- How to install Cypress via `npm`.
- How to install Cypress via direct download.
- How to version and automate Cypress via `package.json`

{% endnote %}

# System Requirements

Cypress is a desktop application that is locally installed on your computer. The desktop application can be installed in the following operating systems:

OS | Path
:--- | :---
Mac  | `/Applications/Cypress.app`
Linux  | `/home/<user>/.cypress/Cypress`
Windows  | {% issue 74 'not currently supported' %}

There are no dependencies to install the Desktop Application, although if you want to {% url "use Cypress from the command line" https://www.npmjs.com/package/cypress %} you will need to have {% url "`node`" https://nodejs.org %} installed.

# Installing

## {% fa fa-terminal %} `npm` Install

Installing Cypress via `npm` is easy:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

This will install Cypress locally for this project, which is ideal for a few reasons:

- Cypress is a versioned dependency like any other dependency.
- Multiple versions of Cypress can co-exist on the same machine on a per-project basis.
- It simplifies {% url 'Continuous Integration' continuous-integration %} setup.

{% note info What is `npm`? %}
If you've never set up a Node.js project before, this is all probably a bit confusing! When you download Node.js, you automatically get `npm` installed on your computer. We recommend heading over to the {% url "Node.js website" https://nodejs.org/ %} and digging in.
{% endnote %}

## {% fa fa-download %} Direct Download

If you're not using `node` or `npm` in your project or you just want to try Cypress out quickly, you can always {% url "download Cypress directly here" http://download.cypress.io/desktop %}.

## {% fa fa-refresh %} Continuous Integration

Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %}.

# Opening Cypress

If you installed Cypress using our {% url "direct download" http://download.cypress.io/desktop %}, all you need to do is double click on the Cypress App icon and choose the folder where your project lives.

If you used `npm` to install, Cypress has now been installed to your `./node_modules` directory, with its binary executable accessible from `./node_modules/.bin`. This means you can call it from your project root either of the following ways:

**The long way with the full path**

```shell
./node_modules/.bin/cypress open
```

**Same with shortcut using `npm bin`**

```shell
$(npm bin)/cypress open
```

After a moment, the Cypress Desktop application will launch.

Once you're project is open in Cypress, you should see a message explaining that we've seeded your empty project with a few folders and an `example_spec.js` file. These files live in a new `./cypress` directory (also generated for you), and are very user friendly so don't be afraid have a look through them!

![Cypress First Run Experience](/img/guides/generated-files.png)

{% note info %}
This `example_spec.js` file is just for reference - it tests our {% url 'Kitchen Sink' kitchen-sink %} application and provides you with a preview of all the commands you can run with Cypress.
{% endnote %}

# {% fa fa-sign-in %} Logging In

After launching the Desktop Application, you will need to log in to Cypress. Logging in currently requires a {% url "GitHub" https://github.com/ %} account, if you do not have an account, you will have to {% url "create one" https://github.com/join %} to use Cypress.

***To Login:***

- Click **Log In with GitHub**.
- Authorize GitHub access to your account.

{% img no-border /img/guides/log-in-to-cypress-screen.png Log In to Cypress %}

# Managing Cypress with `package.json`

Take a look at your `package.json` file, which is where `npm` is configured for your project.

## Versioning Cypress

You should see that Cypress has been added as a development dependency versioned to the latest available version. If you need to install a specific version of Cypress, you can do so by modifying this version string and running `npm install`.

```json
{
  "devDependencies": {
    "cypress": "^0.20.0"
  }
}
```

## Automate Opening Cypress

In order to open Cypress easily, we recommend having `npm` execute a simple script for you. Do this by adding a `scripts` key to `package.json` with a nested key for the name of the script. For starters, name this script `cypress:open`, and have it simply call `cypress open`:

```json
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

Now you can invoke the command like so:

```shell
npm run cypress:open
```

...and Cypress will open right up for you!
