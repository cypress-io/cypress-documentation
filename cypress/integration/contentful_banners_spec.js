const YAML = require('yamljs')

const allBannersYaml = 'source/_data/banners.yml'

function emojiStrip (string, utf16Encoded = true) {
  if (!utf16Encoded) {
    return string.replace(/\\u[\dA-F]{8}/gi, '')
  }

  return string.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
}

describe('Contentful driven banners', () => {
  it('displays all current banners with proper info', function () {
    cy.task('readFileMaybe', allBannersYaml)
    .then((yamlString) => {
      if (typeof yamlString === 'undefined' || yamlString === null) return this.skip()

      const yamlObject = YAML.parse(emojiStrip(yamlString, false))

      // remove all outdated or future banners
      const setMyTimezoneToDate = (date) => new Date(Date.parse(date))

      return yamlObject.filter((banner) => {
        const now = new Date()
        const startDate = setMyTimezoneToDate(banner.startDate)
        const endDate = setMyTimezoneToDate(banner.endDate)

        return startDate <= now && now <= endDate
      })
    })
    .then((banners) => {
      if (typeof banners === 'undefined' || !banners || !banners.length) return this.skip()

      cy.visit('/')

      cy.get('#header .top-banners_item')
      .each((banner, i) => {
        cy.wrap(banner)
        .find('.top-banners_item--body')
        .invoke('text').invoke('trim')
        .should((bannerText) => {
          const yamlText = Cypress.$(banners[i].text).text().trim()

          expect(emojiStrip(bannerText), `Banner #${i + 1} text is proper`).to.eq(yamlText)
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
