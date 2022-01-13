import Vue from "vue";
import App from "./views";
import router from "./router";
import "./index.scss";
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
