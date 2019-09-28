<template lang="pug">
  .md_tags
    .field
      SearchInput(:value.sync="filter", @escape="filter = ''")
    TagsContainer(:tags="filteredTags" @click="$emit('click', $event)")
</template>

<script>
import TagsContainer from './tags-container';
import SearchInput from '@/components/search-input';

export default {
  components: {
    TagsContainer,
    SearchInput
  },
  data: function() {
    return {
      filter: ''
    };
  },
  props: ['tags'],
  computed: {
    filteredTags: function() {
      const filter = this.filter ? this.filter.toLocaleLowerCase() : false;
      return filter
        ? this.tags.filter(t => t.label.toLocaleLowerCase().includes(filter))
        : this.tags;
    }
  }
};
</script>
