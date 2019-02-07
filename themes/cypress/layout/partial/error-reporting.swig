{% if config.sentry %}
 <script src="https://browser.sentry-cdn.com/4.5.3/bundle.min.js" crossorigin="anonymous"></script>
 <script>
  if (window.env === 'production') {
    Sentry.init({
      dsn: '{{ config.sentry.dsn }}', 
      environment: window.env
    })
  }
 </script>
{% endif %}
