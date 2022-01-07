<template>
  <tips
    :index="1"
    :cardId="'update_tips'"
    :info="info"
    :clickAction="clickAction"
    :clickDismiss="clickDismiss"
    v-show="medusa.globalHideRefreshShowState"
  />
</template>

<script>
import { Tips } from "@components";
export default {
  inject: ["medusa"],
  components: {
    Tips,
  },
  created() {
    this.info = "没有找到要找的应用？";
    this.action = "刷新";
  },
  methods: {
    clickDismiss() {
      // 点击取消，display：none全部refresh卡
      this.medusa.globalHideRefreshShowState = false;
    },
    clickAction() {
      // 点击刷新，调用客户端接口，刷新当前结果。
      this.medusa.reload();
    },
  },
};
</script>
