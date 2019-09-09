
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
      value: {
        only: true,
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
            .should('contain', 'Edit User') // yields <a>
            .and('have.attr', 'href')       // yields string value of href
            .and('match', /users/)          // yields string value of href
            .and('not.include', '#')        // yields string value of href
        `,
      },
    },
  },
}
