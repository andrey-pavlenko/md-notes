<template lang="pug">
div(v-if="processing")
  Spinner
div(v-else)
  p Статья
  p {{ url }}
  div.markdown(v-html="html")
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Spinner from '@/components/spinner';

export default {
  components: {
    Spinner
  },
  props: {
    url: String
  },
  computed: {
    ...mapState({ processing: 'processing' })
  },
  methods: {
    ...mapActions({ getHtml: 'getHtml' })
  },
  asyncComputed: {
    async html() {
      return this.processing ? '' : await this.getHtml(this.url);
    }
  }
};
</script>
