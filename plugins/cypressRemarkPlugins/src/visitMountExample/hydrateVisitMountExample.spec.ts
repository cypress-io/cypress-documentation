import { expect, it } from 'vitest'
import { hydrateVisitMountExample } from './hydrateVisitMountExample'

it(`should replace simple visit/mount token with parsed visit/mount commands`, () => {
  const code = `-{cy.visit('/index.html')::cy.mount(<DatePicker id="date" />)}-`
  const { visitCode, mountCode } = hydrateVisitMountExample(code)
  expect(visitCode).toEqual(`cy.visit('/index.html')`)
  expect(mountCode).toEqual(`cy.mount(<DatePicker id="date" />)`)
})

it(`should replace multi-line code with parsed visit/mount commands`, () => {
  const code = `
  cy.clock(now)
  -{cy.visit('/index.html')::cy.mount(<DatePicker id="date" />)}-
  cy.get('#date').should('have.value', '04/14/2021')
  `
  const { visitCode, mountCode } = hydrateVisitMountExample(code)
  expect(visitCode).toEqual(`
  cy.clock(now)
  cy.visit('/index.html')
  cy.get('#date').should('have.value', '04/14/2021')
  `)
  expect(mountCode).toEqual(`
  cy.clock(now)
  cy.mount(<DatePicker id="date" />)
  cy.get('#date').should('have.value', '04/14/2021')
  `)
})

it(`should replace multi-line token with parsed visit/mount commands`, () => {
  const code = `-{// visiting the dashboard should make requests that match
  // the two routes above
  cy.visit('http://localhost:8888/dashboard')::// mounting the dashboard should make requests that match
  // the two routes above
  cy.mount(<Dashboard />)}-`
  const { visitCode, mountCode } = hydrateVisitMountExample(code)
  expect(visitCode).toEqual(`// visiting the dashboard should make requests that match
  // the two routes above
  cy.visit('http://localhost:8888/dashboard')`)
  expect(mountCode).toEqual(`// mounting the dashboard should make requests that match
  // the two routes above
  cy.mount(<Dashboard />)`)
})



it('blank code string should throw error', () => {
  const code = ''
  expect(() => hydrateVisitMountExample(code)).toThrowError(
    'No valid token to replace in visit-mount-example code block: ' + code
  )
})

it('code string without replace string should throw error', () => {
  const code = 'const abc = 123'
  expect(() => hydrateVisitMountExample(code)).toThrowError(
    'No valid token to replace in visit-mount-example code block: ' + code
  )
})

it('code with invalid token should throw error', () => {
  const code = '-{hello}-'
  expect(() => hydrateVisitMountExample(code)).toThrowError(
    'Token format invalid in visit-mount-example: hello'
  )
})
