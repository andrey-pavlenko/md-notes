<template lang="pug">
div(v-if="processing")
  Spinner
div(v-else)
  TagsContainer(v-if="tags.length", :tags="tags")
  div.markdown(v-html="html")
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Spinner from '@/components/spinner';
import TagsContainer from '@/components/tags/tags-container';

export default {
  components: {
    Spinner,
    TagsContainer
  },
  props: {
    url: String
  },
  computed: {
    tags: function() {
      const note = this.note(this.url);
      const tags = this.noteTags(note);
      return tags;
    },
    ...mapState({ processing: 'processing' }),
    ...mapGetters({ note: 'noteByUrl', noteTags: 'noteTags' })
  },
  methods: {
    ...mapActions({ getHtml: 'getHtml' })
  },
  asyncComputed: {
    async html() {
      return this.processing ? '' : await this.getHtml(this.url);
    }
  },
  created() {
    window.c = this;
  }
};
</script>
