<div id="content-wrap"  class="{{ page.containerClass }}">
  <div id="content" class="wrapper">
    <div id="content-inner">
      <article class="article-container" itemscope itemtype="http://schema.org/Article">
        <div class="article-inner">
          <div class="article">
            <header class="article-header">
              <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
              <a href="https://github.com/cypress-io/cypress-documentation/edit/develop/source/_data/{{ page.dataType }}.yml" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
            </header>
            <div class="article-content" itemprop="articleBody">
            {% for blog in site.data[page.dataType] %}
              <div class="media">
                <h2><a href="{{ blog.url }}">{{ blog.title }}</a></h2>
                <a href="{{ blog.url }}" class="img-link">
                  <img src="{{ blog.img }}" alt="{{ blog.title }}"/>
                </a>
                <p>
                  Published on
                  <a href="{{ blog.sourceUrl }}">{{ blog.sourceName }}</a>
                  {% if blog.author %}
                    by {{ blog.author }}
                  {% endif %}
                  <em>({{ blog.date }})</em>
                </p>
              </div>
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
      </article>
      {{ partial('partial/sidebar') }}
    </div>
  </div>
</div>
