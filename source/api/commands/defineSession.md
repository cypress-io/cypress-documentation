---
title: defineSession
containerClass: experimental
---

{% note warning %}
{% fa fa-warning orange %} **This is an experimental feature. In order to use it, you must set the {% url "`experimentalSessionSupport`" experiments %} configuration option to `true`.**
{% endnote %}

Defines a `Session`. A `Session` a collection of `cookies` and `localStorage` across all domains that may be restored to at any point during a test with the accompanying {% url `cy.useSession()` useSession %} command.

## Usage
```ts
cy.defineSession(name, steps, options?)
cy.defineSession(options)
```

## Arguments

**{% fa fa-angle-right %} name** ***(String)***
The name of the `Session` to be referenced later within a {% url `cy.useSession()` useSession %} command.

**{% fa fa-angle-right %} steps** ***(Function)***
A function containing the Cypress commands needed to set `Session` data. For example, logging into your application.

**{% fa fa-angle-right %} options** ***(Object)***

Option | Default | Description
--- | --- | ---
`name` | `null` | The name of the session
`steps` | `null` | A function containing the Cypress commands for intializing `Session` state
`after` | `null` | A function that always runs **after** {% url `cy.useSession()` useSession %} for both new and saved `Sessions`. 
`before` | `null` | A function that always runs **before** {% url `cy.useSession()` useSession %} for both new and saved `Sessions`. 
`verify` | `null` | A function that, when returns false, invalidates and recreates the session during {% url `cy.useSession()` useSession %}

## Yields {% helper_icon yields %}

Unlike most Cypress commands, `cy.defineSession()` is *synchronous* and returns the `Session` reference instead of a Promise-like chain-able object. This allows you to assign the `Session` object and pass the reference directly to {% url `cy.useSession()` useSession %}. You may also place `cy.defineSession()` calls in a `cypress/support` and export the session objects for use in multiple spec files.

**Note:** You may also ignore the return value and reference the `Session` by name in {% url `cy.useSession()` useSession %}
