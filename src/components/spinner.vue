<template lang="pug">
.overlay
  .wrapper
    .spinner
    .spinner-message(v-if="hasSlot")
      slot
  </template>

<script>
export default {
  computed: {
    hasSlot() {
      return !!this.$slots.default;
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.5);

  .wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .spinner {
      $size: 4em;
      width: $size;
      height: $size;
      margin: 0 auto;
      animation: spinAround 0.5s infinite linear;
      border: 4px solid #000;
      border-radius: 50%;
      border-right-color: transparent;
      border-top-color: transparent;
    }

    .spinner-message {
      margin-top: 1em;
      max-width: 50vw;
      text-align: center;
    }
  }
}
</style>
