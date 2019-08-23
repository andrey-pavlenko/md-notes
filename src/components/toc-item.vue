<template lang="pug">
  li
    a(:href="path") {{item.title}}
    ul(v-if="item.children")
      toc-item(v-for="child in item.children", :key="child.path", :item="child")
</template>

<script>
export default {
  name: 'toc-item',
  props: {
    item: Object
  },
  computed: {
    path: function() {
      return '#/note/' + encodeURIComponent(this.$props.item.path);
    }
  }
};
</script>
