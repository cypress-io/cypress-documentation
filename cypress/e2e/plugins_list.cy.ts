describe('Plugins list', () => {
  const search = '[data-cy=plugins-search]'
  const categoryFilter = '[data-cy=plugins-category-filter]'
  const maintainerFilter = '[data-cy=plugins-maintainer-filter]'
  const resultCount = '[data-cy=plugins-result-count]'
  const sections = '[data-cy=plugins-category]'
  const cards = 'li[data-maintainer]'

  const countFromText = (text: string) =>
    Number((text.match(/Showing (\d+)/) || [])[1])

  const visitList = (url = '/app/plugins/plugins-list') => {
    cy.visit(url)
    // Wait for the component to hydrate so typing/clicking updates React state
    // (otherwise interactions can race hydration and be dropped).
    cy.get('[data-cy=plugins-list]').should(
      'have.attr',
      'data-hydrated',
      'true'
    )
  }

  beforeEach(() => {
    visitList()
  })

  it('explains who maintains the plugins', () => {
    cy.contains('p', /doesn.t review vendor or community plugins/).should(
      'be.visible'
    )
    cy.get(maintainerFilter).should('be.visible')
  })

  it('lists many plugins with a result count by default', () => {
    cy.get(resultCount)
      .invoke('text')
      .then((text) => expect(countFromText(text)).to.be.greaterThan(50))
  })

  it('narrows the list with the search box', () => {
    cy.get(resultCount)
      .invoke('text')
      .then((text) => {
        const before = countFromText(text)
        cy.get(search).type('accessibility')
        cy.get('[data-cy="plugin-cypress-axe"]').should('be.visible')
        cy.get('[data-cy="plugin-cypress-vite"]').should('not.exist')
        cy.get(resultCount)
          .invoke('text')
          .then((filtered) =>
            expect(countFromText(filtered)).to.be.lessThan(before)
          )
      })
  })

  it('reflects the search in a shareable URL', () => {
    cy.get(search).type('accessibility')
    cy.location('search').should('contain', 'search=accessibility')
  })

  it('applies a search from the URL', () => {
    visitList('/app/plugins/plugins-list?search=cucumber')
    cy.get(search).should('have.value', 'cucumber')
    cy.get('[data-cy="plugin-Cucumber"]').should('be.visible')
    cy.get('[data-cy="plugin-cypress-vite"]').should('not.exist')
  })

  it('clears the search with the clear button', () => {
    // The clear button only appears once there is a query.
    cy.get('[data-cy=plugins-search-clear]').should('not.exist')
    cy.get(search).type('accessibility')
    cy.get('[data-cy=plugins-search-clear]').click()
    cy.get(search).should('have.value', '')
    cy.get('[data-cy=plugins-search-clear]').should('not.exist')
    cy.get('[data-cy="plugin-cypress-vite"]').should('exist')
    cy.location('search').should('not.contain', 'search=')
  })

  it('shows an empty state when nothing matches', () => {
    cy.get(search).type('zzzznotarealpluginxyz')
    cy.get(resultCount).should('contain', 'Showing 0 plugins')
    cy.contains('No plugins match your search or filters').should('be.visible')
    cy.get('[data-cy=plugins-clear-filters]').click()
    cy.get(search).should('have.value', '')
    cy.get(sections).should('have.length.greaterThan', 10)
  })

  it('filters down to a single category from the dropdown', () => {
    // Options are grouped by stage and show a live count.
    cy.get(`${categoryFilter} optgroup`)
      .first()
      .should('have.attr', 'label', 'Set up')
    cy.get(`${categoryFilter} option[value="accessibility"]`).should(
      'contain',
      'Accessibility (4)'
    )
    cy.get(categoryFilter).select('accessibility')
    cy.get(sections).should('have.length', 1)
    cy.contains('h2', 'Accessibility').should('be.visible')
    cy.get(resultCount).should('contain', 'in Accessibility')
    cy.get('[data-cy="plugin-cypress-axe"]').should('exist')
    cy.get('[data-cy="plugin-cypress-vite"]').should('not.exist')

    cy.get(categoryFilter).select('all')
    cy.get(sections).should('have.length.greaterThan', 10)
  })

  it('filters by maintainer', () => {
    cy.get(maintainerFilter).select('official')
    cy.get(cards).should('have.length.greaterThan', 5)
    cy.get(`${cards}:not([data-maintainer="official"])`).should('not.exist')
    cy.get('[data-cy="plugin-cypress-axe"]').should('not.exist')

    cy.get(maintainerFilter).select('vendor')
    cy.get(cards).should('have.length.greaterThan', 5)
    cy.get(`${cards}:not([data-maintainer="vendor"])`).should('not.exist')
    cy.get('[data-cy="plugin-Percy"] [data-cy=plugin-maintainer]').should(
      'have.text',
      'Built by Percy'
    )

    cy.get(maintainerFilter).select('community')
    cy.get(`${cards}:not([data-maintainer="community"])`).should('not.exist')
    cy.get('[data-cy="plugin-cypress-axe"]').should('exist')
  })

  it('credits community plugins to an owner, never a website', () => {
    cy.get(
      '[data-cy="plugin-cypress-accessibility-checker"] [data-cy=plugin-maintainer]'
    ).should('have.text', 'Community · IBM')
    cy.get(`${cards}[data-maintainer="community"] [data-cy=plugin-maintainer]`)
      .should('have.length.greaterThan', 50)
      .each(($byline) => {
        expect($byline.text()).not.to.match(/\.[a-z]{2,}$/)
      })
  })

  it('resolves every docs link to a category anchor', () => {
    cy.task<string[]>('anchorsLinkedTo', '/app/plugins/plugins-list').then(
      (anchors) => {
        expect(anchors, 'anchors linked from docs').to.include(
          'custom-commands'
        )
        anchors.forEach((anchor) => cy.get(`[id="${anchor}"]`).should('exist'))
      }
    )
  })

  it('keeps earlier anchors on a renamed or merged category', () => {
    cy.readFile('src/data/plugins.json').then((data) => {
      const aliased = data.plugins.filter(
        (category: { aliases?: string[] }) => category.aliases
      )
      expect(aliased, 'categories with aliases').not.to.be.empty
      aliased.forEach((category: { name: string; aliases: string[] }) => {
        category.aliases.forEach((alias) => {
          cy.get(`[id="${alias}"]`)
            .closest(sections)
            .find('h2')
            .should('have.text', category.name)
        })
      })
    })
  })

  it('lands a category link below the navbar, stage name in view', () => {
    // A heading anchor, then an alias anchor.
    ;['custom-commands', 'email'].forEach((anchor) => {
      visitList(`/app/plugins/plugins-list#${anchor}`)
      cy.get('.navbar').then(($navbar) => {
        const navbarBottom = $navbar[0].getBoundingClientRect().bottom
        cy.get(`[id="${anchor}"]`)
          .closest(sections)
          .find('[data-cy=plugins-category-stage]')
          .should(($stage) => {
            expect($stage[0].getBoundingClientRect().top).to.be.within(
              navbarBottom,
              navbarBottom + 80
            )
          })
      })
    })
  })

  it('marks each card with its maintainer type', () => {
    cy.get(cards).each(($card) => {
      const card = $card[0]
      const expected = card.dataset.deprecated
        ? 'deprecated'
        : card.dataset.maintainer
      expect(
        card.querySelector('[data-mark]')?.getAttribute('data-mark'),
        card.dataset.cy
      ).to.equal(expected)
    })
  })

  it('groups categories by stage, alphabetically within each stage', () => {
    cy.readFile('src/data/plugins.json').then((data) => {
      const stageOrder: string[] = data.stages.map(
        (stage: { name: string }) => stage.name
      )
      cy.get(sections).then(($sections) => {
        const rows = [...$sections].map((section) => ({
          stage: section
            .querySelector('[data-cy=plugins-category-stage]')
            ?.textContent?.trim(),
          name: section.querySelector('h2')?.textContent?.trim() || '',
        }))
        const ranks = rows.map((row) => stageOrder.indexOf(row.stage || ''))
        expect(ranks, 'every section names a known stage').not.to.include(-1)
        expect(ranks).to.deep.equal([...ranks].sort((a, b) => a - b))
        stageOrder.forEach((stage) => {
          const names = rows.filter((r) => r.stage === stage).map((r) => r.name)
          expect(names, stage).to.deep.equal(
            [...names].sort((a, b) => a.localeCompare(b))
          )
        })
      })
    })
  })

  it('names the stage and explains each category above its cards', () => {
    cy.get('[data-category="accessibility"]').within(() => {
      cy.get('[data-cy=plugins-category-stage]')
        .should('be.visible')
        .and('have.text', 'Check')
      cy.contains('h2', 'Accessibility').should('be.visible')
      cy.contains('Catch accessibility issues').should('be.visible')
    })
  })

  it('lists Cypress-built plugins first in each category', () => {
    cy.get(categoryFilter).select('component-testing')
    cy.get(cards).then(($cards) => {
      const ranks = [...$cards].map((card) =>
        card.dataset.deprecated
          ? 2
          : card.dataset.maintainer === 'official'
            ? 0
            : 1
      )
      expect(ranks[0]).to.equal(0)
      // Ranks appear in non-decreasing order (Cypress → community → deprecated).
      expect(ranks).to.deep.equal([...ranks].sort((a, b) => a - b))
    })
  })

  it('sorts by most recently updated', () => {
    cy.get('[data-cy=plugins-sort]').select('Recently updated')
    cy.get(sections).each(($section) => {
      const dates = [...$section[0].querySelectorAll(cards)].map((card) => {
        const published = card.getAttribute('data-published')
        return published ? Date.parse(published) : 0
      })
      expect(dates).to.deep.equal([...dates].sort((a, b) => b - a))
    })
  })

  it('lists no deprecated plugins', () => {
    // Deprecated plugins are curated out of the list. (Enrichment auto-flags a
    // plugin deprecated when it is unpublished or moved, which is the signal to
    // remove it.)
    cy.get(cards).should('have.length.greaterThan', 50)
    cy.get(`${cards}[data-deprecated]`).should('not.exist')
  })

  it('lists the maintained testing-library successor', () => {
    cy.get(search).type('testing-library')
    cy.get('[data-cy="plugin-@testing-library/cypress"]').should('be.visible')
    cy.get('[data-cy="plugin-cypress-testing-library"]').should('not.exist')
  })

  it('shows maintainer and freshness on a card, and npm details on focus', () => {
    cy.get(search).type('cucumber')
    cy.get('[data-cy="plugin-Cucumber"]').scrollIntoView()
    cy.get('[data-cy="plugin-Cucumber"]').within(() => {
      cy.get('[data-cy=plugin-maintainer]').should('be.visible')
      cy.contains('Updated').should('be.visible')
      // Hidden at rest only where the browser reports hover support (headless
      // runs report none and show it always), so assert the focus state only.
      cy.get('h3 a').focus()
      cy.get('[data-cy=plugin-cypress-range]').should('be.visible')
      cy.get('a[href*="npmjs.com/package/"]').should('be.visible')
    })
  })

  it('opens plugin links in a new tab safely', () => {
    cy.get('[data-cy="plugin-cypress-axe"] h3 a')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
  })

  it('keeps every filter usable on small screens', () => {
    cy.viewport(375, 800)
    cy.get(search).should('be.visible')
    cy.get(maintainerFilter).should('be.visible')
    cy.get(categoryFilter).should('be.visible').select('accessibility')
    cy.get(sections).should('have.length', 1)
  })
})
