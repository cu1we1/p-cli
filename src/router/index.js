import Vue from "vue";
import Home from "@/views/Home.vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/lego",
    name: "Lego",
    component: () =>
      import(
        /* webpackChunkName: "lego" */
        /* webpackPrefetch: true */
        "@/views/Lego.vue"
      )
  },
  {
    path: "/test1",
    name: "Test1",
    component: () =>
      import(
        /* webpackChunkName: "test1" */
        /* webpackPrefetch: true */
        "@/views/Test1.vue"
      )
  },
  {
    path: "/test2",
    name: "Test2",
    component: () =>
      import(
        /* webpackChunkName: "test2" */
        /* webpackPreload: true */
        "@/views/Test2.vue"
      )
  },
  {
    path: "/test3",
    name: "Test3",
    component: () =>
      import(
        /* webpackChunkName: "test3" */
        /* webpackPrefetch: true */
        "@/views/Test3.vue"
      )
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
