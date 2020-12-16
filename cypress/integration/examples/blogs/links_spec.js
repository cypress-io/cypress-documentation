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

  it('lists small links', () => {
    cy.get('.media-small').each((blogEl, i) => {
      cy.wrap(blogs.small[i]).then((blog) => {
        cy.wrap(blogEl)
        .contains('a', blog.title)
        .should('have.attr', 'href', blog.sourceUrl)
      })
    })
  })
})
