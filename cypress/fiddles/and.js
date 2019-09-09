
import { source } from 'common-tags'

export default {
  '.and': [{
    name: 'Usage',
    html: source`
      <!-- there are no errors -->
      <div class="err"></div>
      <button>Login</button>
    `,
    test: source`
      cy.get('.err').should('be.empty').and('be.hidden') // Assert '.err' is empty & hidden
      cy.contains('Login').and('be.visible')             // Assert el is visible
      cy.wrap({ foo: 'bar' })
        .should('have.property', 'foo')                  // Assert 'foo' property exists
        .and('eq', 'bar')                                // Assert 'foo' property is 'bar'
    `,
  }],
}
