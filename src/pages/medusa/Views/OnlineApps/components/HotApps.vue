<template>
  <div
    class="medusa-sort-hot-apps gs_card_bg_color"
    v-if="hotApps.length > 0"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'app_recommend',
        card_position: 2,
      })
    "
  >
    <div class="medusa-sort-hot-apps__title">
      {{ title }}
    </div>
    <template v-for="(item, index) in hotApps">
      <game-item
        v-if="item.type === 'game'"
        :key="`${item.id}-${index}`"
        v-bind="item"
        :keyword="keyword"
        :index="index"
        :showRecommend="true"
      />
      <app-item
        v-else
        :key="`${item.id}-${index}`"
        :keyword="keyword"
        :index="index"
        v-bind="item"
        :showRecommend="true"
      />
    </template>
  </div>
</template>

<script>
import { AppItem, GameItem } from "@components";

export default {
  props: ["list", "recAddList", "keyword", "injectAppsPkg"],
  components: {
    AppItem,
    GameItem,
  },
  computed: {
    hotApps() {
      // 过滤已展示应用，并且把三个推荐应用添加到头部。
      return this.recAddList
        .concat(
          this.list.filter((item) => !this.injectAppsPkg?.includes(item.pkg))
        )
        .slice(0, 10);
    },
  },
  created() {
    this.title = "为你推荐热门应用";
  },
  mounted() {
    this.putAppsPkgToParent();
  },
  methods: {
    putAppsPkgToParent() {
      const appsPkg = this.hotApps.map((item) => item?.pkg || "");
      this.$parent?.addHotAppsPkgToInjectAppsPkg(appsPkg);
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: medusa-sort-;
@include b(hot-apps) {
  border-radius: 14px;
  box-sizing: border-box;
  position: relative;
  margin: 0 10px 10px 10px;
  padding: 10px 14px;
  @include e(title) {
    height: 28px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 28px;
    font-weight: 500;
  }
}
</style>
