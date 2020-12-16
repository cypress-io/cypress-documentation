/// <reference types="cypress" />
import { getBlogs, visitBlogsPage, getAssetCacheHash, addAssetCacheHash } from '../utils'

describe('Blogs', function () {
  let blogs = []

  before(() => {
    getBlogs().then((list) => {
      blogs = list
    })
  })

  beforeEach(visitBlogsPage)

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
