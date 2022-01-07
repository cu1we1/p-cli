<template>
  <div
    class="zeus-sugs-search-found gs_card_bg_color"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: '170001',
        card_position: index,
      })
    "
  >
    <div class="zeus-sugs-search-found__title">
      {{ title }}
    </div>
    <div class="zeus-sugs-search-found__item-box">
      <div
        v-for="(item, idx) in list"
        :key="item.id"
        :class="getCls(idx)"
        @click="(e) => requestSearch(e, item.text)"
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_source: 0,
            resource_name: item.text,
            resource_position: idx + 1,
          })
        "
      >
        <div class="zeus-sugs-search-found__item-text">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { trackClickBaseEle } from "@lego";

export default {
  props: ["list", "onSearch", "isSupCustomSource", "index"],
  created() {
    this.title = "搜索发现";
    this.source = this.isSupCustomSource
      ? "search_findings"
      : "search_sugs_more";
  },
  methods: {
    requestSearch(e, text) {
      trackClickBaseEle(e.target);
      this.onSearch(text, this.source);
    },
    getCls(idx) {
      switch (idx + 1) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 9:
        case 11:
          return "zeus-sugs-search-found__item zeus-sugs-search-found__item--left lc1";
        default:
          return "zeus-sugs-search-found__item zeus-sugs-search-found__item--right lc1";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-sugs-"; // 可配置的命名空间
@include b(search-found) {
  border-radius: 12px;
  margin: 0px 10px 10px 10px;
  padding: 10px 14px;
  @include e(title) {
    height: 28px;
    font-size: 12px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.55);
    font-weight: 700;
  }
  @include e(item-box) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    @include e(item) {
      // width: 43.33333vw;
      width: 50%;
      height: 34px;
      box-sizing: border-box;
      @include e(item-text) {
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        color: rgba(0, 0, 0, 0.85);
      }
      @include m(left) {
        padding: 0 14px 0 0;
      }
      @include m(right) {
        padding: 0 0 0 14px;
      }
    }
  }
}
</style>