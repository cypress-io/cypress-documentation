{# a template to render plugins YAML file #}
<div id="content-wrap" class="plugins">
  <div id="content" class="wrapper">
    <article itemscope itemtype="http://schema.org/Article">
      <header class="article-header">
        <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
        <a href="{{ raw_link() }}" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
      </header>
      <div class="article-content" itemprop="articleBody">
        {{ (page.content) }}
        {% for pluginType in order_by_name(site.data.plugins) %}
          <section data-cy="plugin-{{ id(pluginType.name) }}">
            <h2 id="{{ id(pluginType.name) }}"><a href="#{{ id(pluginType.name) }}">{{ pluginType.name }}</a></h2>
            {% if pluginType.description %}
            <div class="plugin-type-description">{% markdown %}{{ pluginType.description }}{% endmarkdown %}</div>
            {% endif %}
            <ul class="plugins-list">
              {% for plugin in order_by_name(pluginType.plugins) %}
                <li>
                  <div class="plugin-title">
                    <h3>
                      <a href="{{plugin.link}}" target="_blank" rel="noopener noreferrer">{{ plugin.name }}</a> 
                    </h3>
                    <div class="plugin-badge">
                      {% if plugin.badge %}
                        {% if plugin.badge === 'community' %}
                        <span class="badge badge-pill badge-community">
                        {% endif %}
                        {% if plugin.badge === 'experimental' %}
                        <span class="badge badge-pill badge-experimental">
                        {% endif %}
                        {% if plugin.badge === 'official' %}
                        <span class="badge badge-pill badge-official">
                        {% endif %}
                        {% if plugin.badge === 'verified' %}
                        <span class="badge badge-pill badge-verified">
                      {% endif %}
                        {{ plugin.badge }}
                      </span>
                    {% endif %}
                    </div>
                  </div>
                  <p>{{ plugin.description }}</p>
                  {% for keyword in plugin.keywords %}
                    <span class="keyword">#{{ keyword }}</span>
                  {% endfor %}
                </li>
              {% endfor %}
            </ul>
          </section>
        {% endfor %}
      </div>
      <div class="article-footer-updated">
        <time datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last-updated', date(page.updated)) }}</time>
      </div>
    </article>
  </div>
</div>
