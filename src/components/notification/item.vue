<template lang="pug">
  transition(appear=true)
    .notification(:class="style")
      button.delete(@click="onDelete")
      .has-text-weight-bold(v-if="header") {{header}}
      .notification-body(v-html="message")
</template>

<script>

import { DELAY_NORMAL } from './index';

export default {
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  computed: {
    style() {
      return this.params.style ? 'is-' + this.params.style : '';
    },
    header() {
      return this.params.header || '';
    },
    message() {
      return this.params.message;
    },
    timeout() {
      return this.params.timeout || DELAY_NORMAL;
    }
  },
  methods: {
    onDelete() {
      this.$emit('remove', this.params);
    }
  },
  mounted() {
    setTimeout(this.onDelete, this.params.timeout || DELAY_NORMAL);
  }
}
</script>