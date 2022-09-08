# Contributing to Cypress Documentation

Thanks for taking the time to contribute! :smile:

## Table of Contents

- [Contributing to Cypress Documentation](#contributing-to-cypress-documentation)
  - [Code of Conduct](#code-of-conduct)
  - [Writing Documentation](#writing-documentation)
    - [Using Vue Components](#using-vue-components)
      - [Alerts](#alerts)
      - [Images](#images)
      - [Videos](#videos)
      - [Icons](#icons)
    - [Partials](#partials)
      - [Writing a Partial](#writing-a-partial)
      - [Using Partials](#using-partials)
      - [Limitations](#limitations)
    - [When to use Partials instead of Vue components](#when-to-use-partials-instead-of-vue-components)
    - [Adding Examples](#adding-examples)
    - [Adding Plugins](#adding-plugins)
    - [Adding Pages](#adding-pages)
      - [A Worked Example](#a-worked-example)
    - [Deleting Pages](#deleting-pages)
    - [Writing the Changelog](#writing-the-changelog)
      - [Categories](#categories)
  - [Committing Code](#committing-code)
    - [Pull Requests](#pull-requests)
    - [Contributor License Agreement](#contributor-license-agreement)
  - [Deployment](#deployment)
    - [Trigger workflow build](#trigger-workflow-build)

## Code of Conduct

All contributors are expected to abide by our
[Code of Conduct](https://github.com/cypress-io/cypress/blob/develop/CODE_OF_CONDUCT.md).

## Writing Documentation

The documentation uses [Nuxt.js](https://nuxtjs.org/) to generate a static
website. Refer to the
[Nuxt.js](https://nuxtjs.org/docs/2.x/get-started/installation) documentation
for specifics about the Nuxt.js framework.

**Fork this repository**

Using GitHub, [create a copy](https://guides.github.com/activities/forking/) (a
fork) of this repository under your personal account.

**Clone your forked repository**

```shell
git clone git@github.com:<your username>/cypress-documentation.git
cd cypress-documentation
```

### Using Vue Components

This project uses [`@nuxt/content`](https://content.nuxtjs.org/) which enables
you to write Vue components within markdown. Any component files placed within
the `/components/global` directory will be available for use within the markdown
files. There are a
[few limitations](https://content.nuxtjs.org/writing#vue-components) with using
Vue components in markdown.

#### Alerts

Use [`<Alert>`](/components/global/Alert.vue) to grab the reader's attention
with a blurb. You can change the look of the `<Alert>` by setting the `type`
prop to `info`, `tip`, `warning`, or `danger`.

```jsx
<Alert type="info">This is an important message.</Alert>
```

#### Images

If you are starting a new page and want to add images, add a new folder to
[`assets/img`](/assets/img). For example when adding a new "Code Coverage" page
to `guides/tooling`, I have created new folder `assets/img/guides/tooling` and
copied an image there called `coverage-object.png`. Within the markdown, I can
include the image using the
[`<DocsImage />` component](/components/global/DocsImage.vue).

```jsx
<DocsImage
  src="/img/guides/tooling/coverage-object.png"
  alt="code coverage object"
></DocsImage>
```

Typically you should include the `alt` and `title` attributes to give the user
more information about the image.

#### Videos

You can embed videos within the markdown with the
[`<DocsVideo>`](/components/global/DocsVideo.vue) component. Currently, it
supports local files, YouTube, and Vimeo embeds. Set the `src` prop to a
relative path for a local video file or the embed link for YouTube or Vimeo
videos. You should also set a `title` prop describing the video for
accessibility reasons.

```jsx
<DocsVideo
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Cypress Tips and Tricks"
>
```

#### Icons

[Font Awesome](https://fontawesome.com/) icons can be used within markdown by
using the [`<Icon>`](/components/global/Icon.vue) component. Set the `name` prop
to the name of the Font Awesome icon you want to use. Make sure that the icon
appears in the list of imported icons within the `nuxt.config.js` file under the
`fontawesome` key.

```jsx
<Icon name="question-circle"></Icon>
```

### Partials

Partials are snippets of reusable markdown that can be inserted into other
markdown files. You may want to use a partial when you are writing the same
content across multiple markdown files.

#### Writing a Partial

A partial is a markdown file that you want to import and inject into another
markdown file. They can contain any content that you would otherwise want to
write in other markdown files.

```md
## My First Partial

<Alert type="info">

This is my reusable partial.

</Alert>
```

#### Using Partials

Partials can be imported into other markdown files with the
`::include{file=FILE_NAME}` directive.

```md
## My Favorite Food

### Pizza

::include{file=path/to/pizza-recipe.md}
```

When the page is generated, the content of `path/to/pizza-recipe.md` will be
injected into the markdown file.

The `::include{file=FILE_NAME}` directive assumes that the `FILE_NAME` exists
within the `content` directory. You must provide the path relative to the
`content` directory as the `file` property. For example, if the partial
`pizza-recipe.md` was located at `/content/recipes/pizza-recipe.md`, the
`::include` directive would be `::include{file=recipes/pizza-recipe.md}`.

#### Limitations

When including the `::include{file=FILE_NAME}` directive in another markdown
file, Nuxt's hot module reloading will automatically trigger the partial's
content to be inserted into the markdown file. However, if you wish to make
changes to the partial file itself, you will need to stop and restart the
development server with `yarn start` to see the changes. This is because the
custom remark plugin that is enabling this partial system is only ran when the
server is started and not on each hot module reload.

### When to use Partials instead of Vue components

It is possible to create partials using Vue components in the markdown instead
of using the `::include{file=FILE_NAME}` directive. However, there are downsides
to this approach.

Assume you have a `<Partial>` Vue component. If you wanted to introduce a
`<Partial>` to a markdown file and let that partial add a new header to the
page, you would need to add a header element to the `<Partial>` component. Due
to how each page's table of contents is generated, this new header would not
appear in the "On This Page" section that appears on the right-hand side of most
documentation pages. The header would also be missing the anchor tag that is
otherwise automatically inserted into all headers.

For most use cases, you should use the `::include{file=FILE_NAME}` directive
when you want to inject reusable markdown into multiple files. A `<Partial>` Vue
component may be a better fit if you wish to add custom interactivity to
reusable strings of text.

### Adding Examples

To add a course, blog, talk, podcast, or screencast to our docs, submit a
[pull request](#Pull-Requests) with your data added to the corresponding
[courses.json](/content/_data/courses.json),
[blogs.json](/content/_data/blogs.json),
[talks.json](/content/_data/talks.json),
[podcasts.json](/content/_data/podcasts.json) or
[screencasts.json](/content/_data/screencasts.json) file.

Add an associated image with the example within the [`assets/img`](/assets/img)
directory. Each image should have a resolution of **715×480**. Reference the
image in the markdown document as follows:

```jsx
<DocsImage src="/img/examples/name-of-file.jpg" alt="alt text describing img" />
```

### Adding Plugins

To add a plugin, submit a [pull request](#Pull-Requests) with the corresponding
data added to the [`plugins.json`](/content/_data/plugins.json) file. Your
plugin should have a name, description, link to the plugin's code, as well as
any keywords.

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

### Adding Pages

To add a page, such as a new guide or API documentation:

- Add the new page to the relevant directory under [`content`](/content).
- Link to your new page in the [`sidebar.json`](/content/_data/sidebar.json).
- Build the documentation site locally so that you can visually inspect your new
  page and the links to it.
- Submit a [pull request](#Pull-Requests) for your change.

> Note: If you need to change the overall layout of a page, you should create a
> Vue component within the `/pages` directory. The `/pages` directory contains
> the `_.vue` components responsible for generating the views for the routes
> `/guides`, `/api/`, `/plugins`, etc. If you wanted to create a guide page that
> has a different layout from the other guide pages, you would create a
> component file within `/guides` matching the route name that you want to use.
> For example, if I wanted to create a unique guide page without the sidebar
> about using Cypress Cloud, I would create a file called
> `/pages/guides/my-cloud-guide.vue` and create a Vue component for the
> specific layout I want to create. The page will then be accessible at the
> route `/guides/my-cloud-guide`.

#### A Worked Example

Let's imagine that the Cypress team has just added a new command called
`privateState` and you've picked up the task to document it.

API documentation for commands is in the
[`content/api/commands`](/content/api/commands) directory.

1. Add a file called `privatestate.md` to that directory.
2. Write the document. Look to the existing documentation to see how to
   structure the content.
3. Open the [`content/_data/sidebar.json`](/content/_data/sidebar.json) file and
   add a link the new `privatestate` page. In this example, we're adding a
   command, so we'll add a link underneath the `api` section.

```diff
"api": [
  {
    "title": "API",
    "slug": "api",
    "children": [
      {
        "title": "Commands",
        "slug": "commands",
        "children": [
          {
            "title": "and",
            "slug": "and"
          },
          {
            "title": "as",
            "slug": "as"
          },
          // ...
+         {
+           "title": "privateState",
+           "slug": "privatestate"
+         }
        ]
      }
    ]
  }
]
```

The `sidebar.json` file contains a tree-like structure of nodes. Each node
contains a `title`, `slug`, and optionally a `redirect` property. The URLs for
each node in the `sidebar.json` are determined by the placement of each node in
the hierarchy. For example, the `privateState` node that we added in the
previous example would have a generated URL of `/api/commands/privatestate`
since `privateState` is a child of the `commands` node, which is a child of the
`api` node. If the `privateState` node were to contain a `redirect` instead of a
`slug` property, it would link to the path used as the `redirect`:

```json
{
  "title": "privateState",
  "redirect": "/guides/overview/why-cypress"
  // creates a link to the `/guides/overview/why-cypress` page
}
```

> Note: If a node contains a `redirect` property, there is no need to add a
> `slug` property. The `redirect` property will always take precedence over the
> `slug`.

The ability to nest nodes inside of other nodes gives you the ability to create
a menu structure up to three (3) levels deep:

```json
"api": [
  {
    "title": "API",
    "slug": "api",
    "children": [
      {
        "title": "Commands",
        "slug": "commands",
        "children": [
          {
            "title": "Custom Commands",
            "slug": "custom-commands",
            "children": [
              {
                "title": "Writing a Custom Command",
                "slug": "writing-a-custom-command"
                // this node should not contain any children
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### Deleting Pages

To delete a page:

- Delete the page from the relevant directory under [`content`](/content).
- Remove the link from the the [`sidebar.json`](/content/_data/sidebar.json).
- Build the documentation site locally so that you can visually inspect and make
  sure it was properly deleted.

### Writing the Changelog

When adding to the Changelog, create a new file in
[`content/_changelogs`](/content/_changelogs) named as the version number. Be
sure to follow the category structure defined below (in this order). Each bullet
point in the list should _always_ be associated to an issue on the
[`cypress`](https://github.com/cypress-io/cypress) repo and link to that issue
(except for Documentation changes).

#### Categories

- **Summary** - If it is a large release, you may write a summary explaining
  what the point of this release is (mostly used for breaking releases)
- **Breaking Changes** - The users current implementation of Cypress may break
  after updating.
- **Deprecations** - Features have been deprecated, but will not break after
  updating.
- **Features** - A new feature
- **Bugfixes** - A bug existed in Cypress and a PR fixed the issue
- **Misc** - Not a feature or bugfix, but work that was done. May be internal
  work that was done and associated with an issue
- **Documentation Changes** - our docs were updated based on behavior changes in
  release

## Committing Code

### Pull Requests

You should push your local changes to your forked GitHub repository and then
open a pull request (PR) from your repo to the
`cypress-io/cypress-documentation` repo.

- The PR should be from your repository to the appropriate branch in the
  `cypress-io/cypress-documentation` repository.
  - For documentation changes that are not tied to a feature release, open a PRs
    against the `master` branch.
  - For documentation additions for unreleased features, open a PR against the
    corresponding `X.Y.Z-release` branch. Once the release is performed, this
    branch will be merged into master by the releaser.
- When opening a PR for a specific issue already open, please use the
  `closes #issueNumber` syntax in the pull request description&mdash;for
  example, `closes #138`&mdash;so that the issue will be
  [automatically closed](https://help.github.com/articles/closing-issues-using-keywords/)
  when the PR is merged.
- Please check the "Allow edits from maintainers" checkbox when submitting your
  PR. This will make it easier for the maintainers to make minor adjustments, to
  help with tests or any other changes we may need.
  ![Allow edits from maintainers checkbox](https://user-images.githubusercontent.com/1271181/31393427-b3105d44-ada9-11e7-80f2-0dac51e3919e.png)
- All PRs against `master` will automatically create a deploy preview URL with
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
every contributor assigns the rights of their contribution to Cypress.io. If you
want to read the CLA agreement, its text is in this
[gist](https://gist.github.com/bahmutov/cf22bc6c6b55219d0f9a76d04981f7ae).

After making a [pull request](#pull-requests), the CLA assistant will add a
review comment. Click on the link and accept the CLA. That's it!

## Deployment

We will try to review and merge pull requests as fast as possible. After
merging, the changes will be made available on the official
[https://docs.cypress.io](https://docs.cypress.io) website.

### Trigger workflow build

Due to CircleCI API limitations, you cannot trigger a workflow build using the
API. Thus if you need to build, test and deploy `your-branch` branch for
example, your best bet is to create an empty GitHub commit in the
[cypress-io/cypress-documentation](https://github.com/cypress-io/cypress-documentation)
repository in the `your-branch` branch. We have added
[make-empty-github-commit](https://github.com/bahmutov/make-empty-github-commit)
as a dev dependency and set it as `make-empty-commit` NPM script in the
[package.json](package.json).

To trigger production rebuild and redeploy, use personal GitHub token and run:

```shell
GITHUB_TOKEN=<your token> npm run make-empty-commit -- --message "trigger deploy" --branch master
```

As always, using [as-a](https://github.com/bahmutov/as-a) is recommended for
storing and using sensitive environment variables.
