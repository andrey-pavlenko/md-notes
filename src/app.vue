<template lang="pug">
#app
  router-view
</template>

<script>
import store from './store';

export default {
  created() {
    store.dispatch('fetchContents');
  }
};
</script>
