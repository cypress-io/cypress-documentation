---
title: Why Cypress?
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- What Cypress is and why you should use it
- Our mission, and what we believe in
- Key Cypress features
{% endnote %}

# In a Nutshell

Cypress is a next generation front end testing tool built for the modern web. We address the key pain points developers and QA engineers face when testing modern applications.

We make it simple to:

- {% urlHash 'Set up tests' Setting-Up-Tests %}
- {% urlHash 'Write tests' Writing-Tests %}
- {% urlHash 'Run tests' Running-Tests %}
- {% urlHash 'Debug Tests' Debugging-Tests %}

Cypress is most often compared to Selenium; however Cypress is both fundamentally and architecturally different. Cypress is not constrained by the same restrictions as Selenium.

This enables you to **write faster**, **easier** and **more reliable** tests.

# Who Uses Cypress?

Our users are typically developers or QA engineers building web applications using modern JavaScript frameworks.

Cypress enables you to write all types of tests:

- End to end tests
- Integration tests
- Unit tests

Cypress can test anything that runs in a browser.

# Cypress Ecosystem

Cypress is a free, {% url "open source" https://github.com/cypress-io/cypress %}, {% url "locally installed" installing-cypress %} testing tool **and** a service for {% url 'recording your tests' dashboard-service %}.

- ***First:*** Cypress makes it easy to set up and start writing tests every day while you build your application locally. *TDD at its best!*
- ***Later:*** After building up a suite of tests and {% url "integrating Cypress" continuous-integration %} with your CI Provider, our  {% url 'Dashboard Service' dashboard-service %} can record your test runs. You'll never have to wonder: *Why did this fail?*

# Our Mission

Our mission is to build a thriving, open source ecosystem that enhances productivity, makes testing an enjoyable experience, and generates developer happiness. We hold ourselves accountable to champion a testing process **that actually works**.

We believe our documentation should be simple and approachable. This means enabling our readers to understand fully not just the **what** but the **why** as well.

We want to help developers build a new generation of modern applications faster, better, and without the stress and anxiety associated with managing tests.

We know that in order for us to be successful we must enable, nurture, and foster an ecosystem that thrives on open source. Every line of test code is an investment in **your codebase**, it will never be coupled to us as a paid service or company. Tests will be able to run and work independently, *always*.

We believe testing needs a lot of {% fa fa-heart %} and we are here to build a tool, a service, and a community that everyone can learn and benefit from. We're solving the hardest pain points shared by every developer working on the web. We believe in this mission and hope that you will join us to make Cypress a lasting ecosystem that helps everyone happy.

# Features

Cypress comes fully baked, batteries included. Here is a list of things it can do that no other testing framework can:

- **Time Travel:** Cypress takes snapshots as your tests run. Simply hover over commands in the {% url 'Command Log' test-runner#Command-Log %} to see exactly what happened at each step.
- **Debuggability:** Stop guessing why your tests are failing. {% url 'Debug directly' debugging %} from familiar tools like Chrome DevTools. Our readable errors and stack traces make debugging lightning fast.
- **Automatic Waiting:** Never add waits or sleeps to your tests. Cypress {% url 'automatically waits' introduction-to-cypress#Cypress-is-Not-Like-jQuery %} for commands and assertions before moving on. No more async hell.
- **Spies, Stubs, and Clocks:** Verify and {% url 'control the behavior' stubs-spies-and-clocks %} of functions, server responses, or timers. The same functionality you love from unit testing is right at your fingertips.
- **Network Traffic Control:** Easily {% url 'control, stub, and test edge cases' network-requests %} without involving your server. You can stub network traffic however you like.
- **Consistent Results:** Our architecture doesn’t use Selenium or WebDriver. Say hello to fast, consistent and reliable tests that are flake-free.
- **Screenshots and Videos:** View screenshots taken automatically on failure, or videos of your entire test suite when run from the CLI.

## {% fa fa-cog %} Setting Up Tests

There are no servers, drivers, or any other dependencies to install or configure. You can write your first passing test in 60 seconds.

{% video local /img/snippets/installing-cli.mp4 %}

## {% fa fa-code %} Writing Tests

Tests written in Cypress are easy to read and understand. Our API comes fully baked, on top of tools you are familiar with already.

{% video local /img/snippets/writing-tests.mp4 %}

## {% fa fa-play-circle %} Running Tests

Cypress runs as fast as your browser can render content. You can watch tests run in real time as you develop your applications. TDD FTW!

{% video local /img/snippets/running-tests.mp4 %}

## {% fa fa-bug %} Debugging Tests

Readable error messages help you to debug quickly. You also have access to all the developer tools you know and love.

{% video local /img/snippets/debugging.mp4 %}
