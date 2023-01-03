<Alert type="warning">

<strong class="alert-header"><Icon name="exclamation-triangle"></Icon> Disabling
`document.domain` Injection</strong>

As of Cypress [v12.4.0](https://on.cypress.io/changelog#12-4-0), disabling
`document.domain` injection is available with the
`experimentalUseDefaultDocumentDomain` option. If enabled,
[`cy.origin()`](/api/commands/origin) is now required for all sub domain
navigations. Please see
[End-to-End testing Experiments](/guides/references/experiments#End-to-End-Testing)
for more details.

</Alert>
