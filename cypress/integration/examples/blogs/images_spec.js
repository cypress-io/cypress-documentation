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
    let urls = []

    cy.get('.media-large .media img')
    .should('have.length.gt', 10)
    .each(($img, i) => {
      const assetHash = getAssetCacheHash($img)
      const imgSrc = assetHash.length
        ? addAssetCacheHash(blogs.large[i].img, assetHash)
        : blogs.large[i].img

      expect($img).to.have.attr('src', imgSrc)
      const url = Cypress.config('baseUrl') + imgSrc

      urls.push(url)
    })
    .task('checkUrls', urls)
  })
})
