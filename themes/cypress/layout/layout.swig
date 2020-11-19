<!DOCTYPE html>
<html lang="{{ page.lang }}">
{{ partial('partial/head') }}
<body>
  {{ partial('partial/google-tag-manager-noscript')}}

  <div id="container">
    {{ partial('partial/header', {})  }}

    <div>
      {{ partial('partial/header', { className: 'header-top-hidden' })  }}
      {{ body }}
    </div>
  </div>

  <div id="mobile-nav-dimmer"></div>

  {{ partial('partial/mobile_nav') }}
  {{ partial('partial/after_footer') }}
</body>
</html>
