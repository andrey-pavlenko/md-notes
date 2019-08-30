<template lang="pug">
  .md_tags_item.tags.has-addons
    span.tag.is-info {{label}}
    span.tag.is-dark {{enchanceCount}}
</template>

<script>
export default {
  props: {
    label: String,
    count: Number
  },
  computed: {
    enchanceCount() {
      if (this.count > 100000) {
        return (
          parseFloat((this.count / 1000000).toFixed(1)).toLocaleString() + 'M'
        );
      } else if (this.count > 1000) {
        return (
          parseFloat((this.count / 1000).toFixed(1)).toLocaleString() + 'K'
        );
      } else {
        return this.count;
      }
    }
  }
};
</script>
