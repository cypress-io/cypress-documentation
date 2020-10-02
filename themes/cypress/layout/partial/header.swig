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
