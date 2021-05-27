<script>
export default {
  props: {
    banner: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div id="banner" class="relative bg-green">
    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div class="pr-16 sm:text-center sm:px-16">
        <p class="font-medium text-white">
          <span class="">
            {{ banner.message }}
          </span>
          <span class="block sm:ml-2 sm:inline-block">
            <a
              :href="banner.callToActionUrl"
              target="_blank"
              class="text-white font-bold underline"
            >
              {{ banner.callToActionText }}
            </a>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style module>
[id] {
  scroll-margin-top: 144px !important;
}
</style>
