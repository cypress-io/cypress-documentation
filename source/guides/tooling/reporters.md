---
title: Reporters
---

Because Cypress is built on top of Mocha, that means any reporter built for Mocha can be used with Cypress. Here is a list of built in Mocha reporters.

* {% url "Mocha's built-in reporters" https://mochajs.org/#reporters %}

By default, Cypress uses the `spec` reporter to output information to `STDOUT`.

We've also added the two most common 3rd party reporters for Mocha. These are built into Cypress and you can use them without installing anything.

* {% url "`teamcity`" https://github.com/cypress-io/mocha-teamcity-reporter %}
* {% url "`junit`" https://github.com/michaelleeallen/mocha-junit-reporter %}

Finally, we support creating your own custom reporters or using any kind of 3rd party reporter.

{% note %}
Once you've read through the documentation below, we invite you to experience the power of Cypress reporters via {% url "Section 9" https://github.com/cypress-io/testing-workshop-cypress/blob/master/slides/09-reporters/PITCHME.md %} of our open source {% url "testing workshop for Cypress" https://github.com/cypress-io/testing-workshop-cypress %}.
{% endnote %}

# Custom reporter

## Installed locally

You can load {% url "custom Mocha reporters" https://mochajs.org/api/tutorial-custom-reporter.html %} through a relative or absolute path. These can be specified in your configuration file (`cypress.json` by default) or via the {% url "command line" command-line %}.

For example, if you have the following directory structure:

```txt
> my-project
  > cypress
  > src
  > reporters
    - custom.js
```

You would specify the path to your custom reporter in either of the ways below.

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

## Installed via npm

When using custom reporters via npm, specify the package name.

### Config file

```json
{
  "reporter": "mochawesome"
}
```

### Command line

```shell
cypress run --reporter mochawesome
```

# Reporter Options

Some reporters accept options that customize their behavior. These can be specified in your configuration file (`cypress.json` by default) or via {% url "command line" command-line %} options.

Reporter options differ depending on the reporter (and may not be supported at all). Refer to the documentation for the reporter you are using for details on which options are supported.

The below configuration will output the JUnit report to `STDOUT` and save it into an XML file. 

### Config file

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
cypress run --reporter junit \
  --reporter-options "mochaFile=results/my-test-output.xml,toConsole=true"
```

# Merging reports across spec files

Each spec file is processed completely separately during each `cypress run` execution. Thus each spec run _overwrites_ the previous report file. To preserve unique reports for each specfile, use the `[hash]` in the `mochaFile` filename.

The following configuration will create separate XML files in the `results` folder. You can then merge the reported output in a separate step using a 3rd party tool. For example, for the {% url Mochawesome https://github.com/adamgruber/mochawesome %} reporter, you can use the {% url mochawesome-merge https://github.com/antontelesh/mochawesome-merge %} tool.

### Config file

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output-[hash].xml"
  }
}
```

### Command line

```shell
cypress run --reporter junit \
  --reporter-options "mochaFile=results/my-test-output-[hash].xml"
```

# Multiple reporters

Oftentimes we see users wanting the ability to use multiple reporters. When running in CI, you might want to generate a report for `junit` and perhaps a `json` report. This is great, but by setting this reporter you won't receive any additional feedback while the tests are running!

The solution here is to use multiple reporters. You will have the benefit of both worlds.

We suggest using the npm module: {% fa fa-github %} {% url 'https://github.com/you54f/cypress-multi-reporters' %}

We use multiple reporters for every single one of our internal projects.

The below examples were implemented in {% url https://github.com/cypress-io/cypress-example-circleci-orb %}.

## Examples

### Spec to `STDOUT`, save JUnit XML files

We want to output a `spec` report to `STDOUT`, while saving a JUnit XML file for each spec file.

We need to install additional dependencies:  

* {% url "`cypress-multi-reporters`" https://github.com/you54f/cypress-multi-reporters %}: enables multiple reporters
* {% url "`mocha-junit-reporter`" https://github.com/michaelleeallen/mocha-junit-reporter %} the actual junit reporter, as we cannot use the `junit` reporter that comes with Cypress

```shell
npm install --save-dev cypress-multi-reporters mocha-junit-reporter
```

Specify your reporter and reporterOptions in your configuration file (`cypress.json` by default) or via the {% url "command line" command-line %}.

### Config file

```json
{
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  }
}
```

### Command line

```shell
cypress run --reporter cypress-multi-reporters \
  --reporter-options configFile=reporter-config.json
```

Then add the separate `reporter-config.json` file (defined in your configuration) to enable `spec` and `junit` reporters and direct the `junit` reporter to save separate XML files.

```json
{
  "reporterEnabled": "spec, mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": "cypress/results/results-[hash].xml"
  }
}
```

We recommend deleting all files from the `cypress/results` folder before running this command, since each run will output new XML files. For example, you can add the npm script commands below to your `package.json` then call `npm run report`.

```json
{
  "scripts": {
    "delete:reports": "rm cypress/results/* || true",
    "prereport": "npm run delete:reports",
    "report": "cypress run --reporter cypress-multi-reporters --reporter-options configFile=reporter-config.json"
  }
}
```

In case you want to combine generated XML files into a single one, {% url junit-report-merger https://www.npmjs.com/package/junit-report-merger %} can be added. For example, to combine all files into `cypress/results/combined-report.xml` the `combine:reports` script can be added.

```json
{
  "scripts": {
    "delete:reports": "rm cypress/results/* || true",
    "combine:reports": "jrm cypress/results/combined-report.xml \"cypress/results/*.xml\"",
    "prereport": "npm run delete:reports",
    "report": "cypress run --reporter cypress-multi-reporters --reporter-options configFile=reporter-config.json",
    "postreport": "npm run combine:reports"
  }
}
```

### Spec to `STDOUT`, produce a combined Mochawesome JSON file

This example is shown in the branch `spec-and-single-mochawesome-json` in {% url https://github.com/cypress-io/cypress-example-circleci-orb %}. We want to output a "spec" report to `STDOUT`, save an individual Mochawesome JSON file per test file, and then combine all JSON reports into a single report.

We need to install some additional dependencies.

```shell
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

We need to configure the reporter in your {% url "configuration file (`cypress.json` by default)" configuration %} to skip the HTML report generation and save each individual JSON file in the `cypress/results` folder.

### Config file

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

### Command line

```shell
cypress run --reporter mochawesome \
  --reporter-options reportDir="cypress/results",overwrite=false,html=false,json=true
```

Our run will generate files `cypress/results/mochawesome.json, cypress/results/mochawesome_001.json, ...`. Then we can combine them using the {% url 'mochawesome-merge' https://github.com/antontelesh/mochawesome-merge %} utility.

```shell
npx mochawesome-merge "cypress/results/*.json" > mochawesome.json
```

We can now generate a combined HTML report from the `mochawesome.json` file using the {% url https://github.com/adamgruber/mochawesome-report-generator %}:

```shell
npx marge mochawesome.json
```

It generates the beautiful standalone HTML report file `mochawesome-report/mochawesome.html` shown below. As you can see all test results, timing information, and even test bodies are included.

{% imgTag /img/guides/mochawesome-report.png "Mochawesome HTML report" %}

For more information, see {% url 'Integrating Mochawesome reporter with Cypress's http://antontelesh.github.io/testing/2019/02/04/mochawesome-merge.html %}

{% history %}
{% url "4.4.2" changelog %} | Custom Mocha reporters updated to use the version of Mocha bundled with Cypress. No need to install `mocha` separately to use custom reporters.
{% endhistory %}
