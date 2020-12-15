/// <reference types="cypress" />
const YAML = require('yamljs')

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
