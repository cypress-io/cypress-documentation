<template>
  <CodeGroup sync-group="cypress-config-file">
    <CodeBlock label="cypress.config.js" active>
      <template #info><slot name="js-info"></slot></template>
      <slot name="js"></slot>
    </CodeBlock>
    <CodeBlock label="cypress.config.ts">
      <template #info><slot name="ts-info"></slot></template>
      <slot name="ts"></slot>
    </CodeBlock>
  </CodeGroup>
</template>
