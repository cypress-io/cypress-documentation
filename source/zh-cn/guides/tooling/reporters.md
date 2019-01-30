---
title: Reporters
---

Because Cypress is built on top of Mocha, that means any reporter built for Mocha can be used with Cypress. Here is a list of built in Mocha reporters.

* {% url "Mocha's built-in reporters" https://mochajs.org/#reporters %}

We've also added the two most common 3rd party reporters for Mocha. These are built into Cypress and you can use them without installing anything.

* {% url "`teamcity`" https://github.com/cypress-io/mocha-teamcity-reporter %}
* {% url "`junit`" https://github.com/michaelleeallen/mocha-junit-reporter %}

Finally we support creating your own custom reporters or using any kind of 3rd party reporter.

{% note success %}
Did you know that you can use {% urlHash 'multiple reporters' Multiple-Reporters %} with Mocha?

This is especially useful when running in CI. Typically we see users using the default `spec` reporter to show up in `stdout` but then also generate an actual report file for `junit`.
{% endnote %}

# Custom Reporters

Cypress supports custom reporters, whether local to your project or installed through {% url "npm" https://www.npmjs.com/ %}.

## Local Reporters

Say you have the following directory structure:

```txt
> my-project
  > cypress
  > src
  > reporters
    - custom.js
```

### To specify the path to your custom reporter:

```javascript
// cypress.json

{
  "reporter": "reporters/custom.js"
}
```

The path above is relative to where your `cypress.json` is located.

### Command line

```shell
cypress run --reporter reporters/custom.js
```

We also support passing an absolute path to the reporter.

## npm Reporters

If you installed a custom reporter through npm, specify the package name:

```javascript
// cypress.json

{
  "reporter": "mochawesome"
}
```

### Command line

```shell
cypress run --reporter mochawesome
```

{% note info  %}
You need to install any peer dependencies the reporter requires, even if they're bundled with Cypress. For example, {% url "mochawesome" https://github.com/adamgruber/mochawesome %} requires `mocha` as a peer dependency. You will need to install `mocha` as a dev dependency of your own project for it to work.
{% endnote %}

# Reporter Options

Some reporters accept options that customize their behavior. These can be specified in your `cypress.json` or via the command line:

***cypress.json***

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output.xml",
    "toConsole": true
  }
}
```

### Command line

```shell
cypress run --reporter junit --reporter-options "mochaFile=results/my-test-output.xml,toConsole=true"
```

Reporter options differ depending on the reporter (and may not be supported at all). Refer to the documentation for the reporter you are using for details on which options are supported.

# Multiple Reporters

Oftentimes we see users wanting the ability to use multiple reporters. When running in CI, you might want to generate a report for `junit` or perhaps a `json` report. This is great, but by setting this reporter you won't receive any additional feedback while the tests are running!

The solution here is to use multiple reporters! You can have the benefit of both worlds.

We suggest using the excellent npm module:

{% fa fa-github %} {% url 'https://github.com/stanleyhlng/mocha-multi-reporters' %}

We use multiple reporters for every single one of our internal projects.

Here is an example for reference:

{% fa fa-github %} {% url 'https://github.com/cypress-io/cypress-example-docker-circle#generate-just-xml-report' %}
