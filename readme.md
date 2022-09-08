# Cypress Documentation [![Cypress Cloud](https://img.shields.io/badge/cypress-dashboard-brightgreen.svg)](https://cloud.cypress.io/#/projects/ma3dkn/runs) [![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg)](https://github.com/cypress-io/cypress-documentation/labels/first-timers-only)

The code for Cypress Documentation including Guides, API, Examples, Cypress Cloud &
FAQ found at https://docs.cypress.io.

![Cypress Documentation Preview](https://user-images.githubusercontent.com/11802078/112329249-09547100-8c85-11eb-97fe-8a52e4245874.png)

## CI status

[![CircleCI](https://circleci.com/gh/cypress-io/cypress-documentation/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-documentation/tree/master)
`master` branch

[![Netlify Status](https://api.netlify.com/api/v1/badges/dbf22ada-b50c-49b0-a933-bf02e87d25d1/deploy-status)](https://app.netlify.com/sites/cypress-docs/deploys)

## Getting Started

Install the dependencies:

```sh
yarn
```

Run the app:

```sh
yarn start
```

You can view the app by visiting
[http://localhost:3000/](http://localhost:3000/).

## Building

You can create a statically generated version of the website by running the
following:

```sh
yarn build
```

This will generate a `dist` directory that you can serve up.

**Note:** If you want to create and view a statically generated version of the
documentation site, you can run the following:

```
yarn run start:ci
```

You can view the statically generated site at
[http://localhost:3000/](http://localhost:3000).

### Testing

#### Linting

Javascript code is linted with [ESLint](https://eslint.org/).

CSS code is linted with [stylelint](https://stylelint.io/).

Markdown is formatted with [Prettier](https://prettier.io/).

```sh
yarn lint
```

#### Unit Tests

Javascript code is unit tested with [Jest](https://jestjs.io/).

```sh
yarn test:unit
```

#### Integration Tests

We use Cypress itself to test the documentation.

Run the tests:

```sh
yarn test
```

## Contributing

Refer to the [`CONTRIBUTING.md`](/CONTRIBUTING.md) guide for details.

## License

This project is licensed under the terms of the [MIT license](/LICENSE.md).
