<div id="content-wrap" class="{{ page.containerClass }} tutorial">
  <div id="content" class="wrapper">
    <div id="content-inner">
      {{ partial('partial/sidebar') }}
      <article class="article-wrapper">
        <div class="article">
          <div class="article" itemscope itemtype="http://schema.org/Article">
            <header class="article-header">
              <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
              <a href="https://github.com/cypress-io/cypress-documentation/edit/develop/source/_data/{{ page.dataType }}.yml" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
            </header>
            <div class="article-content" itemprop="articleBody">
              {% if page.dataType === 'courses' %}
                <p>Online courses from that teach end-to-end testing with Cypress over multiple videos. <strong>Note:</strong> Some of the courses require payment from their website.</p>
                <ul class="courses-list">
                  {% for course in site.data.courses %}
                    <li>
                      <h3>
                        <a href="{{course.url}}" target="_blank" rel="noopener noreferrer">{{ course.title }}</a>
                        {% if course.free %}
                          <span class="badge badge-pill badge-primary">Free</span>
                        {% endif %}
                      </h3>
                      <p>
                        Published
                        {% if course.sourceUrl or course.sourceName %}
                          on
                          {% if course.sourceUrl %}
                            <a href="{{ course.sourceUrl }}">{{ course.sourceName }}</a>
                          {% else %}
                            {{ course.sourceName }}
                          {% endif %}
                        {% endif %}
                        {% if course.author %}
                          by
                          {% if course.authorTwitter %}
                            <a href="https://twitter.com/{{course.authorTwitter}}" target="_blank" rel="noopener noreferrer">
                              {{course.author}}
                            </a>
                          {% else %}
                            {{course.author}}
                          {% endif %}
                        {% endif %}
                        {% if course.language %}
                          <em>, Language: {{course.language}}</em>
                        {% endif %}
                        </p>
                    </li>
                  {% endfor %}
                </ul>
              {% endif %}

              {% if page.dataType === 'projects' %}
                <p>Open source projects that use Cypress to run their end-to-end tests.</p>
                <ul class="projects-list">
                  {% for project in site.data.projects %}
                    <li>
                      <h3>
                        <a href="{{project.url}}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
                      </h3>
                      <p>{{ project.description }}</p>
                    </li>
                  {% endfor %}
                </ul>
              {% endif %}

              {% if site.data[page.dataType].small %}
                <div class="media-small">
                  <ul>
                    {% for media in site.data[page.dataType].small %}
                      <li class="media-small-item">
                        <a href="{{ media.sourceUrl }}" target="_blank" rel="noopener noreferrer">{{ media.title }}</a>
                      </li>
                    {% endfor %}
                  </ul>
                </div>
              {% endif %}

            {% if site.data[page.dataType].large %}
              <div class="media-large">
                {% for media in site.data[page.dataType].large %}
                  <div class="media">
                    <h2>
                    {% if media.youtubeId or media.url %}
                      {% if media.youtubeId %}
                        <a href="https://www.youtube.com/watch?v={{ media.youtubeId }}">
                      {% else %}
                        <a href="{{ media.url }}">
                      {% endif %}
                          {{ media.title }}
                        </a>
                    {% else %}
                      {{ media.title }}
                    {% endif %}
                    </h2>
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
                      Published
                      {% if media.sourceUrl or media.sourceName %}
                        on
                        {% if media.sourceUrl %}
                          <a href="{{ media.sourceUrl }}">{{ media.sourceName }}</a>
                        {% else %}
                          {{ media.sourceName }}
                        {% endif %}
                      {% endif %}
                      {% if media.author %}
                        by
                        {% if media.authorTwitter %}
                          <a href="https://twitter.com/{{media.authorTwitter}}" target="_blank" rel="noopener noreferrer">
                            {{media.author}}
                          </a>
                        {% else %}
                          {{media.author}}
                        {% endif %}
                      {% endif %}
                      {% if media.date %}
                      <em>({{ media.date }}).</em>
                      {% endif %}
                      {% if media.slides %}
                        <a href="{{ media.slides }}" target="_blank" rel="noopener noreferrer">Slides.</a>
                      {% endif %}
                    </p>
                  </div>
                {% endfor %}
              </div>
            {% endif %}
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
    </div>
  </div>
</div>
