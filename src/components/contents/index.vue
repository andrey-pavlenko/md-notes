<template lang="pug">
  .content
    ul
      ContentsItem(v-for="item in contents", :key="item.url", :item="item")
</template>

<script>
import ContentsItem from './item';

export default {
  components: {
    ContentsItem
  },
  props: {
    contents: Array
  }
};
</script>
