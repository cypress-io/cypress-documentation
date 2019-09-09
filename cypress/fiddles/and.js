
const { stripIndent } = require('common-tags')

module.exports = {
  'and': {
    Usage: {
      html: stripIndent`
        <!-- there are no errors -->
        <div class="err"></div>
        <button>Login</button>
      `,
      test: stripIndent`
        cy.get('.err').should('be.empty').and('be.hidden') // Assert '.err' is empty & hidden
        cy.contains('Login').and('be.visible')             // Assert el is visible
        cy.wrap({ foo: 'bar' })
          .should('have.property', 'foo')                  // Assert 'foo' property exists
          .and('eq', 'bar')                                // Assert 'foo' property is 'bar'
      `,
    },
    Examples: {
      chain: {
        html: stripIndent`
          <button class="active">Active button</button>
        `,
        test: stripIndent`
          cy.get('button').should('have.class', 'active').and('not.be.disabled')
        `,
      },
      yields1: {
        html: stripIndent`
          <nav class="open">...</nav>
        `,
        test: stripIndent`
          cy
            .get('nav')                       // yields <nav>
            .should('be.visible')             // yields <nav>
            .and('have.class', 'open')        // yields <nav>
        `,
      },
      yields2: {
        html: stripIndent`
          <div style="font-family: sans-serif">
            <nav class="open">...</nav>
          </div>
        `,
        test: stripIndent`
          cy
            .get('nav')                       // yields <nav>
            .should('be.visible')             // yields <nav>
            .and('have.css', 'font-family')   // yields 'sans-serif'
            .and('match', /serif/)            // yields 'sans-serif'
        `,
      },
      value: {
        html: stripIndent`
          <!-- App Code -->
          <ul>
            <li>
              <a href="users/123/edit">Edit User</a>
            </li>
          </ul>
        `,
        test: stripIndent`
          cy
            .get('a')
            .should('contain', 'Edit User') // yields the anchor element
            .and('have.attr', 'href')       // yields string value of href
            .and('match', /users/)          // yields string value of href
            .and('not.include', '#')        // yields string value of href
        `,
      },
      'method and value': {
        html: stripIndent`
          <div id="header">
            <a class="active" href="/users">Users</a>
          </div>
        `,
        test: stripIndent`
          cy
            .get('#header a')
            .should('have.class', 'active')
            .and('have.attr', 'href', '/users')
        `,
      },
      'multiple p': {
        html: stripIndent`
          <div>
            <p class="text-primary">Hello World</p>
            <p class="text-danger">You have an error</p>
            <p class="text-default">Try again later</p>
          </div>
        `,
        test: stripIndent`
          cy
            .get('p')
            .should('not.be.empty')
            .and(($p) => {
              // should have found 3 elements
              expect($p).to.have.length(3)

              // make sure the first contains some text content
              expect($p.first()).to.contain('Hello World')

              // use jquery's map to grab all of their classes
              // jquery's map returns a new jquery object
              const classes = $p.map((i, el) => {
                return Cypress.$(el).attr('class')
              })

              // call classes.get() to make this a plain array
              expect(classes.get()).to.deep.eq([
                'text-primary',
                'text-danger',
                'text-default'
              ])
            })
        `,
      },
    },
  },
}
