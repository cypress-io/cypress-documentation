<template>
  <CodeGroup sync-group="react-vue2-vue3">
    <CodeBlock label="React" active>
      <template #alert><slot name="react-alert"></slot></template>
      <slot name="react"></slot>
    </CodeBlock>
    <CodeBlock label="Vue 2">
      <template #alert><slot name="vue2-alert"></slot></template>
      <slot name="vue2"></slot>
    </CodeBlock>
    <CodeBlock label="Vue 3">
      <template #alert><slot name="vue3-alert"></slot></template>
      <slot name="vue3"></slot>
    </CodeBlock>
  </CodeGroup>
</template>
