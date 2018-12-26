<div id="content-wrap" class="plugins">
  <div id="content" class="wrapper">
    <article itemscope itemtype="http://schema.org/Article">
      <header class="article-header">
        <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
        <a href="{{ raw_link(page.source) }}" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
      </header>
      <div class="article-content" itemprop="articleBody">
        {{ (page.content) }}
        {% for pluginType in site.data.plugins %}
          <h2 id="{{ id(pluginType.name) }}"><a href="#{{ id(pluginType.name) }}">{{ pluginType.name }}</a></h2>
          <ul class="plugins-list">
            {% for plugin in order_by_name(pluginType.plugins) %}
              <li>
                <h3>
                  <a href="{{plugin.link}}" target="_blank" rel="noopener noreferrer">{{ plugin.name }}</a>
                </h3>
                <p>{{ plugin.description }}</p>
                {% for keyword in plugin.keywords %}
                  <span class="keyword">#{{ keyword }}</span>
                {% endfor %}
              </li>
            {% endfor %}
          </ul>
        {% endfor %}
      </div>
      <div class="article-footer-updated">
        <time datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last-updated', date(page.updated)) }}</time>
      </div>
    </article>
  </div>
</div>
