/// <reference types="cypress" />
import { getAssetCacheHash, addAssetCacheHash } from './utils'

const YAML = require('yamljs')

describe('Examples', () => {
  describe('Talks', () => {
    let talks = []

    before(() => {
      let talksYaml = 'source/_data/talks.yml'

      cy.readFile(talksYaml).then(function (yamlString) {
        talks = YAML.parse(yamlString)
      })
    })

    beforeEach(() => {
      cy.visit('examples/media/talks-media.html')
      cy.contains('.article-title', 'Talks').should('be.visible')
    })

    it('lists talks', function () {
      cy.get('.media-large .media').each((talkEl, i) => {
        cy.wrap(talks.large[i]).then((talk) => {
          cy.wrap(talkEl).within(() => {
            if (talk.youtubeId) {
              cy.root()
              .find(`a[href='https://www.youtube.com/watch?v=${talk.youtubeId}']`)
              .contains(talk.title)
            } else if (talk.url) {
              cy.root()
              .find(`a[href='${talk.url}']`)
              .contains(talk.title)

              cy.root().find('img').then(($img) => {
                const assetHash = getAssetCacheHash($img)
                const imgSrc = assetHash.length
                  ? addAssetCacheHash(talk.img, assetHash)
                  : talk.img

                expect($img).to.have.attr('src', imgSrc)
                cy.request(Cypress.config('baseUrl') + imgSrc).its('status').should('equal', 200)
              })
            }
          })
        })
      })
    })
  })
})
