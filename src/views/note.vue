<template lang="pug">
div(v-if="processing")
  p Загрузка
div(v-else)
  p Статья
  p {{ url }}
  div(v-html="html")
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'note',
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
