# Tags

We are using [Hexo](https://hexo.io) to convert Markdown documents to static HTML. Hexo comes with a large number of [tags](https://hexo.io/docs/tag-plugins.html) that extend Markdown with extra features. For example, you can insert a quote with beautiful footer using `{% blockquote %}` tag

```md
{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}
```

## Common Hexo tags

* images

```md
{% img /img/examples/name-of-file.jpg "alt text describing img" %}
```

## Cypress custom tags

We have written multiple custom tags that Hexo loads from [libs/tags](libs/tags) folder. Most commonly used are the following tags

* requirements

To quickly describe what a command requires, see [lib/tags/requirements.js](lib/tags/requirements.js)

```md
{% requirements parent cy.clearCookie %}
```

which generates output text

```md
* `cy.clearCookie()` requires being chained off of `cy`.
```

* assertions

Describes what assertions can be chained of a command, see [lib/tags/assertions.js](lib/tags/assertions.js)

```md
{% assertions none cy.clearCookie %}
```

* helper icons

We can insert a commonly used icon by name (for consistency).

```md
// examples
{% helper_icon yields %}
{% helper_icon timeout %}
```

See [lib/tags/icons.js](lib/tags/icons.js) for all icon names.

You can also use a specific [Font Awesome](https://fontawesome.com/) icon by giving its name

```md
{% fa fa-check-circle green %}
```

Often icons are used to highlight important statements.

```md
**{% fa fa-check-circle green %} Correct Usage**

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

**{% fa fa-angle-right %} value** ***(String)***
```
