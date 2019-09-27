<header
    {% if not className %}
      id="header" class="wrapper main-header"
    {% else %}
      class="wrapper main-header {{ className }}"
    {% endif %}
>
  {{ partial('banners') }}
  <div {% if not className %} id="header-inner" {% endif %} class="inner header-inner">
    <h1 {% if not className %} id="logo-wrap" {% else %} class="logo-wrap" {% endif %}>
      <a href="https://www.cypress.io" {% if not className %} id="logo" {% else %} class="logo" {% endif %}>
        <img src="/{{ config.logo }}" alt="Cypress"/>
      </a>
    </h1>
    <nav {% if not className %} id="main-nav" {% else %} class="main-nav" {% endif %}>
      <ul>
        {{ menu('main') }}
        <li>
          <a href="https://github.com/{{ config.github_main_repo }}" aria-label="GitHub repo" class="main-nav-link"><i class="fa fa-github"></i></a>
        </li>
      </ul>

      {% if not className %}
        <div class="main-nav-right">
          <div id="search-container">
            <div id="search-input-wrap">
              <div id="search-input-icon">
                <i class="fa fa-search"></i>
              </div>
              <label for="search-input">Search</label>
              <input type="search" id="search-input" aria-label="Search" placeholder="Search...">
            </div>
          </div>
          {% if site.data.languages|length > 1 %}
            <div id="lang-select-wrap">
              <label aria-label="Select language" id="lang-select-label"><i class="fa fa-globe"></i><span>{{ lang_name(page.lang) }}</span><i class="fa fa-caret-down"></i></label>
              <select aria-label="Select language" id="lang-select" data-canonical="{{ canonical_path_for_nav() }}">
                {% for lang in site.data.languages %}
                  <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
                {% endfor %}
              </select>
            </div>
          {% endif %}
        </div>
      {% endif %}
    </nav>
    {% if not className %}
    <a id="mobile-nav-toggle">
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
    </a>
    {% endif %}
  </div>
</header>
