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
    }
  }
}
</script>

<template>
<div class="main-content-header">
  <h1>
    {{ title }}
  </h1>
  <E2EOnlyBadge v-if="e2eSpecific" class="mt-5 mb-3" style="margin-left:0" />
</div>
</template>
