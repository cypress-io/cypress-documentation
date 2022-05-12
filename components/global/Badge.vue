<template>
  <router-link v-if="path" :to="{path}" style="border-style: none">
    <div :class="[$style.badge, $style[type]]">
      <slot />
    </div>
  </router-link>
  <div v-else :class="[$style.badge, $style[type]]">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'info'
    },
    path: {
      type: String,
      default: '',
      required: false,
    }
  },
}
</script>

<style module>
/* small badge beside content */
.badge {  
  display: inline-block;
  color: #fff;
  padding: 0.25em 0.4em;
  margin-left: 0.5rem;
  font-size: 0.7rem;
  line-height: 0.7rem;
  font-weight: 700;
  border-radius: 9999px;
  @apply px-2;
  @apply py-1;
}

.success {
  background-color: #28a745;
}

.danger {
  background-color: #dc3545;
}

.info {
  background-color: #007bff;
}

/* large green badge in page/content titles */
.hint {
  background-color: #cff1e6;
  color: #127458;
  padding: 0.125rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
}
</style>
