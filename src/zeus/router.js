import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/game*",
    name: "Game",
    component: () =>
      import(
        /* webpackChunkName: "zeus-Game", webpackPrefetch: true */
        "./views/Game"
      )
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
