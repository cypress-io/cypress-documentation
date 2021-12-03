<template>
  <CodeGroup sync-group="react-vue">
    <CodeBlock label="React" active>
      <template #alert><slot name="react-alert"></slot></template>
      <slot name="react"></slot>
    </CodeBlock>
    <CodeBlock label="Vue">
      <template #alert><slot name="vue-alert"></slot></template>
      <slot name="vue"></slot>
    </CodeBlock>
  </CodeGroup>
</template>
