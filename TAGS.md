# Tags

The Cypress documentation uses [Hexo](https://hexo.io) to convert [Markdown](https://daringfireball.net/projects/markdown/syntax) documents to static HTML.

Hexo ships with lots of [tags](https://hexo.io/docs/tag-plugins.html) that extend Markdown with extra features.

Here's documentation for all the custom tags that we've created.

- [Common Hexo tags](#common-hexo-tags)
  - [`markdown`](#markdown)
  - [`raw`](#raw)
- [Cypress custom tags](#cypress-custom-tags)
  - [`aliases`](#aliases)
  - [`assertions`](#assertions)
  - [`badge`](#badge)
  - [`changelog`](#changelog)
  - [`fa`](#fa)
  - [`helper_icon`](#helper_icon)
  - [`history`](#history)
  - [`imgTag`](#imgTag)
  - [`issue`](#issue)
  - [`open_an_issue`](#open_an_issue)
  - [`note`](#note)
  - [`partial`](#partial)
  - [`PR`](#PR)
  - [`requirements`](#requirements)
  - [`timeouts`](#timeouts)
  - [`url`](#url)
  - [`urlHash`](#urlHash)
  - [`usage_options`](#usage_options)
  - [`user`](#user)
  - [`video`](#video)
  - [`yields`](#yields)

## Common Hexo tags

> We didn't create the tags in this section&mdash;they ship with Hexo&mdash;but they're used _all over the docs_ so here's the lowdown.

### `markdown`

If you have text in YAML file with Markdown tags, and you want to render it from the SWIG template, use `{% markdown %}` tag:

```text
<div class="plugin-type-description">{% markdown %}{{ pluginType.description }}{% endmarkdown %}</div>
```

### `raw`

If certain content is causing processing issues in your posts, wrap it with the raw tag to avoid rendering errors.

```text
{% raw %}
content
{% endraw %}
```

## Custom Cypress tags

We've created plenty of custom tags that Hexo loads from the [libs/tags](libs/tags) folder. Use 'em 'cos they give the docs a consistent look and feel.

### `aliases`

- [lib/tags/aliases.js](lib/tags/aliases.js)

Describe other aliases for a command.

```md
{% aliases contain includes contains %}
```

```html
<br>
<small class="aliases">
  <strong>Aliases: </strong>contain, includes, contains
</small>
```

### `assertions`

- [lib/tags/assertions.js](lib/tags/assertions.js)

Describe what assertions can be chained off a command.

```md
{% assertions none cy.clearCookie %}
```

```html
<ul>
  <li>
    <p>
      <code>cy.clearCookie()</code> cannot have any assertions chained.
    </p>
  </li>
</ul>
```

The following assertions are supported:

- `actions`
- `existence`
- `its`
- `none`
- `once`
- `retry`
- `utility`
- `wait`

### `badge`

- [lib/tags/changelog.js](lib/tags/badge.js)

Displays a pill shaped badge around text.

### `changelog`

- [lib/tags/changelog.js](lib/tags/changelog.js)

Builds a single changelog file from the contents of `source/_changelogs`

### `fa`

- [lib/tags/icons.js](lib/tags/icons.js)

Insert a specific [Font Awesome](https://fontawesome.com/) icon by name.

```md
{% fa fa-check-circle green %}
```

Use these icons to highlight important statements.

```md
**{% fa fa-check-circle green %} Correct Usage**

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

**{% fa fa-angle-right %} value** ***(String)***
```

### `helper_icon`

- [lib/tags/icons.js](lib/tags/icons.js)

Insert a commonly used icon by name.

```md
{% helper_icon yields %}
```

The following icons are supported:

* `assertions`
* `requirements`
* `timeout`
* `yields`

### `history`

- [lib/tags/history.js](lib/tags/history.js)

Displays a collapsible table describing changes to the command from past Cypress versions.

```md
{% history %}
2.0.0 | Foo deprecated, now use bar
1.0.0 | Commmand added
{% endhistory %}
```

```html
<details class="history">
  <summary>
    <h1 id="History" class="article-heading">
      <i class="fa fa-chevron-down history-disclosure"></i>
      History
    </h1>
  </summary>
  | Version | Changes |
  | --- | --- |
  | 2.0.0 | Foo deprecated, now use bar
  | 1.0.0 | Commmand introduced
</details>
```

### `imgTag`

- [lib/tags/image.js](lib/tags/image.js)

Display an image from within `themese/cypress/source` directory.

```md
% imgTag "img/api/coordinates-diagram.jpg" "alt text" ["css-class"] %}
```

```html
<img src="/img/api/coordinates-diagram.jpg" alt="alt text" class="css-class" />
```

### `issue`

- [lib/tags/issues.js](lib/tags/issues.js)

Link to an issue on Cypress's GitHub repository.

```md
{% issue 74 %}
```

```html
<a href="https://github.com/cypress-io/cypress/issues/74" target="_blank">
  #74
</a>
```

```md
{% issue 74 "not currently supported" %}
```

```html
<a href="https://github.com/cypress-io/cypress/issues/74" target="_blank">
  not currently supported
</a>
```

### `note`

- [lib/tags/note.js](lib/tags/note.js)

Display a block of content that visually stands out from the body of the text.

Most often used to call out warnings, useful info, and tips.

```md
{% note warning 'Anti-Pattern' %}
We do not recommend starting a web server using `cy.task()`. Read about {% url 'best practices' best-practices#Web-Servers %} here.
{% endnote %}
```

The first argument is required: it's used to style the block and add an appropriate icon. Use one of the following values:

- `info`
- `warning`
- `success`
- `danger`
- `bolt`

The second argument is optional: if present it's used as the title of the block.

### `open_an_issue`

- [lib/tags/issues.js](lib/tags/issues.js)

Link to the issue creation page on Cypress's GitHub repository.

```md
{% open_an_issue %}
```

Typically used to make it easier for users to open issues.

```md
At the moment, `mouseover` and `mouseout` events are *not* fired. {% open_an_issue %} if you need this to be fixed.
```

### `partial`

- [lib/tags/partial.js](lib/tags/partial.js)

Include the content of another file inline.

```md
{% partial then_should_difference %}
```

### `PR`

Link to a specific PR from Cypress' GitHub repo.

```md
{% PR 75 "See PR" %}
```

```html
<a href="https://github.com/cypress-io/cypress/pull/75" target="_blank">
  See PR
</a>
```

```md
{% PR 75 %}
```

```html
<a href="https://github.com/cypress-io/cypress/pull/75" target="_blank">
  #75
</a>
```

### `requirements`

- [lib/tags/requirements.js](lib/tags/requirements.js)

Describe a command's requirements.

```md
{% requirements parent cy.clearCookie %}
```

```html
<ul>
  <li><p><code>cy.clearCookie()</code> requires being chained off of <code>cy</code>.</p></li>
</ul>
```

### `timeouts`

- [lib/tags/timeouts.js](lib/tags/timeouts.js)

Describe a timeout.

```md
{% timeouts existence cy.get %}
```

```html
<ul>
  <li><p><code>cy.get()</code> can time out waiting for the element(s) to <a href="/guides/core-concepts/introduction-to-cypress.html#Default-Assertions">exist in the DOM</a>.</p></li>
</ul>
```

Typically used inside the _Timeouts_ section when documenting a command.

```md
## Timeouts {% helper_icon timeout %}

{% timeouts existence cy.get %}
```

### `url`

- [lib/tags/url.js](lib/tags/url.js)

Generate a link. Relative links are validated to exist within the Cypress documentation automatically and will error if not found.

```md
{% url `.and()` and %}
{% url `.should()` should#Notes %}
{% url 'Read about why' why-cypress %}
{% url http://foo.com %}
```

### `urlHash`

- [lib/tags/url.js](lib/tags/url.js)

Generate a link to an anchor from within the same page. The hash is validated to exist within its own page and will error if not found. 

```md
{% urlHash 'Standard Output' Standard-Output %}
```

```html
<a href="#Standard-Output">Standard Output</a>
```

### `usage_options`

- [lib/tags/usage.js](lib/tags/usage.js)

Describe the usage of a command option.

Typically used when documenting the `options` object inside the _Arguments_ section.

```md
## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.blur`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .blur %}
```

The following usages are supported:

- `log`
- `force`
- `multiple`
- `timeout`

### `user`

- [lib/tags/issues.js](lib/tags/issues.js)

Link to a GitHub profile.

Typically used to give attribution to someone who has contributed to Cypress.

```md
Contributed by {% user brian-mann %}.
```

### `video`

- [lib/tags/video.js](lib/tags/video.js)

Embed a video.

```md
{% video vimeo 240554515 %}
```

```md
{% video youtube 5XQOK0v_YRE %}
```

```md
{% video local /img/snippets/selector-playground.mp4 %}
```

### `yields`

- [lib/tags/yields.js](lib/tags/yields.js)

Describe what a command yields.

```md
{% yields sets_subject cy.readFile 'yields the contents of the file' %}
```

```html
<ul>
  <li><p><code>cy.readFile()</code> yields the contents of the file</p></li>
</ul>
```

Typically used inside the _Yields_ section when documenting a command.

```md
## Yields {% helper_icon yields %}

{% yields sets_subject cy.readFile 'yields the contents of the file' %}
```

The following yields are supported:

- `same_subject`
- `changes_subject`
- `maybe_changes_subject`
- `changes_dom_subject`
- `changes_dom_subject_or_subjects`
- `sets_dom_subject`
- `sets_subject`
- `null`
- `null_alias`
- `assertion_indeterminate`
