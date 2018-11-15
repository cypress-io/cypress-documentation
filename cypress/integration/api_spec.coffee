YAML = require('yamljs')
_ = require('lodash')
{improveUrl} = require('./repo.coffee')

API_PATH = "/api/api/table-of-contents"
API_HTML = API_PATH + '.html'

describe "API", ->
  context "all events", ->
    PAGE = "/api/events/all-events.html"

    beforeEach ->
      cy.visit(PAGE)

    it "loads all events", ->
      cy.get('.article-title')
        .contains('All Events')

  context "Main Menu", ->
    it "goes straight to 'API' homepage", ->
      cy.visit('/')

      cy.contains('API')
        .click()
      cy.contains('h1', "Table of Contents")

      cy.url()
        .should('match', new RegExp(API_HTML))

  context "Header", ->
    beforeEach ->
      cy.visit(API_PATH + ".html")

    it "should have link to edit doc", ->
      cy.contains("a", "Improve this doc").as("editLink")
      # cy.get("@editLink").should("have.attr", "href")
      #     .and("include", API_PATH + ".md")
      cy.get("@editLink")
        .should("have.attr", "href")
        .and("include", improveUrl)

  context "Sidebar", ->
    beforeEach ->
      cy.visit(API_PATH + ".html")

      cy.readFile("source/_data/sidebar.yml").then (yamlString) ->
        @sidebar = YAML.parse(yamlString)
        @sidebarTitles = _.keys(@sidebar.api)

        @sidebarLinkNames =  _.reduce @sidebar.api, (memo, nestedObj, key) ->
          memo.concat(_.keys(nestedObj))
        , []

        @sidebarLinks =  _.reduce @sidebar.api, (memo, nestedObj, key) ->
          memo.concat(_.values(nestedObj))
        , []

      cy.readFile("themes/cypress/languages/en.yml").then (yamlString) ->
        @english = YAML.parse(yamlString)

    it "displays current page as highlighted", ->
      cy.get("#sidebar").find("a.current")
        .should("have.attr", "href").and("include", API_HTML)

    it "displays English titles in sidebar", ->
      cy.get("#sidebar")
        .find(".sidebar-title strong").each (displayedTitle, i) ->
          englishTitle  = @english.sidebar.api[@sidebarTitles[i]]
          expect(displayedTitle.text()).to.eq(englishTitle)

    it "displays English link names in sidebar", ->
      cy.get("#sidebar")
        .find(".sidebar-link").first(5).each (displayedLink, i) ->
          englishLink  = @english.sidebar.api[@sidebarLinkNames[i]]
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
          .each (displayedLink, i) ->
            englishLink  = @english.sidebar.api[@sidebarLinkNames[i]]
            expect(displayedLink.text().trim()).to.eq(englishLink)

  context "Table of Contents", ->
    beforeEach ->
      cy.visit(API_PATH + ".html")

    it "displays toc", ->
      ## skip running this test if we are in interactive mode
      return @skip() if Cypress.config("isInteractive")

      cy.get('.sidebar-link').each (linkElement) ->
        cy.log(linkElement[0].innerText)
        cy.request(linkElement[0].href).its('body').then (body) ->
          $body = Cypress.$(body)

          $h1s = $body.find('.article h1').not('.article-title')
          $h2s = $body.find('.article h2')

          $h1links = $body.find('.toc-level-1>.toc-link')
          $h2links = $body.find('.toc-level-2>.toc-link')

          if $h1links.length
            $h1s.each (i, el) ->
              $h1 = Cypress.$(el)
              $link = $h1links.eq(i)

              expect($link.text()).to.eq($h1.text())
              expect($link.attr('href')).to.eq('#' + $h1.attr('id'))

          if $h2links.length
            $h2s.each (i, el) ->
              $h2 = Cypress.$(el)
              $link = $h2links.eq(i)

              expect($link.text()).to.eq($h2.text())
              expect($link.attr('href')).to.eq('#' + $h2.attr('id'))

  context "Pagination", ->
    describe "first page", ->
      beforeEach ->
        cy.visit("api/introduction/api.html")

      it "does not display Prev link on first page", ->
        cy.get(".article-footer-prev").should("not.exist")

      it "displays Next link", ->
        cy.get(".article-footer-next").should("have.attr", "href").and("include", "assertions.html")

    describe "Next/Prev", ->
      FIRST_PAGE = "and.html"
      NEXT_PAGE = "as.html"

      beforeEach ->
        cy.visit("api/commands/#{FIRST_PAGE}")
        cy.get(".article-footer-next").click()
        cy.url().should("contain", NEXT_PAGE)

      it "should display Prev link", ->
        cy.get(".article-footer-prev").should("be.visible")

      it "clicking on Prev link should go back to original page", ->
        cy.get(".article-footer-prev").click()
        cy.url().should("contain", FIRST_PAGE)
