YAML = require("yamljs")
_ = require("lodash")

describe "Main", ->
  beforeEach ->
    cy.server()
    cy.visit("/")
    cy.url().should("contain", "why-cypress")

  context "language select", ->
    it "selects English by default", ->
      cy.get("#lang-select").find("option")
        .contains("English").should("be.selected")

    it "lists languages", ->
      cy.readFile("source/_data/languages.yml").then (yamlString) ->
        @languages = YAML.parse(yamlString)
        @langValues = _.keys(@languages)
        @langNames = _.values(@languages)

      cy.get("#lang-select").find("option").each (lang, i) ->
        expect(lang).to.have.value(@langValues[i])
        expect(lang).to.contain(@langNames[i])    