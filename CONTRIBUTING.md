# Contributing to Cypress Documentation

Thanks for taking the time to contribute! :smile:

## Table of Contents

- [Contributing to Cypress Documentation](#contributing-to-cypress-documentation)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Writing Documentation](#writing-documentation)
    - [VSCode MDX Extension](#vscode-mdx-extension)
      - [Admonitions](#admonitions)
      - [Images](#images)
      - [Videos](#videos)
      - [Icons](#icons)
    - [Partials](#partials)
    - [Adding Plugins](#adding-plugins)
    - [Adding Pages](#adding-pages)
    - [Patches](#patches)
      - [@docusaurus/mdx-loader patch](#docusaurusmdx-loader-patch)
    - [Writing the Changelog](#writing-the-changelog)
      - [Categories](#categories)
  - [Committing Code](#committing-code)
    - [Pull Requests](#pull-requests)
    - [Contributor License Agreement](#contributor-license-agreement)
  - [Deployment](#deployment)

## Writing Documentation

The documentation uses [Docusaurus](https://docusaurus.io) to generate a static
website. Refer to the [Docusaurus](https://docusaurus.io/docs) documentation for
specifics about the framework.

**Fork this repository**

Using GitHub, [create a copy](https://guides.github.com/activities/forking/) (a
fork) of this repository under your personal account.

**Clone your forked repository**

```shell
git clone https://github.com/<your username>/cypress-documentation.git
cd cypress-documentation
```

### VSCode MDX Extension

If you are using VS Code, download the
[MDX extension](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
to get full editor support for MDX files.

#### Images

If you are starting a new page and want to add images, add a new folder to
[`static/img`](/static/img). For example when adding a new "Code Coverage" page
to `app/tooling`, I have created new folder `assets/img/app/tooling` and
copied an image there called `coverage-object.png`. Within the markdown, I can
include the image using the
[`<DocsImage />` component](/src/components/docs-image).

```jsx
<DocsImage
  src="/img/app/tooling/coverage-object.png"
  alt="code coverage object"
/>
```

You should always include the `alt` and `title` attributes to ensure the image is accessible and to give the user more information about the image.

#### Videos

You can embed videos within the markdown with the
[`<DocsVideo />`](src/components/docs-video) component. Currently, it supports
local files, YouTube, and Vimeo embeds. Set the `src` prop to a relative path
for a local video file or the embed link for YouTube or Vimeo videos. You should
also set a `title` prop describing the video for accessibility reasons.

```jsx
<DocsVideo
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Cypress Tips and Tricks"
/>
```

#### Icons

[Font Awesome](https://fontawesome.com/) icons can be used within markdown by
using the [`<Icon />`](src/components/icon) component. Set the `name` prop to
the name of the Font Awesome icon you want to use. Make sure that the icon
appears in the list of imported icons within the
[MDXComponents.js](src/theme/MDXComponents.js) file under the `fontawesome` key.

```jsx
<Icon name="question-circle" />
```

### Partials

Partials are snippets of reusable markdown that can be inserted into other
markdown files. You may want to use a partial when you are writing the same
content across multiple markdown files.

You can learn about how to import markdown & partials
[here](https://docusaurus.io/docs/markdown-features/react#importing-markdown).

### Adding Plugins

To add a plugin, submit a [pull request](#Pull-Requests) with the corresponding
data added to the [`plugins.json`](/src/data/plugins.json) file. Your plugin
should have a name, description, link to the plugin's code, as well as any
keywords.

We want to showcase plugins that work and have a good developer experience. This
means that a good plugin generally has:

1. Purpose of plugin articulated up front
1. Installation guide
1. Options and API are documented
1. Easy to follow documentation. Users should not have to read the source code
   to get things working.

Each plugin submitted to the plugins list should have the following:

1. Integration tests with Cypress

   - Demonstrates the plugin working
   - Acts as real-world example usage

2. CI pipeline
3. Compatibility with at least the latest major version of Cypress

Plugins are listed in the following order:

- official (Cypress owned)
- verified (community owned and verified by Cypress)
- community (community owned and unverified)
- deprecated (npm registry missing, source repo archived or incompatible with v10+)

### Adding Pages

To add a page, such as a new guide or API documentation check out how to do so
[here](https://docusaurus.io/docs/create-doc).

### Patches

From time to time, we find we need to patch a library using
[patch-package](https://www.npmjs.com/package/patch-package) for various
reasons. Each of the patches should be explained below for future understanding.

#### @docusaurus/mdx-loader patch

Docusaurus lower cases header anchor ids, and to maintain consistency with past
docs implementations, we need to preserve the casing of our header ids. This
patch passes in the `maintainCase` option as true to the github slugger to
achieve this.

We also opened an [issue](https://github.com/facebook/docusaurus/issues/7946) to
add this as a feature to Docusaurus, so if this gets implemented this patch can
go away.

## Committing Code

### Pull Requests

You should push your local changes to your forked GitHub repository and then
open a pull request (PR) from your repo to the
`cypress-io/cypress-documentation` repo.

- The PR should be from your repository to the appropriate branch in the
  `cypress-io/cypress-documentation` repository.
  - For documentation changes that are not tied to a feature release, open a PRs
    against the `main` branch.
  - For documentation additions for unreleased features, open a PR against the
    corresponding `X.Y.Z-release` branch. Once the release is performed, this
    branch will be merged into `main` by the releaser.
- When opening a PR for a specific issue already open, please use the
  `closes #issueNumber` syntax in the pull request description&mdash;for
  example, `closes #138`&mdash;so that the issue will be
  [automatically closed](https://help.github.com/articles/closing-issues-using-keywords/)
  when the PR is merged.
- Please check the "Allow edits from maintainers" checkbox when submitting your
  PR. This will make it easier for the maintainers to make minor adjustments, to
  help with tests or any other changes we may need.
  ![Allow edits from maintainers checkbox](https://user-images.githubusercontent.com/1271181/31393427-b3105d44-ada9-11e7-80f2-0dac51e3919e.png)
- All PRs against `main` will automatically create a deploy preview URL with
  Netlify. The deploy preview can be accessed via the PR's
  `netlify-cypress-docs/deploy-preview` status check:

![Netlify deploy preview status check](https://user-images.githubusercontent.com/11802078/113176533-36b79680-9212-11eb-8aec-898d0f5047df.png)

- All branches will automatically create a branch deploy preview. The branch
  deploy previews do not appear as a GitHub status check like deploy previews.
  You can view your branch's deploy preview by visiting
  `https://$BRANCH_NAME--cypress-docs.netlify.app` where `$BRANCH_NAME` is your
  git branch name. For example, if my branch was named `my-branch`, my branch
  preview will be available at `https://my-branch--cypress-docs.netlify.app`.

### Contributor License Agreement

We use a [`cla-assistant.io`](https://cla-assistant.io/) web hook to make sure
every contributor assigns the rights of their contribution to Cypress.io.

After making a [pull request](#pull-requests), the CLA assistant will add a
review comment. Click on the link and accept the CLA. That's it!

## Deployment

We will try to review and merge pull requests as fast as possible. After
merging, the changes will be made available on the official
[https://docs.cypress.io](https://docs.cypress.io) website.
