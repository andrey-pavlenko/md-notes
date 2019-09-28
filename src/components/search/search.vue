<template lang="pug">
  .md_search
    .field
      SearchInput(:value.sync="pattern", @enter="onStartSearch", @escape="pattern = ''")
</template>

<script>
import SearchInput from '@/components/search-input';

export default {
  components: {
    SearchInput
  },
  data: function() {
    return {
      pattern: ''
    };
  },
  methods: {
    onStartSearch() {
      console.info('start search', this.pattern);
    }
  }
};
</script>
