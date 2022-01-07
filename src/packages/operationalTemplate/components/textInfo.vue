<template>
  <div
    class="medusa-sort-operational-template-text-info"
    data-exp="0"
    :data-log="
      $utils.inject({
        resource_name: pageData.title,
        resource_url: pageData.query || $utils.inject(jumpAction),
        resource_id: pageData.resourceId,
        resource_provider: pageData.resource_provider,
        resource_position: index,
      })
    "
    @click="Search"
    :data-href="jumpAction && $utils.inject(jumpAction)"
  >
    <div class="medusa-sort-operational-template-text-info__title-box">
      <span
        class="medusa-sort-operational-template-text-info__icon"
        v-if="pageData.icon_text"
        >{{ pageData.icon_text }}</span
      >
      <h3 class="medusa-sort-operational-template-text-info__title lc1">
        {{ pageData.title }}
      </h3>
    </div>
    <p
      class="medusa-sort-operational-template-text-info__text lc2"
      v-if="pageData.abstract"
    >
      {{ pageData.abstract }}
    </p>
    <span
      class="medusa-sort-operational-template-text-info__link"
      v-if="pageData.entry"
      >{{ pageData.entry }}</span
    >
  </div>
</template>

<script>
import { formatUrl } from "@lego";
export default {
  name: "OperationalTemplateTextInfo",
  inject: ["onSearch"],
  props: {
    pageData: {
      type: Object,
      default() {
        return {};
      },
    },
    resourceId: {
      type: String,
      default: "",
    },
    index: {
      type: [Number, String],
      default: 0,
    },
    tname: {
      type: String,
      default: "",
    },
  },
  methods: {
    Search() {
      let { query } = this.pageData;
      query && this.onSearch(query, "search_web");
    },
  },
  computed: {
    jumpAction() {
      let { jumpAction } = this.pageData;
      if (jumpAction) {
        jumpAction = jumpAction.map((item) => {
          let mode = item.mode === "1" ? "2" : item.mode;
          item.mode = Number(mode);
          return item;
        });
        return formatUrl(jumpAction);
      }
      return "";
    },
  },
};
</script>

<style lang="scss">
$namespace: "medusa-sort-";
@include b(operational-template-text-info) {
  margin: 14px 0 2px;
  @include e(title-box) {
    display: flex;
    align-items: center;
  }
  @include e(icon) {
    margin-right: 6px;
    padding: 0 7px;
    display: block;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    line-height: 18px;
    background: #ffbb0e;
    border-radius: 3px;
    flex-shrink: 0;
  }
  @include e(title) {
    margin: 0;
    font-weight: 400;
    line-height: 21px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  @include e(text) {
    margin-top: 6px;
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.55);
  }
  @include e(link) {
    font-size: 12px;
    line-height: 20px;
    color: #2660f5;
  }
}
</style>
