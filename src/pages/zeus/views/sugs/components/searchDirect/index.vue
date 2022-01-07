<template>
  <div
    class="zeus-sugs-search-direct gs_card_bg_color"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: '170002',
        card_position: index,
      })
    "
  >
    <div
      @click="startSearch"
      :data-href="$utils.inject(jumpActions)"
      :data-log="
        $utils.inject({
          control_name: btnText,
        })
      "
    >
      <div
        data-exp="0"
        class="zeus-sugs-search-direct__item"
        :data-log="
          $utils.inject({
            resource_source: 0,
            resource_name: title,
            resource_position: 1,
          })
        "
      >
        <Pic
          :src="icon"
          size="xsss1-1"
          class="zeus-sugs-search-direct__item--pic"
        />
        <div class="zeus-sugs-search-direct__item-content">
          <div class="lc1 zeus-sugs-search-direct__item-content--title">
            {{ title }}
          </div>
          <div
            v-if="!!subtitle"
            class="lc1 zeus-sugs-search-direct__item-content--subtitle"
          >
            {{ subtitle }}
          </div>
        </div>
        <div
          class="zeus-sugs-search-direct__item-button gs_button_normal"
          v-feedback
        >
          {{ btnText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
import { requestSearch, localStorage } from "@lego";
import { DEFAULT_TAB_INDEX, tabMapping_web } from "@lego";

export default {
  props: ["title", "subtitle", "btnText", "icon", "href", "query", "index"],
  components: {
    Pic,
  },
  data() {
    return {
      jumpActions: this.href?.jump,
      searchSource: this.href?.search,
    };
  },
  methods: {
    startSearch() {
      //  如果存在跳转链接，优先进行链接跳转。
      if (this.jumpActions || !this.searchSource) return;
      // 设置默认结果页跳转的tab。
      const tabIndex = tabMapping_web[this.searchSource];
      localStorage.setItem(DEFAULT_TAB_INDEX, tabIndex);
      // 使用当前query发起搜索。
      requestSearch(this.query, "search_sugs");
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-sugs-"; // 可配置的命名空间
@include b(search-direct) {
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 12px 14px 12px 14px;
  @include e(item) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include m(pic) {
      flex-shrink: 0;
    }
    @include e(item-content) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-right: 24px;
      margin-left: 16px;
      flex-grow: 1;
      @include m(title) {
        font-size: 16px;
        line-height: 21px;
        color: rgba(0, 0, 0, 0.85);
      }
      @include m(subtitle) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        margin-top: 3px;
      }
    }
    @include e(item-button) {
      flex-shrink: 0;
    }
  }
}
</style>