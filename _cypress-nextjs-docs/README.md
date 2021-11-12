# Real World Testing with Cypress

Real World Testing with Cypress is a free and open source testing curriculum built with [Next.js](https://nextjs.org) by the team at [Cypress](https://www.cypress.io/).

## Installation

```bash
git clone git@github.com:cypress-io/cypress-realworld-testing.git

cd cypress-realworld-testing

yarn install

yarn dev # starts dev server
```

## Documenation

Documenation lives inside of the `/docs` folder and is powered by [VuePress](https://vuepress.vuejs.org). The best way to view the docs is by running the following command.

```bash
yarn docs:dev
```

This will spin up a local sever and serve the docs site.

## Unit Tests

The units tests are powered by [Mocha](https://mochajs.org/) and can be run with the following command.

```bash
yarn test:unit
```

## Cypress E2E Tests

Cypress tests can be run via the Cypress test runner and UI with the following command.

```bash
yarn cypress:open
```

The same tests can be run in headless mode, as they would be in CI with the following command.

```bash
yarn cypress:run
```
