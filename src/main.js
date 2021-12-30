import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import "./App.css";
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
