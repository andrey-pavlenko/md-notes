<template lang="pug">
div
  p Содержание
  Spinner(v-if="processing")
  ul
    ContentsItem(v-for="item in contents", :key="item.url", :item="item")
</template>

<script>
// // @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import { mapState } from 'vuex';
import ContentsItem from '@/components/contents-item';
import Spinner from '@/components/spinner';

export default {
  components: { ContentsItem, Spinner },
  computed: {
    ...mapState({
      processing: 'processing',
      contents: 'contents'
    })
  }
};
</script>
