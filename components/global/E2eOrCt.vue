<template>
  <code-group sync-group="e2e-ct">
    <code-block label="End-to-End Test" active>
      <slot name="e2e"></slot>
    </code-block>
    <code-block label="Component Test">
      <slot name="ct"></slot>
    </code-block>    
  </code-group>
</template>
