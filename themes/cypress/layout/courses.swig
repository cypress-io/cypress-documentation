{# a template to render courses YAML file #}
<div id="content-wrap" class="courses">
  <div id="content" class="wrapper">
    <div id="content-inner">
      {{ partial('partial/sidebar') }}
      <article class="article-wrapper">
        {#
        <header class="article-header">
          <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
          <a href="{{ raw_link() }}" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
        </header>
        #}
        <div class="article-content" itemprop="articleBody">
          <p>Online video courses that use Cypress.io to teach end-to-end testing</p>.
          <ul class="courses-list">

            {# order courses same way as the source file #}
            {% for course in site.data[page.dataType] %}
              <li>
                <h3>
                  <a href="{{course.url}}" target="_blank" rel="noopener noreferrer">{{ course.title }}</a>
                </h3>
                <p>
                  {% if course.author %}
                    {{course.author}}
                  {% endif %}
                  {% if course.authorTwitter %}
                    @{{course.authorTwitter}}
                  {% endif %}
                  {% if course.company %}
                    {{course.company}}
                  {% endif %}
                  </p>
              </li>
            {% endfor %}
        </div>
        {#
        <div class="article-footer-updated">
          <time datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last-updated', date(page.updated)) }}</time>
        </div>
        #}
      </article>
    </div>
  </div>
</div>
