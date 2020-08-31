<div id="content-wrap"  class="{{ page.containerClass }}">
  <div id="content" class="wrapper">
    <div id="content-inner">
      <article class="article-container" itemscope itemtype="http://schema.org/Article">
        <div class="article-inner">
          <div class="article">
            <header class="article-header">
              <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
              <a href="{{ raw_link() }}" class="article-edit-link" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-pencil"></i> {{ __('page.improve') }}
              </a>
            </header>
            <div class="article-content" itemprop="articleBody">
              {{ add_page_anchors(page.content) }}
            </div>
            {{ partial('partial/dashboard-cta') }}
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
