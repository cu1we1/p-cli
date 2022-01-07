<template>
  <div
    class="medusa-sort-fold-web-page gs_card_bg_color"
    @click="showWebPage"
    data-exp="0"
    :data-log="dataLog"
    data-href=""
    ref="foldWebPage"
  >
    <div class="medusa-sort-fold-web-page__text">
      {{ defaultText }}
    </div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.34 10.5L11.771 14.931C11.9011 15.0611 12.1122 15.0611 12.2424 14.931L16.6733 10.5"
        :stroke="$utils.isDark ? 'white' : 'black'"
        stroke-opacity="0.3"
        stroke-width="1.33333"
      />
    </svg>
  </div>
</template>

<script>
import { trackClickBaseEle } from "@lego";
export default {
  props: ["defaultText", "clickShow", "cardId"],
  created() {
    this.dataLog = this.$utils.inject({
      card_id: this.cardId,
      big_card_id: this.cardId,
      big_card_position: 1,
      card_position: 1,
    });
  },
  inject: ["medusa"],
  methods: {
    showWebPage() {
      if (this.clickShow && typeof this.clickShow === "function") {
        trackClickBaseEle(this.$refs.foldWebPage, {
          control_name: this.defaultText,
          control_position: 1,
        });
        this.clickShow();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
$namespace: "medusa-sort-"; // 可配置的命名空间
@include b(fold-web-page) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 12px 14px 12px 14px;
  @include e(text) {
    height: 25px;
    font-size: 16px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.55);
    flex-shrink: 0;
    margin-right: 16px;
  }
}
</style>
