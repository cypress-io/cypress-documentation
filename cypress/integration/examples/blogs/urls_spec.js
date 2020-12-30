/// <reference types="cypress" />
import { getBlogs, visitBlogsPage } from '../utils'

describe('Blogs', function () {
  let blogs = []

  before(() => {
    getBlogs().then((list) => {
      blogs = list
    })
  })

  beforeEach(visitBlogsPage)

  it('lists large blog urls', () => {
    cy.get('.media-large .media h2 a').each((blogTitle, i) => {
      expect(blogTitle).to.have.attr('href', blogs.large[i].url)
      expect(blogTitle).to.contain(blogs.large[i].title)
    })
  })
})
