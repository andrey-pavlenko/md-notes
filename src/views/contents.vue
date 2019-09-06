<template lang="pug">
div
  Spinner(v-if="processing")
  TagsContainer(:tags="tags")
  p Содержание
  ul
    ContentsItem(v-for="item in contents", :key="item.url", :item="item")
</template>

<script>
// // @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import { mapState } from 'vuex';
import ContentsItem from '@/components/contents-item';
import Spinner from '@/components/spinner';
import TagsContainer from '@/components/tags/tags-container';

export default {
  components: { ContentsItem, Spinner, TagsContainer },
  computed: {
    ...mapState({
      processing: 'processing',
      contents: 'contents',
      tags: 'tags'
    })
  }
};
</script>
