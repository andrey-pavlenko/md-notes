<template lang="pug">
#app
  Navbar
  router-view.container#router-view
</template>

<script>
import store from './store';
import Navbar from '@/components/navbar';

export default {
  components: {
    Navbar
  },
  created() {
    store.dispatch('init');
  }
};
</script>

<style lang="scss">
#router-view {
  margin-top: 4em;

  @media print {
    margin-top: 0;
  }
}

@media print {
  .navbar {
    display: none;
  }
}
</style>
