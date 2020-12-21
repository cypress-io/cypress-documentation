/// <reference types="cypress" />

const YAML = require('yamljs')

export const getAssetCacheHash = ($img) => {
  const src = $img.attr('src').split('.')

  return src.length >= 3 ? src.slice(-2, -1).pop() : ''
}

export const addAssetCacheHash = (assetSrc, hash) => {
  let parsedSrc = assetSrc.split('.')

  parsedSrc.splice(-1, 0, hash)

  return parsedSrc.join('.')
}

/**
 * Reads the blogs YML file and converts it to the JavaScript array.
 */
export const getBlogs = () => {
  return cy.readFile('source/_data/blogs.yml').then(YAML.parse)
}

/**
 * Visits the blogs page and waits for it to load.
 */
export const visitBlogsPage = () => {
  cy.visit('/examples/media/blogs-media.html')
  cy.contains('.article-title', 'Blogs').should('be.visible')
}
