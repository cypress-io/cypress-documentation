---
title: 6. Toggling and debugging
comments: false
layout: video
containerClass: tutorial
---

{% video 242961930 %}

## What's covered

We will create a test for todo item toggling. As we implement the toggle feature, we will encounter a problem with our code and look at how Cypress can help us debug our code. We will use the {% url "Cypress Command Log" test-runner#Command-Log %} to narrow down our problem. Then, we can use the {% url "Chrome DevTools right in the Cypress Test Runner" debugging#Using-the-DevTools %} to step through the code to dig into the issue. We'll even see how we can update application state while debugging and let our test confirm our theory about the cause of the bug. Once the debugging is complete, we will refactor our code to be less error prone, relying on the test to help us get it right.
