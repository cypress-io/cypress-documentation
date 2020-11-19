<div id="content-wrap" class="{{ page.containerClass }} toc-top">
  <div id="content" class="wrapper">
    <div id="content-inner">
      {{ partial('partial/sidebar') }}
      <article class="article-wrapper">
        <div id="article">
          <div class="article" itemscope itemtype="http://schema.org/Article">
            <header class="article-header">
              <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
              <a href="{{ raw_link() }}" class="article-edit-link"><i class="fa fa-pencil"></i> {{ __('page.improve') }}</a>
            </header>
            {{ toc(page.content, {list_number: false, max_depth: 2}) }}
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
    </div>
  </div>
</div>
