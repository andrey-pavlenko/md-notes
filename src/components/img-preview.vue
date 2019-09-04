<template lang="pug">
  div.img-preview.modal.is-active(tabindex="-1", ref="keydown-catcher", @keydown="onKeydown")
    div.modal-background
    label.modal-content
      input(type="checkbox", :checked="zoom")
      img(:src="src", alt="")
    button.modal-close.is-large(aria-label="close", @click="$emit('close')")
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: () => ''
    }
  },
  data: function() {
    return {
      zoom: false
    };
  },
  methods: {
    onKeydown(event) {
      if (event.code === 'Escape') {
        this.$emit('close');
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.$refs['keydown-catcher'].focus();
    });
  }
};
</script>
