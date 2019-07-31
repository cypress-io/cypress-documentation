const YAML = require('yamljs')
const emojiStrip = require('emoji-strip')

const allBannersYaml = 'source/_data/banners.yml'

describe('Contentful driven banners', () => {
  it('displays all current banners with proper info', function () {
    cy.readFile(allBannersYaml)
    .then((yamlString) => YAML.parse(yamlString.replace(/\\u[\dA-F]{8}/gi, '')))
    .then((banners) => {
      if (typeof banners === 'undefined' || !banners || !banners.length) return this.skip()

      cy.visit('/')

      cy.get('#header .top-banners_item')
      .each((banner, i) => {
        const text = banner.children('.top-banners_item--body').html().trim()
        const { startDate, endDate } = banner.data()
        const btn = banner.children('.call-to-action')
        const btnText = btn.text().trim()
        const btnLink = btn.attr('href')

        expect(emojiStrip(text), `Banner #${i + 1} text is proper`).to.eq(banners[i].text.replace(/\r?\n|\r/g, ' '))
        expect(startDate, `Banner #${i + 1} startDate is proper`).to.eq(banners[i].startDate)
        expect(endDate, `Banner #${i + 1} endDate is proper`).to.eq(banners[i].endDate)
        expect(btnText, `Banner #${i + 1} call-to-action text is proper`).to.eq(banners[i].buttonText.trim())
        expect(btnLink, `Banner #${i + 1} call-to-action link is proper`).to.eq(banners[i].buttonLink)
      })
    })
  })
})
