<template lang="pug">
  .control.has-icons-left.has-icons-right.search-input
    input.input(
      type="text", 
      :class="sizeClass", 
      :value="value", 
      @input="onInput"
      @keydown="onKeydown"
      ref="input"
    )
    span.icon.is-left
      svg
        use(href="icons.svg#search")
    span.icon.is-right.search-input_backspace(@click="onBackspaceClick")
      svg
        use(href="icons.svg#backspace")
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ''
    }
  },
  computed: {
    sizeClass() {
      return this.size ? 'is-' + this.size : '';
    }
  },
  methods: {
    onInput(event) {
      this.$emit('update:value', event.target.value);
    },
    onKeydown(event) {
      switch (event.key) {
        case 'Enter':
          this.$emit('enter');
          break;
        case 'Escape':
          this.$emit('escape');
          break;
      }
    },
    onBackspaceClick() {
      this.$refs.input.focus();
      this.$emit('update:value', '');
    }
  }
};
</script>
