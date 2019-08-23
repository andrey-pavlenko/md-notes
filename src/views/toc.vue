<template lang="pug">
div
  p Содержание
  Spinner(v-if="processing")
  ul
    TocItem(v-for="tocItem in toc", :key="tocItem.path", :item="tocItem")
</template>

<script>
// // @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import { mapState } from 'vuex';
import TocItem from '@/components/toc-item';
import Spinner from '@/components/spinner';

export default {
  name: 'toc',
  components: { TocItem, Spinner },
  computed: {
    ...mapState({
      processing: 'processing',
      toc: 'toc'
    })
  }
};
</script>
