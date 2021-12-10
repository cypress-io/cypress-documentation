<template>
  <CodeGroup sync-group="vue2-vue3">
    <CodeBlock label="Vue 2" active>
      <template #alert><slot name="vue2-alert"></slot></template>
      <slot name="vue2"></slot>
    </CodeBlock>
    <CodeBlock label="Vue 3">
      <template #alert><slot name="vue3-alert"></slot></template>
      <slot name="vue3"></slot>
    </CodeBlock>
  </CodeGroup>
</template>
