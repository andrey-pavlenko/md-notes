<template lang="pug">
div(v-if="processing")
  p Загрузка
div(v-else)
  p Статья
  p {{ path }}
  div(v-html="html")
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'note',
  props: {
    path: String
  },
  computed: {
    ...mapState({ processing: 'processing' })
  },
  methods: {
    ...mapActions({ getNoteHtml: 'getNoteHtml' })
  },
  asyncComputed: {
    async html() {
      return this.processing ? '' : await this.getNoteHtml(this.path);
    }
  }
};
</script>
