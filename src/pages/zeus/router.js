import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/local*",
    name: "LocalResult",
    component: () =>
      import(
        /* webpackChunkName: "zeus-localResult", webpackPrefetch: true */
        "./views/localResult"
      )
  },
  {
    path: "/album*",
    name: "LocalAlbum",
    component: () =>
      import(
        /* webpackChunkName: "zeus-localAlbum", webpackPrefetch: true */
        "./views/localAlbum"
      )
  },
  {
    path: "/onlineapp*",
    name: "OnlineApp",
    component: () =>
      import(
        /* webpackChunkName: "zeus-onlineApp", webpackPrefetch: true */
        "./views/onlineApp"
      )
  },
  {
    path: "/playphone*",
    name: "PlayPhone",
    component: () =>
      import(
        /* webpackChunkName: "zeus-playPhone", webpackPrefetch: true */
        "./views/playPhone"
      )
  },
  {
    path: "/sugs*",
    name: "Sugs",
    component: () =>
      import(
        /* webpackChunkName: "zeus-sugs", webpackPrefetch: true */
        "./views/sugs"
      )
  }
  // {
  //   path: "/appSearch*",
  //   name: "AppSearch",
  //   component: () =>
  //     /* webpackChunkName: "zeus-appSearch", webpackPrefetch: true */
  //     import("./views/appSearch")
  // }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
