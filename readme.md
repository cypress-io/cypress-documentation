# Cypress Documentation

[![CircleCI](https://circleci.com/gh/cypress-io/cypress-documentation.svg?style=svg&circle-token=8a0253363287ab85d52953467603a4099a360c0c)](https://circleci.com/gh/cypress-io/cypress-documentation)

The code for Cypress' Documentation including Guides, API, Examples, Dashboard & FAQ.

* https://docs.cypress.io

## Contributing

Please see our [Documentation Contributing Guideline](/CONTRIBUTING.md)

### Installing Dependencies

```shell
npm install

npm run build
```

### Starting the server

```shell
npm start
```

Visit [http://localhost:2222/](http://localhost:2222/)

### Writing Docs

#### Links

Links are all handled through our [cypress.on](https://github.com/cypress-io/cypress-on) api.

Link all pages but their name (property key) in `source/_data/sidebar.yml`

- https://on.cypress.io/NAME_OF_PAGE
- https://on.cypress.io/and
- https://on.cypress.io/visit
- https://on.cypress.io/unit-testing-recipe
- https://on.cypress.io/introduction-to-cypress
- https://on.cypress.io/writing-your-first-test
- https://on.cypress.io/general-questions-faq

### Linting

Danger 📛: because we are minifying client side code using Hexo plugin which in turn calls
`uglify`, the code should be strictly ES5. Thus everything inside the `theme` should
be linted with ES5 settings and not upgraded to ES6.

### Deploying

#### Preferred: deploy from CI

Look at `circle.yml` file in the root of the repo. It should have 
`deploy-docs-staging` and `deploy-docs-production` jobs, which only are triggered for right
branch and only after tests pass.

#### Should not be required: manual deploy

```shell
npm run deploy
```

Look at scripts in `cy_scripts` folder for deployment steps.

## MIT License

Copyright (c) 2017 Cypress.io https://cypress.io

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
