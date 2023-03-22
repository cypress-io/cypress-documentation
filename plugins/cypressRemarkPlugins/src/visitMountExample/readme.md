# visit-mount-example directive

This "package" is a remark plugin that will take a triple colon directive
(`:::visit-mount-example`) with one code block and output two code blocks, one
for a cy.visit example and one for a cy.mount example.

It parses a token in the first code block in the format of
`-{(visit block)::(mount block)}` where the first part after the double colons
(`::`) is the code that will be outputted in the visit example, and the second
is the code that will be outputted in the mount example.

It uses the `E2EOrCtTabs` component to display each code block in its own tab.

Usage:

:::visit-mount-example

```js
cy.clock(now)
-{cy.visit('/index.html')::cy.mount(<DatePicker id="date" />)}-
cy.get('#date').should('have.value', '04/14/2021')
```

:::

Will output:

<E2EOrCtTabs>

```js
cy.clock(now)
cy.visit('/index.html')
cy.get('#date').should('have.value', '04/14/2021')
```

```js
cy.clock(now)
cy.mount(<DatePicker id="date" />)
cy.get('#date').should('have.value', '04/14/2021')
```

</E2EOrCtTabs>
