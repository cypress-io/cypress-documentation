<head prefix="og: http://ogp.me/ns#">
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>{% if page.title %}{{ page.title }} | {{ config.title }}{% else %}{{ config.subtitle }} | {{ config.title }}{% endif %}</title>

  <!-- Canonical links -->
  <link rel="canonical" href="{{ url }}">
  <!-- Alternate links -->
  {% if page.layout == 'page' or page.layout == 'index' %}
    {% for lang in site.data.languages %}
      <link rel="alternate" hreflang="{{ loop.key }}" href="{{ canonical_url(loop.key) }}">
      {% if loop.key == 'en' %}
        <link rel="alternate" hreflang="x-default" href="{{ canonical_url(loop.key) }}">
      {% endif %}
    {% endfor %}
  {% endif %}
  <script type="text/javascript">
    window.env = window.Cypress ? 'test' : '{{env.NODE_ENV}}'
  </script>

  <!-- Icon -->
  <link rel="icon" type="image/x-icon" href="/img/favicon.ico" sizes="16x16" />

  {{ css('fonts/vendor/roboto-fontface/css/roboto/roboto-fontface') }}
  {{ css('fonts/vendor/font-awesome/css/font-awesome') }}

  <!-- CSS -->
  <!-- build:css /css/style.css -->
  {{ css('css/vendor/docsearch') }}
  {{ css('css/cypress') }}
  <!-- endbuild -->

  {{ partial('error-reporting') }}

  <!-- Open Graph http://ogp.me/ -->
  {{ open_graph({
    type: website,
    fb_admins: config.facebook_admin_id,
    fb_app_id: config.facebook_app_id,
    twitter_id: config.twitter_username,
    twitter_site: config.twitter_username
  }) }}

  <!-- Google Analytics, Tag Manager, and Optimize -->
  {{ partial('google-plugins') }}
</head>
