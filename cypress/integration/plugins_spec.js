const yaml = require('yamljs')
const _ = require('lodash')

describe.skip('Plugins', () => {
  let plugins = []

  before(() => {
    const pluginsYaml = 'source/_data/plugins.yml'

    cy.readFile(pluginsYaml).then((yamlString) => {
      plugins = yaml.parse(yamlString)
    })
  })

  beforeEach(() => {
    cy.visit('plugins')
    cy.contains('h1', 'Plugins').should('be.visible')
  })

  it('shows all plugins categories', function () {
    plugins.forEach((plugin) => {
      cy.get(`[data-cy="plugin-${_.kebabCase(plugin.name)}"]`).within(() => {
        cy.get('h2').contains(plugin.name).should('be.visible')
      })
    })
  })

  it('shows all plugin title and badge', () => {
    plugins.forEach((pluginCategory) => {
      cy.get(`[data-cy="plugin-${_.kebabCase(pluginCategory.name)}"]`).within(() => {
        pluginCategory.plugins.forEach((plugin) => {
          cy.get('.plugins-list li').find('.plugin-title h3').contains(plugin.name).closest('li').within(() => {
            cy.root().find('.plugin-title h3').contains(plugin.name).should('be.visible')
            cy.root().find('.plugin-badge').contains(plugin.badge).should('be.visible')
          })
        })
      })
    })
  })
})
