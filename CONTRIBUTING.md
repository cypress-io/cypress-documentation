# Contributing to Cypress Documentation

Thanks for taking the time to contribute! :smile:

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Writing Documentation](#writing-documentation)
- [Committing Code](#committing-code)
  - [Pull Requests](#pull-requests)
- [Deployment](#deployment)

## Code of Conduct

All contributors are expecting to abide by our [Code of Conduct](https://github.com/cypress-io/cypress/wiki/code-of-conduct).

## Contributor License Agreement

We use `cla-assistant.io` web hook to make sure every contributor
assigns the rights to the contribution to Cypress.io. If you want to read the CLA agreement,
its text is in this [gist](https://gist.github.com/bahmutov/cf22bc6c6b55219d0f9a76d04981f7ae).

Once you make a pull request, the CLA assistant will add a review comment. Just click on
the link and accept the CLA. That's it!

## Getting Started

The documentation in this repo are generated using [Hexo](https://hexo.io/). You should
be able to install tools, build and start the local `hexo` site. 

**Fork this repository**

Using GitHub interface, create a copy (a fork) of this repository under your personal account.

**Clone your forked repository**

```bash
git clone git@github.com:<your username>/cypress-documentation.git
cd cypress-documentation
```

**Install dependencies:**

```bash
npm install
```

This will install this repo's direct dependencies.

**Then, build the `public` directory and start the app:**

```bash
npm run build
npm start
```

Visit [http://localhost:2222/](http://localhost:2222/)

## Writing Documentation

### Links

Links are all handled through our [cypress.on](https://github.com/cypress-io/cypress-on) api.

Link all pages but their name (property key) in `source/_data/sidebar.yml`

- https://on.cypress.io/NAME_OF_PAGE
- https://on.cypress.io/and
- https://on.cypress.io/visit
- https://on.cypress.io/unit-testing-recipe
- https://on.cypress.io/introduction-to-cypress
- https://on.cypress.io/writing-your-first-test
- https://on.cypress.io/general-questions-faq

### Adding Examples

The documents outlining examples are within the [`source/examples`](/source/examples) directory. Each document is written in markdown with a little bit of [Hexo flair](https://hexo.io/docs/tag-plugins.html). To add an example to a document, just try to follow the formatting of any previous examples in the markdown file.

Add an associating image with the example within the [`source/img/examples`](/source/img/examples) directory. Each image should be resolution **715w x 480h**. Reference the image in the markdown document as follows:

```md
{% img /img/examples/name-of-file.jpg "alt text describing img" %}
```

## Commiting Code

### Linting

Danger 📛: because we are minifying client side code using Hexo plugin which in turn calls
`uglify`, the code should be strictly ES5. Thus everything inside the `theme` should
be linted with ES5 settings and not upgraded to ES6.

### Push code to your repository

You should push your local changes to your forked GitHub repository and then
open a pull request from your repo to `cypress-io/cypress-documentation` repo.

### Pull Requests

- The pull request should be from your repository to branch `develop` in `cypress-io/cypress-documentation`
- When opening a PR for a specific issue already open, please use the `address #[issue number]` or `closes #[issue number]` syntax in the pull request description.

## Deployment

We will try to review and merge pull requests quickly. After merging we
will try releasing the documentation. First we will deploy it to staging environment,
run E2E tests (using Cypress itself of course), and then we will merge it into
`master`, which will deploy it to the official [https://docs.cypress.io](https://docs.cypress.io)
website. If you want to know our deploy process, read [DEPLOY.md](DEPLOY.md)
