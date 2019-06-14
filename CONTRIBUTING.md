# Contributing to Cypress Documentation

Thanks for taking the time to contribute! :smile:

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Writing Documentation](#writing-documentation)
  - [Tags](#tags)
  - [Adding Examples](#adding-examples)
  - [Adding Plugins](#adding-plugins)
  - [Adding Pages](#adding-pages)
  - [Writing the Changelog](#writing-the-changelog)
- [Committing Code](#committing-code)
  - [Linting](#linting)
  - [Pull Requests](#pull-requests)
  - [Contributor License Agreement](#contributor-license-agreement)
- [Deployment](#deployment)

## Code of Conduct

All contributors are expected to abide by our [Code of Conduct](https://github.com/cypress-io/cypress/wiki/code-of-conduct).

## Getting Started

The documentation in this repo is generated using [Hexo](https://hexo.io/).

**Fork this repository**

Using GitHub, [create a copy](https://guides.github.com/activities/forking/) (a fork) of this repository under your personal account.

**Clone your forked repository**

```shell
git clone git@github.com:<your username>/cypress-documentation.git
cd cypress-documentation
```

**Install dependencies:**

**Note:** at least Node 6 is required, but Node 8 with NPM v5 is preferred to take advantage of
the package lock file.

```shell
npm install
```

This will install this repo's direct dependencies.

**Then, build the `public` directory and start the app:**

```shell
npm run build
npm start
```

Visit [http://localhost:2222/](http://localhost:2222/).

**Note:** If you need to debug the documentation build step, run it this way:

```
DEBUG=docs npm run build
```

### Testing

We use Cypress itself to test the documentation. To start the server and run E2E tests, execute the command `npm run test-e2e`.

## Writing Documentation

### Tags

In addition to built-in Hexo tags, we have written several custom ones. They help us write consistent documentation, check referenced urls, etc. You can find the list of tags and examples in [TAGS.md](TAGS.md).

### Adding Examples

To add a blog, talk or podcast to our docs, submit a [pull request](#Pull-Requests) with your data added to the corresponding [blogs.yml](/source/_data/blogs.yml), [talks.yml](/source/_data/talks.yml), or [podcasts.yml](/source/_data/podcasts.yml) file.

Add an associated image with the example within the [`source/img/examples`](/source/img/examples) directory. Each image should have a resolution of **715×480**. Reference the image in the markdown document as follows:

```md
{% imgTag /img/examples/name-of-file.jpg "alt text describing img" %}
```

### Using images

If you are starting a new page and want to add images, add a new folder to "themes/cypress/source/img". For example when adding a new "Code Coverage" page to "guides/tooling", I have created new folder "themes/cypress/source/img/guides/code-coverage" and copied an image there called "coverage-object.png". From the page itself, I can include the image using `imgTag`.

```md
{% imgTag /img/guides/code-coverage/coverage-object.png "Code coverage object" %}
```

### Adding Plugins

To add a plugin, submit a [pull request](#Pull-Requests) with the corresponding data added to the [`plugins.yml`](/source/_data/plugins.yml) file. Your plugin should have a name, description, link to the plugin's code, as well as any keywords.

### Adding Pages

To add a page such as a new guide or API documentation:

- Add the new page to the relevant directory under [`source`](/source).
- Link to your new page in the [`sidebar.yml`](/source/_data/sidebar.yml).
- Add translations for the sidebar link (for English, this is located in [`en.yml`](/themes/cypress/languages/en.yml)).
- Build the documentation site locally so that you can visually inspect your new page and the links to it.
- Copy over the new page to other language translations - Japanese docs in [`source/ja`](/source/ja), Chinese docs in [`source/zh-cn`](/source/zh-cn).
- Submit a [pull request](#Pull-Requests) for your change.

#### A Worked Example

Let's imagine that the Cypress team has just added a new command called `privateState` and you've picked up the task to document it.

API documentation for commands is in the [`source/api/commands`](/source/api/commands) directory.

1. Add a file called `privatestate.md` to that directory.
2. Write the document. Look to the existing documentation to see how to structure the content.
3. Open the [`source/_data/sidebar.yml`](/source/_data/sidebar.yml) file and add a link the new `privatestate` page. In this example we're adding a command so we'll add a link underneath the `api.commands` section.
  ```yaml
  api:
    commands:
      and: and.html
      as: as.html
      blur: blur.html
      # ...
      privatestate: privatestate.html
  ```
4. Open [`themes/cypress/languages/en.yml`](/themes/cypress/languages/en.yml) and add an English translation for that sidebar link's title. In this example we're adding a command so we'll add the following text:
  ```yaml
  sidebar:
    api:
      introduction: Introduction
      api: API
      commands: Commands
      # ...
      privatestate: privateState
  ```
5. Now, copy the new page to the other translated docs. Add a `privatestate.md` within [`source/ja/api/commands`](/source/ja/api/commands) and [`source/zh-cn/api/commands`](source/zh-cn/api/commands) with the same content as the original document. Repeat steps 3-4 within the translated directories.
6. Submit a [pull request](#Pull-Requests) for your change.

### Writing the Changelog

When adding to the Changelog, create a new file in [`source/_changelogs`](/source/changelogs) named as the version number. Be sure to follow the category structure defined below (in this order). Each bullet point in the list should *always* be associated to an issue on the [`cypress`](https://github.com/cypress-io/cypress) repo and link to that issue (except for Documentation changes). Be aware that in development, only the five most recent entries will appear but the full changelog will be built in staging and production.

#### Categories

- **Summary** - If it is a large release, you may write a summary explaining what the point of this release is (mostly used for breaking releases)
- **Breaking Changes** - The users current implementation of Cypress may break after updating.
- **Deprecations** - Features have been deprecated, but will not break after updating.
- **Features** - A new feature
- **Bugfixes** - A bug existed in Cypress and a PR fixed the issue
- **Misc** - Not a feature or bugfix, but work that was done. May be internal work that was done and associated with an issue
- **Documentation Changes** - our docs were updated based on behavior changes in release

### Translating

#### Adding a new language

1. Add a new language folder in [`source`](/source) folder. (All lower case). The folder name should correspond to the [language's abbreviation code](https://www.loc.gov/standards/iso639-2/php/code_list.php).
1. Add the new language to [`source/_data/languages.yml`](/source/_data/languages.yml).
1. Add the new language to [`_config.yml`](/_config.yml#L10) under `language`.
1. Copy Markdown and template files in [`source`](/source) folder to the new language folder.
1. Copy `en.yml` in [`themes/cypress/languages`](/themes/cypress/languages) and rename to the abbreviated language name (all lower case).

#### Translating existing docs

Our currently supported languages can be found at [`/source/_data/languages.yml`](/source/_data/languages.yml). From here, find the corresponding directory within the [`/source`](/source) directory that matches the language you want to translate.

Translate existing documentation then submit a [pull request](#Pull-Requests) for your change.

## Committing Code

### Linting

Danger 📛: because we are minifying client-side code using a [Hexo plugin](https://github.com/mamboer/hexo-filter-cleanup) which in turn calls
`uglify`, the code should be strictly ES5. Thus everything inside the `theme` should be linted with ES5 settings and not upgraded to ES6.

In addition to ESLint, we use Textlint to lint Markdown files. This currently [lints code snippets](https://github.com/textlint-rule/textlint-rule-eslint) using the rules in `.eslintrc-textlint` and checks [terminology](https://github.com/sapegin/textlint-rule-terminology) using the terms in `.textlintrc`. To disable Textlint for a block, do the following:

```md
<!-- textlint-disable -->
{% video youtube 5XQOK0v_YRE %}
<!-- textlint-enable -->
```

### Pull Requests

You should push your local changes to your forked GitHub repository and then open a pull request (PR) from your repo to the `cypress-io/cypress-documentation` repo.

- The PR should be from your repository to the `develop` branch in `cypress-io/cypress-documentation`
- When opening a PR for a specific issue already open, please use the `closes #issueNumber` syntax in the pull request description&mdash;for example, `closes #138`&mdash;so that the issue will be [automatically closed](https://help.github.com/articles/closing-issues-using-keywords/) when the PR is merged.
- Please check the "Allow edits from maintainers" checkbox when submitting your PR. This will make it easier for the maintainers to make minor adjustments, to help with tests or any other changes we may need.
![Allow edits from maintainers checkbox](https://user-images.githubusercontent.com/1271181/31393427-b3105d44-ada9-11e7-80f2-0dac51e3919e.png)

### Contributor License Agreement

We use a [`cla-assistant.io`](https://cla-assistant.io/) web hook to make sure every contributor assigns the rights of their contribution to Cypress.io. If you want to read the CLA agreement, its text is in this [gist](https://gist.github.com/bahmutov/cf22bc6c6b55219d0f9a76d04981f7ae).

After making a [pull request](#pull-requests), the CLA assistant will add a review comment. Just click on the link and accept the CLA. That's it!

## Deployment

We will try to review and merge pull requests as fast as possible. After merging, we will deploy it to the staging environment, run E2E tests (using Cypress itself of course!), and then merge it into `master`, which will deploy it to the official [https://docs.cypress.io](https://docs.cypress.io) website. If you want to know our deploy process, read [DEPLOY.md](DEPLOY.md).
