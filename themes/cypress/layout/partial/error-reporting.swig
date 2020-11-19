{% if config.sentry %}
 <script src="https://browser.sentry-cdn.com/4.5.3/bundle.min.js" crossorigin="anonymous"></script>
 <script>
  if (window.env === 'production') {
    Sentry.init({
      dsn: '{{ config.sentry.dsn }}', 
      environment: window.env,
      // ignore ResizeObserver loop limit exceeded errors
      // https://github.com/cypress-io/cypress-documentation/issues/1426
      ignoreErrors: ['ResizeObserver']  
    })
  }
 </script>
{% endif %}
