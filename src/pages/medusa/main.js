import Vue from "vue";
import App from "./index.vue";
import { oreport, inject, browserInfo } from "@lego";
import { colorUI } from "@components";
Vue.config.productionTip = false;
Vue.config.errorHandler = function(err, vm, info) {
  console.error(err);
  oreport.reportError(
    new Error(`query:, ${vm.query}, ---, ${info}, "---", ${err}`)
  );
};
Vue.prototype.$utils = {
  inject,
  isDark: browserInfo.theme === 1
};
colorUI.forEach(ele => Vue.use(ele));
// 记录上报首屏耗时
new Vue({
  render: h => h(App)
}).$mount("#app");
