<template lang="pug">
  nav.navbar.is-primary.is-fixed-top
    .container
      .navbar-brand
        router-link.navbar-item(to="/")
          svg.icon
            use(href="icons.svg#note")
          | &ensp;
          span.has-text-weight-bold.is-size-4 Notes
        a.navbar-burger.burger(:class="{'is-active': isActive}", @click="isActive = !isActive")
          span(aria-hidden="true")
          span(aria-hidden="true")
          span(aria-hidden="true")
      .navbar-menu(:class="{'is-active': isActive}")
        .navbar-end
          router-link.navbar-item(to="/") Содержание
          router-link.navbar-item(to="/tags") Тэги
          router-link.navbar-item(to="/search") Поиск
</template>

<script>
export default {
  data: function() {
    return {
      isActive: false
    };
  },
  watch: {
    $route() {
      this.isActive = false;
    }
  },
  mounted() {
    window.n = this;
  }
};
</script>
