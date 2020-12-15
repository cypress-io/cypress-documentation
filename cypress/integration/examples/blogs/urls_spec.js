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

  it('lists large blog urls', () => {
    cy.get('.media-large .media h2 a').each((blogTitle, i) => {
      expect(blogTitle).to.have.attr('href', blogs.large[i].url)
      expect(blogTitle).to.contain(blogs.large[i].title)
    })
  })
})
