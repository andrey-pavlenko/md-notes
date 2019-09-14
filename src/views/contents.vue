<template lang="pug">
div
  Spinner(v-if="processing")
  Contents(:contents="contents")
</template>

<script>
import { mapState } from 'vuex';
import Contents from '@/components/contents/index';
import Spinner from '@/components/spinner';

export default {
  components: { Contents, Spinner },
  computed: {
    ...mapState({
      processing: 'processing',
      contents: 'contents'
    })
  }
};
</script>
