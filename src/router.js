import Vue from 'vue';
import Router from 'vue-router';
import Contents from '@/views/contents';
// import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'contents',
      component: Contents
    },
    {
      path: '/tag=:label',
      name: 'tag',
      component: () => import(/* webpackChunkName: "tag" */ '@/views/tag.vue'),
      props: true
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import(/* webpackChunkName: "tags" */ '@/views/tags.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () =>
        import(/* webpackChunkName: "search" */ '@/views/search.vue')
    },
    {
      path: '/:url',
      name: 'note',
      component: () =>
        import(/* webpackChunkName: "note" */ '@/views/note.vue'),
      props: true
    }
    // ,
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
});
