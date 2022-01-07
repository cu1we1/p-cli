<template>
  <div
    class="medusa-sort-operational-template-entry"
    :data-log="
      $utils.inject({
        resource_id: resourceId,
      })
    "
  >
    <div
      class="medusa-sort-operational-template-entry__button"
      :class="{
        'medusa-sort-operational-template-entry__button--center': !item.iconUrl,
      }"
      v-feedback
      v-for="(item, idx) in pageData"
      :key="item.text"
      data-exp="0"
      :data-href="item.query ? '' : $utils.inject(item.url)"
      :data-log="
        $utils.inject({
          resource_url: item.query || $utils.inject(item.url),
          resource_name: item.text,
          resource_provider: item.resource_provider,
          resource_position: index + idx + 1,
        })
      "
      @click="Search(item)"
    >
      <Pic
        v-if="item.iconUrl"
        :src="item.iconUrl"
        class="medusa-sort-operational-template-entry__icon"
      />
      <span class="medusa-sort-operational-template-entry__text lc1">{{
        item.text
      }}</span>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
export default {
  name: "OperationalTemplateEntry",
  components: { Pic },
  inject: ["onSearch"],
  props: {
    pageData: {
      type: Array,
      default() {
        return [];
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
    Search(data) {
      let { query } = data;
      query && this.onSearch(query, "search_web");
    },
  },
};
</script>

<style lang="scss">
$namespace: "medusa-sort-";
@include b(operational-template-entry) {
  margin: 6px 0 4px;
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  @include e(button) {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 0 10px;
    flex: none;
    display: flex;
    align-items: center;
    width: 41.944vw;
    /* width: 151px; */
    height: 36px;
    font-size: 12px;
    line-height: 36px;
    color: rgba(0, 0, 0, 0.85);
    border-radius: 18px;
    background: rgba(0, 0, 0, 0.03);
    @include m(center) {
      justify-content: center;
    }
  }
  @include e(icon) {
    margin-right: 6px;
    flex: none;
    width: 24px !important;
    height: 24px !important;
  }
}
</style>
