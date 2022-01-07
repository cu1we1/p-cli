<template>
  <tips
    :index="1"
    :cardId="'update_tips'"
    :info="info"
    :clickAction="clickAction"
    :clickDismiss="clickDismiss"
  />
</template>

<script>
import { Tips } from "@components";

export default {
  props: ["clickAction", "clickDismiss"],
  components: {
    Tips,
  },
  created() {
    this.info = "没有找到要找的应用？";
    this.action = "刷新";
  },
};
</script>

<style>
</style>