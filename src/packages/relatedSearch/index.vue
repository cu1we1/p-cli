<template>
  <div
    v-if="list.length"
    data-exp="0"
    :data-log="
      $utils.inject({
        big_card_id: '170003',
        big_card_position: 1,
        card_id: '170003',
        card_position: 1,
      })
    "
    class="medusa-sort-related-search"
    @touchmove.stop
    @scroll="scrollItem"
    :style="marTop"
    ref="scrollDom"
  >
    <div class="medusa-sort-related-search__box">
      <div
        data-href=""
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_source: 0,
            resource_position: idx + 1,
            resource_name: item,
          })
        "
        v-feedback
        v-for="(item, idx) in list"
        :key="`${originTab}-${idx}`"
        class="medusa-sort-related-search__box--item lc1 gs_related_search_bg"
        @click.stop="() => search(item)"
      >
        {{ item }}
      </div>
      <div class="medusa-sort-related-search__box--item-place-holder" />
    </div>
  </div>
</template>

<script>
import { debounceExport500, requestSearch, saveHistory } from "@lego";

export default {
  props: ["originTab", "actualMrTop"],
  inject: ["setRelatedSearchScrollLeft", "medusa"],
  computed: {
    list() {
      return this.medusa.relatedSearchList;
    },
    marTop() {
      return `--gs-related-search-margin-top: ${this.actualMrTop}`;
    },
  },
  created() {
    this.source = this.medusa.isSupCustomSource
      ? "related_search"
      : "search_sugs";
  },
  mounted() {
    const scrollLeft = this.medusa.relatedSearchScrollLeft;
    if (scrollLeft) {
      this.setScrollLeft(scrollLeft);
    }
  },
  methods: {
    scrollItem(e) {
      const scrollLeft = e.target.scrollLeft;
      this.setRelatedSearchScrollLeft({
        scrollLeft,
        originTab: this.originTab,
      });
      debounceExport500();
    },
    setScrollLeft(newValue) {
      if (this.medusa.relatedSearchScrollOriginTab !== this.originTab) {
        this.$refs.scrollDom.scrollLeft = newValue;
      }
    },
    search(item) {
      requestSearch(item, this.source);
      saveHistory(item);
    },
  },
  watch: {
    "medusa.relatedSearchScrollLeft": function (newV) {
      this.setScrollLeft(newV);
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-sort-"; // 可配置的命名空间
@include b(related-search) {
  width: 100vw;
  height: 50px;
  margin-top: var(--gs-related-search-margin-top);
  overflow: scroll;
  background-color: transparent;
  transition: margin-top 383ms;
  &::-webkit-scrollbar {
    display: none;
  }
  @include e(box) {
    height: 50px;
    display: flex;
    align-items: center;
    margin: 0 5px;
    @include m(item) {
      max-width: 30vw;
      min-width: 5vw;
      height: 26px;
      flex-shrink: 0;
      font-size: 12px;
      line-height: 26px;
      border-radius: 30px;
      padding: 0 12px;
      margin: 0 5px;
      color: rgba(255, 255, 255, 0.85);
    }
    @include m(item-place-holder) {
      width: 5px;
      height: 26px;
      flex-shrink: 0;
    }
  }
}
</style>
