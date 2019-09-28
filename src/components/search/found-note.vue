<template lang="pug">
  .content
    div
      .tag.is-info {{results.length}}
      | &ensp;
      slot
    ul
      li(v-for="result in results")
        FoundResult(:matches="result.matches", :text="result.text")
</template>

<script>
import FoundResult from './found-result';

export default {
  components: {
    FoundResult
  },
  props: {
    results: {
      type: Array,
      required: true
    }
  }
};
</script>
