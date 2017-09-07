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

Cypress is a desktop application that is locally installed on your computer.

{% note info %}
The desktop application manages your local projects. The actual testing will be done in a **browser**, not the desktop application.
{% endnote %}

The desktop application can be installed in the following operating systems:

OS | Path
:--- | :---
Mac  | `/Applications/Cypress.app`
Linux  | `/home/<user>/.cypress/Cypress`
Windows  | {% issue 74 'not currently supported' %}

There are no dependencies to install the Desktop Application, although if you want to {% url "use Cypress from the command line" https://www.npmjs.com/package/cypress %} you will need to have {% url "`node`" https://nodejs.org %} installed.

# {% fa fa-terminal %} Installing

Installing Cypress is easy:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

This will install Cypress locally for this project, which is ideal for a few reasons:

- Cypress is a versioned dependency like any other dependency.
- Multiple versions of Cypress can co-exist on the same machine on a per-project basis.
- It simplifies Continuous Integration setup.

{% fa fa-download %} You can also {% url "download Cypress directly here" http://download.cypress.io/desktop %}.

{% note info What is `npm`? %}
If you've never set up a NodeJS project before, this is all probably a bit confusing! We recommend heading over to the {% url "NodeJS website" https://nodejs.org/ %} and digging in.
{% endnote %}

{% note info What about installing in CI? %}
Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %}.
{% endnote %}

# {% fa fa-terminal %} Opening Cypress

Cypress has now been installed to our `./node_modules` directory, with its binary executable accessible from `./node_modules/.bin`. This means we can call it from our project root either of the following ways:

**The long way with the full path -**

```shell
./node_modules/.bin/cypress open
```

**Same with shortcut using `npm bin` -**

```shell
$(npm bin)/cypress open
```

After a moment, the Cypress Desktop application will launch.

{% note info %}
The {% url "cypress npm package" https://www.npmjs.com/package/cypress %} contains many commands such as `cypress run` and `cypress verify` that you may find useful. See the {% url "Command Line Docs" command-line %}.
{% endnote %}

# {% fa fa-sign-in %} Logging In

After launching the Desktop Application, you will need to log in to Cypress. Logging in currently requires a {% url "Github" https://github.com/ %} account, if you do not have an account, you will have to {% url "create one" https://github.com/join %} to use Cypress.

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

In order to run Cypress easily, we recommend having `npm` execute a simple script for you. Do this by adding a `scripts` key to `package.json` with a nested key for the name of the script. For starters, name this script `cypress:open`, and have it simply call `cypress open`:

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
