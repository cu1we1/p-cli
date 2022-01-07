<template>
  <div
    ref="anchorToWebPage"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'anchorToWebPage',
      })
    "
    class="medusa-sort-anchor-to-web-page-box gs_card_bg_color"
    @click="toMore"
    id="automated_anchor_to_web"
  >
    <div class="medusa-sort-anchor-to-web-page-box__content">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.8639 19.8027L16.9113 15.8501C18.1157 14.3736 18.7067 12.4908 18.5623 10.5909C18.4178 8.69101 17.549 6.91921 16.1352 5.64175C14.7215 4.36428 12.871 3.6788 10.9662 3.72699C9.06145 3.77518 7.24798 4.55335 5.90067 5.90067C4.55335 7.24798 3.77518 9.06145 3.72699 10.9662C3.6788 12.871 4.36428 14.7215 5.64175 16.1352C6.91921 17.549 8.69101 18.4178 10.5909 18.5623C12.4908 18.7067 14.3736 18.1157 15.8501 16.9113L19.8027 20.8639L20.8639 19.8027ZM11.1666 17.083C9.99644 17.083 8.85251 16.7361 7.87951 16.086C6.9065 15.4358 6.14813 14.5118 5.70029 13.4307C5.25246 12.3496 5.13527 11.1599 5.36356 10.0122C5.59184 8.86451 6.15534 7.81026 6.9828 6.9828C7.81026 6.15534 8.86451 5.59184 10.0122 5.36356C11.1599 5.13527 12.3496 5.25246 13.4307 5.70029C14.5118 6.14813 15.4358 6.9065 16.086 7.87951C16.7361 8.85251 17.083 9.99644 17.083 11.1666C17.0812 12.7352 16.4573 14.239 15.3482 15.3482C14.239 16.4573 12.7352 17.0812 11.1666 17.083Z"
          :fill="$utils.isDark ? 'white' : 'black'"
          fill-opacity="0.3"
        />
      </svg>
      <span class="medusa-sort-anchor-to-web-page-box__content--text">{{
        text
      }}</span>
    </div>
    <AngleRight />
  </div>
</template>

<script>
import { trackClickBaseEle } from "@lego";
import { AngleRight } from "@components";
export default {
  inject: ["changeToWebTab"],
  props: ["webGuider"],
  data() {
    return {
      text: "搜索更多网页内容",
    };
  },
  components: {
    AngleRight,
  },
  methods: {
    toMore() {
      trackClickBaseEle(this.$refs.anchorToWebPage, {});
      this.changeToWebTab();
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "medusa-sort-anchor-to-web-page-"; // 可配置的命名空间
@include b(box) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 12px 14px 12px 14px;
  @include e(content) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 2px 0;
    @include m(text) {
      font-size: 16px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.55);
      margin-left: 12px;
    }
  }
}
</style>
