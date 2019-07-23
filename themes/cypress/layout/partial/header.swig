<header id="header" class="wrapper">
  {{ partial('banners') }}
  <div id="header-inner" class="inner">
    <h1 id="logo-wrap">
      <a href="https://www.cypress.io" id="logo">
        <img src="/{{ config.logo }}" alt="Cypress"/>
      </a>
    </h1>
    <nav id="main-nav">
      <ul>
        {{ menu('main') }}
        <li>
          <a href="https://github.com/{{ config.github_main_repo }}" aria-label="GitHub repo" class="main-nav-link"><i class="fa fa-github"></i></a>
        </li>
      </ul>
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
    </nav>

    <a id="mobile-nav-toggle">
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
    </a>
  </div>
</header>
