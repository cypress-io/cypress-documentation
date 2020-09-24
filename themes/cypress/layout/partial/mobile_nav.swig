<nav id="mobile-nav">
  <div id="mobile-nav-inner">
    <ul id="mobile-nav-list">
      {{ menu('main') }}
      <li>
        <a href="https://github.com/{{ config.github }}" class="main-nav-link" target="_blank" rel="noopener noreferrer">GitHub</a>
      </li>
    </ul>
    {% if page.layout == 'page' || page.layout == 'toc-top' || page.layout == 'api-toc' %}
      <ul>
        {{ doc_sidebar('mobile-nav') }}
      </ul>
    {% endif %}
  </div>
</nav>
