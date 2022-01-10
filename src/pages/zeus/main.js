import Vue from "vue";
import App from "./views";
import router from "./router";
import { colorUI } from "@components";
import { oreport, inject, browserInfo } from "@lego";
import "./index.scss";

Vue.config.productionTip = false;
Vue.config.errorHandler = function (err, vm, info) {
  console.error(
    new Error(`views: ${vm.$route.fullPath}, "---" ${info}, "---" ${err}`)
  );
  oreport.reportError(
    new Error(`views: ${vm.$route.fullPath}, "---" ${info}, "---" ${err}`)
  );
};
Vue.prototype.$utils = {
  inject,
  isDark: browserInfo.theme === 1
};
colorUI.forEach(ele => Vue.use(ele));

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
