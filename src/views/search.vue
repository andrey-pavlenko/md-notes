<template lang="pug">
  .md_search
    .field
      SearchInput(:value.sync="pattern", @enter="onSearch", @escape="pattern = ''")
    FoundNote(v-for="item in found", :key="item.note.url", :results="item.results")
      router-link(:to="item.note.url") {{item.note.meta.title}}
</template>

<script>
import { mapGetters } from 'vuex';
import SearchInput from '@/components/search-input';
import FoundNote from '@/components/search/found-note';

export default {
  components: {
    SearchInput,
    FoundNote
  },
  data() {
    return {
      pattern: '',
      found: []
    };
  },
  computed: {
    ...mapGetters({ notesBySearchPattern: 'notesBySearchPattern' })
  },
  methods: {
    onSearch() {
      const pattern = this.pattern.trim();
      if (pattern) {
        this.found = this.notesBySearchPattern(pattern);
      } else {
        this.found = [];
      }
    }
  }
};
</script>
