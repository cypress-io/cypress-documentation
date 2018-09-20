require("../spec_helper")

fs = require("hexo-fs")
path = require("path")
Promise = require("bluebird")
urlGenerator = require("../../lib/url_generator")

data = {
  guides: {
    'getting-started': {
      'why-cypress': 'why-cypress.html',
      'next-steps': 'next-steps.html'
    },
    'cypress-basics': {
      'overview': 'overview.html',
      'core-concepts': 'core-concepts.html',
      'known-issues': 'known-issues.html'
    },
  }
  api: {
    welcome: {
      api: 'api.html'
    },
    commands: {
      and: 'and.html',
      as: 'as.html',
    },
  }
}

describe "lib/url_generator", ->
  describe ".normalizeNestedPaths", ->
    it "flattens object and returns each keypath to the value", ->
      expect(urlGenerator.normalizeNestedPaths(data).flattened).to.deep.eq({
        "why-cypress": "guides/getting-started/why-cypress.html"
        "next-steps": "guides/getting-started/next-steps.html"
        "overview": "guides/cypress-basics/overview.html"
        "core-concepts": "guides/cypress-basics/core-concepts.html"
        "known-issues": "guides/cypress-basics/known-issues.html"
        "api": "api/welcome/api.html"
        "and": "api/commands/and.html"
        "as": "api/commands/as.html"
      })
      return undefined

    it "expands object keypaths on the values", ->
      expect(urlGenerator.normalizeNestedPaths(data).expanded).to.deep.eq({
        guides: {
          'getting-started': {
            'why-cypress': 'guides/getting-started/why-cypress.html',
            'next-steps': 'guides/getting-started/next-steps.html'
          },
          'cypress-basics': {
            'overview': 'guides/cypress-basics/overview.html',
            'core-concepts': 'guides/cypress-basics/core-concepts.html',
            'known-issues': 'guides/cypress-basics/known-issues.html'
          },
        }
        api: {
          welcome: {
            api: 'api/welcome/api.html'
          },
          commands: {
            and: 'api/commands/and.html',
            as: 'api/commands/as.html',
          },
        }
      })
      return undefined

  describe ".findFileBySource", ->
    it "finds by key", ->
      expect(urlGenerator.findFileBySource(data, "core-concepts")).to.eq(
        "guides/cypress-basics/core-concepts.html"
      )
      return undefined

    it "finds by property", ->
      expect(urlGenerator.findFileBySource(data, "guides/cypress-basics/overview")).to.eq(
        "guides/cypress-basics/overview.html"
      )
      return undefined

  describe ".validateAndGetUrl", ->
    it "fails when given undefined href", ->
      urlGenerator.validateAndGetUrl(data, undefined, 'foo', 'content')
      .then ->
        throw new Error("should have caught error")
      .catch (err) ->
        [
          "A url tag was not passed an href argument."
          "The source file was: foo"
          "url tag's text was: content",
        ].forEach (msg) ->
          expect(err.message).to.include(msg)

    it "verifies local file and caches subsequent requests", ->
      urlGenerator.validateAndGetUrl(data, "and#notes", "", "")
      .then (pathToFile) ->
        expect(pathToFile).to.eq("/api/commands/and.html#notes")

        urlGenerator.validateAndGetUrl(data, "and#notes", "", "")
      .then (pathToFile) ->
        expect(pathToFile).to.eq("/api/commands/and.html#notes")

    it "verifies external url with anchor href matching hash", ->
      urlGenerator.validateAndGetUrl(data, "https://www.google.com/#assertions")
      .then (url) ->
        expect(url).to.eq("https://www.google.com/#assertions")

        urlGenerator.validateAndGetUrl(data, "https://www.google.com/#assertions")
      .then (url) ->
        expect(url).to.eq("https://www.google.com/#assertions")

    it "resolves cached values in a promise", ->
      urlGenerator.cache.set("foo", "bar")
      .then ->
        urlGenerator.validateAndGetUrl(data, "foo")
        .then (url) ->
          expect(url).to.eq("bar")
