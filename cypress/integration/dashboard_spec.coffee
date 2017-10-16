YAML = require('yamljs')
_ = require('lodash')
{improveUrl} = require('./repo.coffee')

DASHBOARD_PATH = "/dashboard/overview/features-dashboard"

describe "Dashboard", ->
  beforeEach ->
    cy.server()
    cy.visit(DASHBOARD_PATH + ".html")

  context "Main Menu", ->
    it "Menu goes straight to 'The Cypress Dashboard'", ->
      cy.visit('/')

      cy.contains('Dashboard')
        .click()
      cy.contains('h1', "The Cypress Dashboard")

      cy.url()
        .should('include', DASHBOARD_PATH)

  context "Header", ->
    it "should have link to edit doc", ->
      cy.contains("a", "Improve this doc").as("editLink")
      # cy.get("@editLink").should("have.attr", "href")
      #     .and("include", GUIDES_PATH + ".md")
      cy.get("@editLink").should("have.attr", "href")
        .and("include", improveUrl)

  context "Sidebar", ->
    beforeEach ->
      cy.readFile("source/_data/sidebar.yml").then (yamlString) ->
        @sidebar = YAML.parse(yamlString)
        @sidebarTitles = _.keys(@sidebar.dashboard)

        @sidebarLinkNames =  _.reduce @sidebar.dashboard, (memo, nestedObj, key) ->
           memo.concat(_.keys(nestedObj))
        , []

        @sidebarLinks =  _.reduce @sidebar.dashboard, (memo, nestedObj, key) ->
             memo.concat(_.values(nestedObj))
          , []

      cy.readFile("themes/cypress/languages/en.yml").then (yamlString) ->
          @english = YAML.parse(yamlString)

    it "displays current page as highlighted", ->
      cy.get("#sidebar").find(".current")
        .should("have.attr", "href").and("include", DASHBOARD_PATH + ".html")

    it "displays English titles in sidebar", ->
      cy.get("#sidebar")
        .find(".sidebar-title").each (displayedTitle, i) ->
          englishTitle  = @english.sidebar.dashboard[@sidebarTitles[i]]
          expect(displayedTitle.text()).to.eq(englishTitle)

    it "displays English link names in sidebar", ->
      cy.get("#sidebar")
        .find(".sidebar-link").first(5).each (displayedLink, i) ->
          englishLink  = @english.sidebar.dashboard[@sidebarLinkNames[i]]
          expect(displayedLink.text().trim()).to.eq(englishLink)

    it "displays English links in sidebar", ->
      cy.get("#sidebar")
        .find(".sidebar-link").each (displayedLink, i) ->
          sidebarLink  = @sidebarLinks[i]
          expect(displayedLink.attr('href')).to.include(sidebarLink)

    context "mobile sidebar menu", ->
      beforeEach ->
        cy.viewport('iphone-6')

      it "displays sidebar in mobile menu on click", ->
        cy.get("#mobile-nav-toggle").click()
        cy.get("#mobile-nav-inner").should("be.visible")
          .find(".sidebar-li")
          .first(1).each (displayedLink, i) ->
            englishLink  = @english.sidebar.dashboard[@sidebarLinkNames[i]]
            expect(displayedLink.text().trim()).to.eq(englishLink)
