/// <reference types="cypress" />

it('should mock ssr content', () => {
  const joke = 'Our wedding was so beautiful, even the cake was in tiers.'

  cy.mockSSR({
    hostname: 'https://icanhazdadjoke.com',
    method: 'GET',
    path: '/',
    statusCode: 200,
    body: {
      id: 'NmbFtH69hFd',
      joke,
      status: 200,
    },
  })

  cy.visit('/')

  cy.get('[data-test=joke]').should('contain', joke)
})
