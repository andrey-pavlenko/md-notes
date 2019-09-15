<template lang="pug">
  .img-preview.modal.is-active(tabindex="-1", ref="keydown-catcher", @keydown="onKeydown")
    .modal-background
    label.modal-content
      input(type="checkbox", v-model="zoom")
      img(:src="src", alt="")
    button.modal-close.is-large(aria-label="close", @click="$emit('close')")
    a.zoom-image(v-if="isTouchScreen", aria-label="zoom", @click="zoom = !zoom")
      svg.icon
        use(:href="zoomIcon")
</template>

<script>
import { detect } from '../modules/touch-screen';
export default {
  props: {
    src: {
      type: String,
      default: () => ''
    }
  },
  data: function() {
    return {
      zoom: false,
      isTouchScreen: detect()
    };
  },
  computed: {
    zoomIcon: function() {
      return 'icons.svg#zoom-' + (this.zoom ? 'out' : 'in');
    }
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
