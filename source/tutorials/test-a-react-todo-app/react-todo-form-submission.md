---
title: 3. Testing form submission
comments: false
layout: video
containerClass: tutorial
---

{% video 241063147 %}

## What's covered

We will implement form submission for our todo app, leveraging {% url `cy.server()` server %} and {% url `cy.route()` route %} to stub calls to our API. We will iterate on our test and implementation, focusing on the application's "happy path" first. Once our form is working, we'll use another stubbed XHR call to setup a failure scenario and implement the code to properly display an error message. 