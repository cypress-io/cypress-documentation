const YAML = require('yamljs')
const utf8 = require('utf8')

const allBannersYaml = 'source/_data/banners.yml'

describe('Contentful driven banners', () => {
  it('displays all current banners with proper info', function () {
    cy.readFile(allBannersYaml)
    .then((yamlString) => YAML.parse(yamlString))
    .then((banners) => {
      if (typeof banners === 'undefined' || !banners || !banners.length) return this.skip()

      cy.visit('/')

      cy.get('#header .top-banners_item')
      .each((banner, i) => {
        cy.wrap(banner)
        .find('.top-banners_item--body')
        .invoke('html').invoke('trim')
        .should((bannerHTML) => {
          expect(utf8.encode(bannerHTML), `Banner #${i + 1} text is proper`).to.eq(banners[i].text)
        })

        cy.wrap(banner)
        .invoke('data').its('startDate')
        .should('eq', banners[i].startDate)

        cy.wrap(banner)
        .invoke('data').its('endDate')
        .should('eq', banners[i].endDate)

        cy.wrap(banner)
        .find('.call-to-action')
        .invoke('text').invoke('trim')
        .should('eq', banners[i].buttonText.trim())
        // const btnLink = btn.attr('href')

        cy.wrap(banner)
        .find('.call-to-action')
        .should('have.attr', 'href')
        .and('eq', banners[i].buttonLink)
      })
    })
  })
})
