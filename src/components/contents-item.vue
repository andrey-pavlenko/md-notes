<template lang="pug">
  li
    a(:href="url") {{item.title}}
    ul(v-if="item.children")
      contents-item(v-for="child in item.children", :key="child.url", :item="child")
</template>

<script>
export default {
  name: 'contents-item',
  props: {
    item: Object
  },
  computed: {
    url: function() {
      return '#/' + this.$props.item.url;
    }
  }
};
</script>
