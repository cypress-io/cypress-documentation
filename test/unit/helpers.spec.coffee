require("../spec_helper")
# snapshot = require("snap-shot-it")
helpers = require("../../lib/helpers")
cheerio = require("cheerio")

describe "lib/helpers", ->
  process = (str, isDocument) ->
    $ = cheerio.load(str, {
      useHtmlParser2: true
      decodeEntities: false
    }, isDocument)
    $.html()

  describe "cheerio", ->
    it "wraps document in html tag", ->
      snapshot(process("<p>foo</p>", true))

    it "does not wrap fragment in html tag", ->
      snapshot(process("<p>foo</p>", false))

  describe "addPageAnchors", ->
    it "does not wrap fragment in html tag", ->
      snapshot(process("<p>foo</p>", false))

  describe "addPageAnchors", ->
    it "is noop if no headings found", ->
      str = "<p>foo</p>"
      snapshot(helpers.addPageAnchors(str))

    it "does not wrap with <html>", ->
      str = '<h1 id="bar">foo</h1>'
      snapshot(helpers.addPageAnchors(str))
