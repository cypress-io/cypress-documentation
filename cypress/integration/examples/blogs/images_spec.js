/// <reference types="cypress" />

const YAML = require('yamljs')

const getAssetCacheHash = ($img) => {
  const src = $img.attr('src').split('.')

  return src.length >= 3 ? src.slice(-2, -1).pop() : ''
}

const addAssetCacheHash = (assetSrc, hash) => {
  let parsedSrc = assetSrc.split('.')

  parsedSrc.splice(-1, 0, hash)

  return parsedSrc.join('.')
}

describe('Blogs', function () {
  let blogs = []

  before(() => {
    cy.readFile('source/_data/blogs.yml')
    .then(function (yamlString) {
      blogs = YAML.parse(yamlString)
    })
  })

  beforeEach(() => {
    cy.visit('/examples/media/blogs-media.html')
    cy.contains('.article-title', 'Blogs').should('be.visible')
  })

  it('displays large blog imgs', () => {
    cy.get('.media-large .media img').each(($img, i) => {
      const assetHash = getAssetCacheHash($img)
      const imgSrc = assetHash.length
        ? addAssetCacheHash(blogs.large[i].img, assetHash)
        : blogs.large[i].img

      expect($img).to.have.attr('src', imgSrc)
      cy.request(Cypress.config('baseUrl') + imgSrc).its('status').should('equal', 200)
    })
  })
})
