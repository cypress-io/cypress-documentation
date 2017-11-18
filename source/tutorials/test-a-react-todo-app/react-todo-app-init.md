---
title: 4. Testing data loading
comments: false
layout: video
containerClass: tutorial
---

{% video 241773142 %}

## What's covered

We will implement the initial data load for our todo app, leveraging {% url `cy.server()` server %} and {% url `cy.route()` route %} to stub the API call to load our data. We will use {% url 'fixture data' fixture#Shortcuts %} to seed our application state. As we iterate on our test and app code, we will create and use a {% url 'custom command' custom-commands %} to avoid unnecessary code duplication and keep our tests clean and readable. 

We will be using this list of todo objects to stub our XHR calls. For convenience, you can copy it from here and paste it in as you follow along.

```json
[
  {
    "id": 1,
    "name": "Buy Milk",
    "isComplete": false
  },
  {
    "id": 2,
    "name": "Buy Eggs",
    "isComplete": false
  },
  {
    "id": 3,
    "name": "Buy Bread",
    "isComplete": false
  },
  {
    "id": 4,
    "name": "Make French Toast",
    "isComplete": false
  }
]
```