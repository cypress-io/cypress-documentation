# Deploy Cypress Documentation

## Table of Contents

- [Automatic Deployment](#automatic-deployment)
- [Manual Deployment](#manual-deployment)
- [Check Latest Deployed Version](#check-latest-deployed-version)

## Automatic Deployment

Any commits landed in `develop` branch of this repository will be deployed
to `staging` environment if end-to-end tests pass and can be previewed at [https://docs-staging.cypress.io](https://docs-staging.cypress.io).

Any commits landed in `master` branch will be deployed to the `production`
environment and can be previewed at [https://docs.cypress.io](https://docs.cypress.io).

Refer to the [circle.yml](circle.yml) job definition file for up-to-date information.

## Manual Deployment

You can only deploy the Cypress documentation manually if you are a member of the Cypress organization and have the necessary credentials files.

```shell
npm run deploy
```

You can specify all options for deploying via command line arguments. For example to deploy to production and scrape the docs:

```shell
npm run deploy -- --environment production --scrape
```

By default, only deploying from `master` branch is allowed, but you can force
deployment by using `--force` option.

To debug deployment actions, run with `DEBUG=deploy ...` environment variable.

**Note**

On CI, the deployment and scraping configuration are passed via environment
variables `support__aws_credentials_json` and `support__circle_credentials_json`,
which are JSON files as strings.

```shell
cat support/.circle-credentials.json | pbcopy
```

## Check Latest Deployed Version

You can see the latest deployed version, including deployment date at:

| Env | Site |
| --- | ---- |
| Master | [https://docs.cypress.io/build.json](https://docs.cypress.io/build.json) |
| Staging | [https://docs-staging.cypress.io/build.json](https://docs-staging.cypress.io/build.json) |

## Caching link checks

We use a helper function to check that links used in the documentation are valid. The checks are using in-memory store, but if you have a Redis instance, you can run `REDIS_URL=...redis_url npm run build` to cache the checks for several hours. This will speed up the build a lot because the external pages will not be requested again.

To see debug messages during the build, run with `DEBUG=docs` environment variable.
