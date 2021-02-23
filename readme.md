# Cypress.io Documentation

## Getting Started

Install the dependencies:

```sh
yarn
```

Run the app:

```sh
yarn start
```

You can view the app by visiting [http://localhost:3000/](http://localhost:3000/).

## Building

You can create a statically generated version of the website by running the following:

```sh
yarn build
```

This will generate a `dist` directory that you can serve up.

**Note:** If you want to create and view a statically generated version of the documentation site, you can run the following:

```
yarn run start:ci
```

You can view the statically generated site at [http://localhost:3000/](http://localhost:3000).

### Testing

We use Cypress itself to test the documentation.

Run the tests:

```sh
yarn test
```

## Contributing

Refer to the [`CONTRIBUTING.md`](/CONTRIBUTING.md) guide for details.
