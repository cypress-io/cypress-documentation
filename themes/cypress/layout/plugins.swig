<div id="content-wrap" class="plugins">
  <div id="content" class="wrapper">
    <header class="article-header">
      <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
      <a href="{{ raw_link(page.source) }}" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
    </header>
    <div class="article-content" itemprop="articleBody">
      <p>To submit a plugin, submit a pull request updating <a href="https://github.com/cypress-io/cypress-documentation/blob/develop/source/_data/plugins.yml">plugins.yml</a> with the name, description, and a link to it on GitHub.

      {% for pluginType in site.data.plugins %}
        <h2>{{ pluginType.name }}</h2>
        <ul class="plugins-list">
          {% for plugin in pluginType.plugins %}
            <li>
              <h3><a href="{{plugin.link}}" target="_blank">{{ plugin.name }}</a></h3>
              <p>{{ plugin.description }}</p>
            </li>
          {% endfor %}
        </ul>
      {% endfor %}
    </div>
    <footer class="article-footer">
      {{ page_nav() }}
    </footer>
    <div class="article-footer-updated">
      <time datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last-updated', date(page.updated)) }}</time>
    </div>
  </div>
</div>
