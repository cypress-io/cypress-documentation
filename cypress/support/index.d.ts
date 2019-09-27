/// <reference types="cypress" />

/**
 * Possible environment names
*/
enum EnvironmentName {
  development,
  staging,
  production
}

declare namespace Cypress {
  interface Cypress {
    /**
     * Returns true if Cypress tests run against development environment.
     */
    isDevelopment (): boolean

    /**
     * Returns true if Cypress tests run against staging environment.
     */
    isStaging (): boolean

    /**
     * Returns true if Cypress tests run against production environment.
     */
    isProduction (): boolean

    /**
     * Returns true if Cypress tests run against this specific environment.
     */
    is (environmentName: EnvironmentName): boolean
  }
}
