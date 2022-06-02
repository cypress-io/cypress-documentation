<template>
  <CodeGroup sync-group="npm-or-yarn">
    <CodeBlock label="npm" active>
      <template #info><slot name="npm-info"></slot></template>
      <slot name="npm"></slot>
    </CodeBlock>
    <CodeBlock label="yarn">
      <template #info><slot name="yarn-info"></slot></template>
      <slot name="yarn"></slot>
    </CodeBlock>
  </CodeGroup>
</template>
