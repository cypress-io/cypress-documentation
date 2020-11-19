const YAML = require('yamljs')
const _ = require('lodash')

export const MAIN_NAV = [
  {
    name: 'Guides',
    path: '/guides/overview/why-cypress',
    firstPage: 'why-cypress.html',
    nextPage: 'key-differences.html',
    titleKey: 'why-cypress',
  },
  {
    name: 'API',
    path: '/api/api/table-of-contents',
    firstPage: 'table-of-contents.html',
    nextPage: 'catalog-of-events.html',
  },
  {
    name: 'Plugins',
    path: '/plugins/',
  },
  {
    name: 'Examples',
    path: '/examples/examples/recipes',
    firstPage: 'recipes.html',
    nextPage: 'tutorials.html',
  },
  {
    name: 'FAQ',
    path: '/faq/questions/using-cypress-faq',
    firstPage: 'using-cypress-faq.html',
    nextPage: 'general-questions-faq.html',
  },
]

beforeEach(function () {
  this.repo = 'https://github.com/cypress-io/cypress-documentation'
  this.improveUrl = `${this.repo}/edit/develop`

  cy.readFile('source/_data/languages.yml').then(function (yamlString) {
    this.languages = YAML.parse(yamlString)
    this.langValues = _.keys(this.languages)

    this.langNames = _.values(this.languages)

    cy.wrap(this.langValues).each((lang) => {
      cy.readFile(`themes/cypress/languages/${lang}.yml`)
      .then(function (yamlString) {
        this[lang] = YAML.parse(yamlString)
      })
    })
  })
})
