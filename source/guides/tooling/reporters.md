---
title: Reporters
---

Because Cypress is built on top of Mocha, that means any reporter built for Mocha can be used with Cypress. Here is a list of built in Mocha reporters.

* {% url "Mocha's built-in reporters" https://mochajs.org/#reporters %}

We've also added the two most common 3rd party reporters for Mocha. These are built into Cypress and you can use them without installing anything.

* {% url "`teamcity`" https://github.com/cypress-io/mocha-teamcity-reporter %}
* {% url "`junit`" https://github.com/michaelleeallen/mocha-junit-reporter %}

Finally, we support creating your own custom reporters or using any kind of 3rd party reporter.

{% note success %}
Did you know that you can use {% urlHash 'multiple reporters' Multiple-Reporters %} with Mocha?

This is especially useful when running in CI. Typically we see users using the default `spec` reporter to show up in `stdout` but then also generate an actual report file for `junit`.
{% endnote %}

{% note %}
Once you've read through the documentation below, we invite you to experience the power of Cypress reporters via {% url "Section 9" https://github.com/cypress-io/testing-workshop-cypress/blob/master/slides/09-reporters/PITCHME.md %} of our open source {% url "testing workshop for Cypress" https://github.com/cypress-io/testing-workshop-cypress %}.
{% endnote %}

# Reporter

{% note info  %}
You need to install any peer dependencies the reporter requires, even if they're bundled with Cypress. For example, {% url "mochawesome" https://github.com/adamgruber/mochawesome %} requires `mocha` as a peer dependency. You will need to install `mocha` as a dev dependency of your own project for it to work.
{% endnote %}

## Custom Reporter

Custom reporters can be loaded through a relative or absolute path. These can be specified in your configuration file (`cypress.json` by default) or via {% url "command line" command-line %}

Say you have the following directory structure:

```txt
> my-project
  > cypress
  > src
  > reporters
    - custom.js
```

You then need to specify the path to your custom reporter.

### Config File

```json
{
  "reporter": "reporters/custom.js"
}
```

### Command Line

```shell
cypress run --reporter reporters/custom.js
```

## npm Reporters

Specify package name when using a custom reporter through npm.

### Config File

```json
{
  "reporter": "mochawesome"
}
```

### Command Line

```shell
cypress run --reporter mochawesome
```

# Reporter Options

Some reporters accept options that customize their behavior. These can be specified in your configuration file (`cypress.json` by default) or via {% url "command line" command-line %} options.

### Config File

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output.xml",
    "toConsole": true
  }
}
```

### Command Line

```shell
cypress run --reporter junit \
  --reporter-options "mochaFile=results/my-test-output.xml,toConsole=true"
```

{% note %}
The above configuration will output the JUnit report to `STDOUT` and save it into an XML file. Reporter options differ depending on the reporter (and may not be supported at all). Refer to the documentation for the reporter you are using for details on which options are supported.
{% endnote %}

## Report Per Spec

Starting with version 3 of Cypress, each spec is processed completely separately during `cypress run` execution. Thus each spec _overwrites_ the previous report file. To generate unique reports per spec, use the `[hash]` in the `mochaFile` filename.

The following configuration will create separate XML files in the `results` folder. You can then merge the output reports using a separate step using 3rd party tool. For example, for {% url Mochawesome https://github.com/adamgruber/mochawesome %} reporter, there is {% url mochawesome-merge https://github.com/antontelesh/mochawesome-merge %} tool.

### Config File

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output-[hash].xml"
  }
}
```

### Command Line

```shell
cypress run --reporter junit \
  --reporter-options "results/my-test-output-[hash].xml"
```

# Multiple Reporters

Oftentimes we see users wanting the ability to use multiple reporters. When running in CI, you might want to generate a report for `junit` and perhaps a `json` report. This is great, but by setting this reporter you won't receive any additional feedback while the tests are running!

The solution here is to use multiple reporters. You will have the benefit of both worlds.

We suggest using the excellent npm module: {% fa fa-github %} {% url 'https://github.com/you54f/cypress-multi-reporters' %}

We use multiple reporters for every single one of our internal projects.

# Multiple Reporters Examples

These examples were implemented in {% url https://github.com/cypress-io/cypress-example-circleci-orb %}.

## Spec to `STDOUT`, save JUnit XML files

We want to output a "spec" report to `STDOUT`, while saving Mochawesome JSON reports and then combine them into a single report.

We need to install additional dependencies including Mocha itself.

```shell
npm install --save-dev mocha cypress-multi-reporters mocha-junit-reporter
```

Then add a separate `reporter-config.json` file that enables `spec` and `junit` reporters and directs the `junit` reporter to save a separate XML files.

```json
{
  "reporterEnabled": "spec, mocha-junit-reporter",
  "reporterOptions": {
    "mochaFile": "cypress/results/results-[hash].xml"
  }
}
```

### Config File

```json
{
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  }
}
```

### Command Line

```shell
cypress run --reporter cypress-multi-reporters \
  --reporter-options configFile=reporter-config.json
```

{% note %}
We recommend deleting all files from the `cypress/results` folder before running this command, since each run will output new XML files. For example, we can add the npm script commands below to our `package.json`:
{% endnote %}

```json
{
  "scripts": {
    "delete:reports": "rm cypress/results/* || true",
    "prereport": "npm run delete:reports",
    "report": "cypress run --reporter cypress-multi-reporters --reporter-options configFile=reporter-config.json"
  }
}
```

And then call `npm run report`.

## Spec to `STDOUT`, produce a combined Mochawesome JSON file

This example is shown in the branch `spec-and-single-mochawesome-json` in {% url https://github.com/cypress-io/cypress-example-circleci-orb %}. We want to output a "spec" report to `STDOUT`, save an individual Mochawesome JSON file per test file, and then combine all JSON reports into a single report.

We need to install several dependencies.

```shell
npm install --save-dev mocha mochawesome mochawesome-merge mochawesome-report-generator
```

We need to configure the reporter in your {% url "configuration file (`cypress.json` by default)" configuration %} to skip the HTML report generation and save each individual JSON file in the `cypress/results` folder.

### Config File

```json
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "cypress/results",
    "overwrite": false,
    "html": false,
    "json": true
  }
}
```

### Command Line

```shell
cypress run --reporter mochawesome \
  --reporter-options reportDir=reporter-config.json,overwrite=false,html=false,json=true
```

Our run will generate files `cypress/results/mochawesome.json, cypress/results/mochawesome_001.json, ...`. Then we can combine them using the {% url 'mochawesome-merge' https://github.com/antontelesh/mochawesome-merge %} utility.

```shell
npx mochawesome-merge --reportDir cypress/results > mochawesome.json
```

We can now generate a combined HTML report from the `mochawesome.json` file using the {% url https://github.com/adamgruber/mochawesome-report-generator %}:

```shell
npx mochawesome-report-generator mochawesome.json
```

It generates the beautiful standalone HTML report file `mochawesome-report/mochawesome.html` shown below. As you can see all test results, timing information, and even test bodies are included.

{% imgTag /img/guides/mochawesome-report.png "Mochawesome HTML report" %}

For more information, see {% url 'Integrating Mochawesome reporter with Cypress's http://antontelesh.github.io/testing/2019/02/04/mochawesome-merge.html %}
