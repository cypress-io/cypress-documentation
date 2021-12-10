<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    e2eSpecific: {
      type: Boolean,
      required: false,
    },
    componentSpecific: {
      type: Boolean,
      required: false,
    }
  }
}
</script>

<template>
<div class="main-content-header">
  <h1>
    {{ title }}
  </h1>
  <E2EOnlyBadge v-if="e2eSpecific" class="mt-4 mb-3" />
  <ComponentOnlyBadge v-if="componentSpecific" class="mt-4 mb-3" />
</div>
</template>
