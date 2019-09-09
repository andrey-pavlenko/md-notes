<template lang="pug">
  Tags(:tags="tags")
</template>

<script>
import { mapState } from 'vuex';
import Tags from '@/components/tags/tags';

export default {
  components: { Tags },
  computed: {
    ...mapState(['tags'])
  }
};
</script>
