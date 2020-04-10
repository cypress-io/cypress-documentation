To send the data and results of your tests to the Dashboard, Cypress needs free access to some URLs. So, if you are running the tests from within a restrictive VPN, you need to add some URL's to your whitelist so that Cypress can have effective communication with the Dashboard.
The URL's are the following:

- Cypress API: https://**API**.cypress.io
- Dashboard App: https://**dashboard**.cypress.io
- CDN Download of Cypress Binary: https://**download**.cypress.io
- Authenticate API: https://**authenticate**.cypress.io
- Asset CDN (Org logos, Icons, CI Video Uploads, Screenshots, etc.): https://**assets**.cypress.io
- URL Shortener for link redirect: https://**on**.cypress.io
- Cypress Docs: https://**docs**.cypress.io