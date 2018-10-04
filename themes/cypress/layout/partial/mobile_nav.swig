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
  <div id="mobile-lang-select-wrap">
    <span id="mobile-lang-select-label"><i class="fa fa-globe"></i><span>{{ lang_name(page.lang) }}</span></span>
    <select aria-label="Select language" id="mobile-lang-select" data-canonical="{{ canonical_path_for_nav() }}">
      {% for lang in site.data.languages %}
        <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
      {% endfor %}
    </select>
  </div>
</nav>
