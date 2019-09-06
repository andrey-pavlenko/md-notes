<template lang="pug">
  .field.is-grouped.is-grouped-multiline
    .control(v-for="tag in tags" :key="tag.label")
      router-link(:to="'/tag='+tag.label")
        TagItem(:label="tag.label" :count="tag.count" @click.native="$emit('click', tag.label)")
</template>

<script>
import TagItem from './tag-item';

export default {
  components: {
    TagItem
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
};
</script>
