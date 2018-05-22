<div id="content-wrap"  class="{{ page.containerClass }} tutorial">
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
            {% for media in site.data[page.dataType] %}
              <div class="media">
                <h2><a href="{{ media.url }}">{{ media.title }}</a></h2>
                {% if media.youtubeId %}
                  <div class="embed-container">
                    <iframe src="https://www.youtube.com/embed/{{ media.youtubeId }}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                {% else %}
                  <a href="{{ media.url }}" class="img-link">
                    <img src="{{ media.img }}" alt="{{ media.title }}"/>
                  </a>
                {% endif %}
                <p>
                  Published on
                  {% if media.sourceUrl %}
                    <a href="{{ media.sourceUrl }}">{{ media.sourceName }}</a>
                  {% else %}
                    {{ media.sourceName }}
                  {% endif %}
                  {% if media.author %}
                    by {{ media.author }}
                  {% endif %}
                  <em>({{ media.date }}).</em>
                  {% if media.slides %}
                    <a href="{{ media.slides }}" target="_blank" rel="noopener noreferrer">Slides.</a>
                  {% endif %}
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
