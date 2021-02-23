<script>
export default {}
</script>

<template>
  <div class="embed-container">
    <slot />
  </div>
</template>

<style>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  overflow: hidden;
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
  box-shadow: 0 0 3px rgb(0 0 0 / 30%);
  border: 1px solid #ddd;
}

.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
