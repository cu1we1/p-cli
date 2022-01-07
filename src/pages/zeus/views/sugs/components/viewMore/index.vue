<template>
  <tips
    :index="1"
    :cardId="'no_activity_tips'"
    :info="info"
    :action="action"
    :dismiss="dismiss"
    :clickAction="clickSearch"
    :clickDismiss="clickDismiss"
  />
</template>

<script>
import { Tips } from "@components";
import { saveHistory } from "@lego";

export default {
  props: [
    "isSupCustomSource",
    "query",
    "onSearch",
    "clickDismiss",
    "clickAction",
  ],
  components: {
    Tips,
  },
  created() {
    this.info = "没有搜到结果？";
    this.action = "查看更多";
    this.dismiss = "取消";
    this.source = this.isSupCustomSource ? "no_activity_tips" : "search_sugs";
  },
  methods: {
    clickSearch() {
      this.clickAction();
      this.onSearch(this.query, this.source);
      saveHistory(this.query);
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-sort-"; // 可配置的命名空间
@include b(view-more) {
  background-color: #fff;
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 8px 4px 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include e(info) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    @include m(text) {
      margin-left: 12px;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.55);
    }
    @include m(icon) {
      flex-shrink: 0;
    }
  }
  @include e(buttons) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 12px;
    @include m(btn) {
      font-size: 12px;
      line-height: 24px;
      color: #2660f5;
      font-weight: 500;
      padding: 0 12px;
      flex-shrink: 0;
    }
  }
}
</style>
