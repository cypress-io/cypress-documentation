<footer class="wrapper">
  <div class="inner">
    <div class="top">
      <div class="footer-nav">
        <h5>Get Started</h5>
        <ul>
          <li>
            <a href="https://on.cypress.io/why-cypress">Why Cypress</a>
          </li>
          <li>
            <a href="https://on.cypress.io/installing-cypress">Install Cypress</a>
          </li>
          <li>
            <a href="https://on.cypress.io/writing-your-first-test">Write your first test</a>
          </li>
          <li>
            <a href="https://on.cypress.io/testing-your-app">Test your app</a>
          </li>
        </ul>
      </div>
      <div class="footer-nav">
        <h5>Support</h5>
        <ul>
          <li>
            <a href="https://docs.cypress.io">Documentation</a>
          </li>
          <li>
            <a href="https://on.cypress.io/chat">Chat</a>
          </li>
          <li>
            <a href="https://on.cypress.io/faq">FAQ</a>
          </li>
          <li>
            <a href="https://on.cypress.io/examples">Examples</a>
          </li>
        </ul>
      </div>
      <div class="footer-nav">
        <h5>Developers</h5>
        <ul>
          <li>
            <a href="https://github.com/cypress-io/cypress">Github repo</a>
          </li>
          <li>
            <a href="https://on.cypress.io/contributing">Contribute</a>
          </li>
          <li>
            <a href="https://on.cypress.io/changelog">Changelog</a>
          </li>
          <li>
            <a href="https://on.cypress.io/roadmap">Roadmap</a>
          </li>
        </ul>
      </div>
      <div class="footer-nav">
        <h5>Company</h5>
        <ul>
          <li>
            <a href="https://www.cypress.io/about">About</a>
          </li>
          <li>
            <a href="https://www.cypress.io/jobs">Jobs</a>
          </li>
          <li>
            <a href="https://on.cypress.io/terms-of-use">Terms</a>
          </li>
          <li>
            <a href="https://on.cypress.io/privacy-policy">Privacy</a>
          </li>
          <li>
            <a href="https://on.cypress.io/blogs-media">Media</a>
          </li>
        </ul>
      </div>
      <div class="footer-form">
        <h5>Send updates to my inbox</h5>
        {{ partial('partial/subscribe-form') }}
        <div id="footer-social">
          <ul class="list-unstyled list-inline">
            <li>
              <a href="https://github.com/{{ config.github_main_repo }}">
                <i class="fa fa-github" title="Github Repo"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/{{ config.twitter_username }}">
                <i class="fa fa-twitter" title="@{{ config.twitter_username }}"></i>
              </a>
            </li>
            <li>
              <a href="https://facebook.com/{{ config.facebook_username }}">
                <i class="fa fa-facebook" title="Facebook"></i>
              </a>
            </li>
            <li>
              <a href="mailto:{{ config.email }}">
                <i class="fa fa-envelope" title="Email us"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom">
      <p id="footer-copyright">
        <script type="text/javascript">
          document.write("&copy " + new Date().getFullYear() + " Cypress.io");
        </script>
        <noscript>&copy; {{ moment(Date.now()).year() }} {{ config.author }}</noscript>
      </p>
    </div>
  </div>
</footer>
