require('../spec_helper')

const helpers = require('../../lib/helpers')
const cheerio = require('cheerio')

describe('lib/helpers', () => {
  const process = (str, isDocument) => {
    const $ = cheerio.load(str, {
      useHtmlParser2: true,
      decodeEntities: false,
    }, isDocument)

    return $.html()
  }

  describe('cheerio', () => {
    it('wraps document in html tag', () => {
      return snapshot(process('<p>foo</p>', true))
    })

    it('does not wrap fragment in html tag', () => {
      return snapshot(process('<p>foo</p>', false))
    })
  })

  describe('addPageAnchors', () => {
    return it('does not wrap fragment in html tag', () => {
      return snapshot(process('<p>foo</p>', false))
    })
  })

  return describe('addPageAnchors', () => {
    it('is noop if no headings found', () => {
      const str = '<p>foo</p>'

      return snapshot(helpers.addPageAnchors(str))
    })

    return it('does not wrap with <html>', () => {
      const str = '<h1 id="bar">foo</h1>'

      return snapshot(helpers.addPageAnchors(str))
    })
  })
})
