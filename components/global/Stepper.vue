<template>
  <div class="stepper">
    <button @click="count--"> - </button>
    <span>{{ count }}</span>
    <button :disabled="max && count >= max" @click="count++"> + </button>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: null,
      required: false
    },
    max: {
      type: Number,
      default: null,
      required: false
    },
    initial: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      count: 0
    }
  },
  created() {
    this.count = this.initial
  }
}
</script>

<style scoped>
.stepper {
  width: 120px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  border: 1px solid #eaeaea;
  border-radius: 3px;
  font-size: 1.25rem;
  font-weight: medium;
  margin-bottom: 1rem;
}

button {
  width: 36px;
}

button:hover:not(:disabled) {
  background: #eaeaea;
}

.stepper:first-of-type(button){
  border-right: 1px solid #eaeaea;
}

.stepper:last-of-type(button){
  border-left: 1px solid #eaeaea;
}
</style>