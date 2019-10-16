# Cypress Documentation [![Cypress Dashboard](https://img.shields.io/badge/cypress-dashboard-brightgreen.svg)](https://dashboard.cypress.io/#/projects/ma3dkn/runs) [![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg)](https://github.com/cypress-io/cypress-documentation/labels/first-timers-only) [![renovate-app badge][renovate-badge]][renovate-app]

The code for Cypress Documentation including Guides, API, Examples, Dashboard & FAQ found at https://docs.cypress.io.

![Cypress Documentation Preview](https://user-images.githubusercontent.com/1271364/32280553-aa89695e-bef2-11e7-9cea-c2e99406eed0.png)

## CI status

- [![CircleCI](https://circleci.com/gh/cypress-io/cypress-documentation/tree/develop.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-documentation/tree/develop) `develop` branch
- [![CircleCI](https://circleci.com/gh/cypress-io/cypress-documentation/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-documentation/tree/master) `master` branch

## Getting Started

You should be able to get the documentation site running locally very quickly,
please see our [Contributing Guideline](/CONTRIBUTING.md).

Cypress is [first time OSS contributor friendly](http://www.firsttimersonly.com/). See [these issues](https://github.com/cypress-io/cypress-documentation/labels/first-timers-only) to contribute in a meaningful way.

### Contentful driven data:

If you need any [Contentful](https://www.contentful.com/) driven data to be parsed before Hexo serve - you need to declare it Circle CI or/and bash. You may need [Contentful](https://www.contentful.com/) environment variables inside your machine or container:

- `GATSBY_CONTENTFUL_SPACE_ID`

    [Contentful](https://www.contentful.com/) 12 digit key. You can find it (if you have granted access) in [Contentful](https://www.contentful.com/) acc:

    Settings → API keys → Master → Space ID

- `GATSBY_CONTENTFUL_ACCESS_TOKEN`

    [Contentful](https://www.contentful.com/) 64 digit token. You can find it (if you have granted access) in [Contentful](https://www.contentful.com/) acc:

    Settings → API keys → Master → Content Delivery API - access token

 P.S. If you don't have any of this - Hexo will build & serve as usual, but without any 
 [Contentful](https://www.contentful.com/) driven data.

Example
-------

Below is a simple example test case for testing login to some system.
You can find more examples with links to related demo projects from
http://cypress.io

## .focus() To focus on a DOM element, use the .focus() command.

    cy.get('.action-focus').focus()
    .should('have.class', 'focus')
    .prev().should('have.attr', 'style', 'color: orange;')

## Deploying

See our [Deploy Guideline](DEPLOY.md).

## License

This project is licensed under the terms of the [MIT license](/LICENSE.md).

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
