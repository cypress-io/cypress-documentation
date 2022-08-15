<template>
  <CodeGroup sync-group="react-vue-angular">
    <CodeBlock label="React" active>
      <template #alert><slot name="react-alert"></slot></template>
      <slot name="react"></slot>
    </CodeBlock>
    <CodeBlock label="Vue">
      <template #alert><slot name="vue-alert"></slot></template>
      <slot name="vue"></slot>
    </CodeBlock>
    <CodeBlock label="Angular" active>
        <template #alert><slot name="angular-alert"></slot></template>
        <slot name="angular"></slot>
    </CodeBlock>
  </CodeGroup>
</template>
