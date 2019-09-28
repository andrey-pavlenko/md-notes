<template lang="pug">
  .found-text(v-html="markedText")
</template>

<script>
export default {
  props: {
    matches: {
      type: Array,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    markedText() {
      return this.matches
        .map(match => this.text.split(match).join(`<mark>${match}</mark>`))
        .join('');
    }
  }
};
</script>
