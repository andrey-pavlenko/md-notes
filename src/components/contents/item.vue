<template lang="pug">
  li
    router-link(:to="item.url") {{item.title}}
    ul(v-if="item.children")
      contents-item(v-for="child in item.children", :key="child.url", :item="child")
</template>

<script>
export default {
  name: 'contents-item',
  props: {
    item: Object
  }
};
</script>
