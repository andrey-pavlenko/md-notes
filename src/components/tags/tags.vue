<template lang="pug">
  .md_tags
    .field.md_tags_filter
      .control.has-icons-left.has-icons-right
        input.input.is-small(type="text", v-model="filter")
        span.icon.is-left
          svg
            use(href="icons.svg#search")
        span.icon.is-right
          svg.md_tags_filter_backspace(@click="onBackspaceClick")
            use(href="icons.svg#backspace")
    TagsContainer(:tags="filteredTags" @click="$emit('click', $event)")
</template>

<script>
import TagsContainer from './tags-container';

export default {
  components: {
    TagsContainer
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
  },
  methods: {
    onBackspaceClick() {
      this.filter = '';
    }
  }
};
</script>
