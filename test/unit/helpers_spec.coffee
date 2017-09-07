require("../spec_helper")
snapshot = require("snap-shot-it")
helpers = require("../../lib/helpers")

describe "lib/helpers", ->
  context "cheerio", ->
    cheerio = require("cheerio")
    process = (str, isDocument) ->
      $ = cheerio.load(str, {
        useHtmlParser2: true
        decodeEntities: false
      }, isDocument)
      $.html()

    it "wraps document in html tag", ->
      snapshot(process("<p>foo</p>", true))

    it "does not wrap fragment in html tag", ->
      snapshot(process("<p>foo</p>", false))

  context "addPageAnchors", ->

    expects = (str, expected) ->
      expect(helpers.addPageAnchors(str)).to.eq(expected)

    it "does not wrap fragment in html tag", ->
      snapshot(process("<p>foo</p>", false))

  context "addPageAnchors", ->
    it "is noop if no headings found", ->
      str = "<p>foo</p>"
      snapshot(helpers.addPageAnchors(str))

    it "does not wrap with <html>", ->
      str = '<h1 id="bar">foo</h1>'
      snapshot(helpers.addPageAnchors(str))
