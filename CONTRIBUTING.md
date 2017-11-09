# Contributing to Cypress Documentation

Thanks for taking the time to contribute! :smile:

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Writing Documentation](#writing-documentation)
  - [Links](#links)
  - [Adding Examples](#adding-examples)
- [Committing Code](#committing-code)
  - [Linting](#linting)
  - [Pull Requests](#pull-requests)
  - [Contributor License Agreement](#contributor-license-agreement)
- [Deployment](#deployment)

## Code of Conduct

All contributors are expecting to abide by our [Code of Conduct](https://github.com/cypress-io/cypress/wiki/code-of-conduct).

## Getting Started

The documentation in this repo is generated using [Hexo](https://hexo.io/).

**Fork this repository**

Using GitHub, create a copy (a fork) of this repository under your personal account.

**Clone your forked repository**

```bash
git clone git@github.com:<your username>/cypress-documentation.git
cd cypress-documentation
```

**Install dependencies:**

**note:** at least Node 6 is required, but Node 8 with NPM v5 is preferred to take advantage of
the package lock file.

```bash
npm install
```

This will install this repo's direct dependencies.

**Then, build the `public` directory and start the app:**

```bash
npm run build
npm start
```

Visit [http://localhost:2222/](http://localhost:2222/).

**note** If you need to debug documentation build step run with environment
variable set `DEBUG=docs npm run build`

## Writing Documentation

### Adding Examples

 To add an blog, talk, or podcast to our docs, submit a [pull request](#Pull-Requests) with your data added to the corresponding [blogs.yml](https://github.com/cypress-io/cypress-documentation/blob/develop/source/_data/blogs.yml), [talks.yml](https://github.com/cypress-io/cypress-documentation/blob/develop/source/_data/talks.yml), or [podcasts.yml](https://github.com/cypress-io/cypress-documentation/blob/develop/source/_data/podcasts.yml) file.

Add an associating image with the example within the [`source/img/examples`](/source/img/examples) directory. Each image should be resolution **715w x 480h**. Reference the image in the markdown document as follows:

```md
{% img /img/examples/name-of-file.jpg "alt text describing img" %}
```

### Adding Plugins

To add a plugin, submit a [pull request](#Pull-Requests) with the corresponding data added to the [plugins.yml](https://github.com/cypress-io/cypress-documentation/blob/develop/source/_data/plugins.yml) file. Your plugin should have a name, description, link to the plugins code, and any keywords.

## Commiting Code

### Linting

Danger 📛: because we are minifying client side code using a [Hexo plugin](https://github.com/mamboer/hexo-filter-cleanup) which in turn calls
`uglify`, the code should be strictly ES5. Thus everything inside the `theme` should be linted with ES5 settings and not upgraded to ES6.

### Pull Requests

You should push your local changes to your forked GitHub repository and then open a pull request from your repo to the `cypress-io/cypress-documentation` repo.

- The pull request should be from your repository to the `develop` branch in `cypress-io/cypress-documentation`
- When opening a PR for a specific issue already open, please use the `address #[issue number]` or `closes #[issue number]` syntax in the pull request description.
- Please check the "Allow edits from maintainers" checkbox when submitting your PR. This will make it easier for the maintainers to make minor adjustments, to help with tests or any other changes we may need.
![Allow edits from maintainers checkbox](https://user-images.githubusercontent.com/1271181/31393427-b3105d44-ada9-11e7-80f2-0dac51e3919e.png)

### Contributor License Agreement

We use a [`cla-assistant.io`](https://cla-assistant.io/) web hook to make sure every contributor assigns the rights of their contribution to Cypress.io. If you want to read the CLA agreement, its text is in this [gist](https://gist.github.com/bahmutov/cf22bc6c6b55219d0f9a76d04981f7ae).

After making a [pull request](#pull-requests), the CLA assistant will add a review comment. Just click on the link and accept the CLA. That's it!

## Deployment

We will try to review and merge pull requests as fast as possible. After merging, we will deploy it to staging environment, run E2E tests (using Cypress itself of course), and then merge it into `master`, which will deploy it to the official [https://docs.cypress.io](https://docs.cypress.io) website. If you want to know our deploy process, read [DEPLOY.md](DEPLOY.md).
