import Vue from "vue";
import App from "./index.vue";
// 记录上报首屏耗时
new Vue({
  render: h => h(App)
}).$mount("#app");
