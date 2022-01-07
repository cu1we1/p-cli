<template>
  <div
    class="medusa-sort-operational-template-head-img"
    :class="headClass"
    @click="Search"
  >
    <Pic
      class="medusa-sort-operational-template-img"
      :class="pageData.type === '0' ? 'is-rectangle' : 'is-square'"
      :src="pageData.url.trim()"
      :radius="7"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_name: `activeImg`,
          resource_url: pageData.query || $utils.inject(jumpAction),
          resource_id: resourceId,
          resource_provider: pageData.resource_provider,
          resource_position: index,
        })
      "
      :data-href="jumpAction && $utils.inject(jumpAction)"
    />
  </div>
</template>

<script>
import { Pic } from "@components";
import { formatUrl } from "@lego";
export default {
  components: { Pic },
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
    headClass: {
      type: String,
      default: "",
    },
  },
  name: "OperationalTemplateHeadImg",
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
.medusa-sort-operational-template-head-img {
  border-radius: 7px;
  overflow: hidden;
}
@include b("operational-template-img") {
  margin: 0 auto;
  display: block;
  &.is-rectangle {
    width: 86.67vw;
    height: 33.4vw;
  }
  &.is-square {
    width: 86.67vw;
    height: 86.67vw;
  }
  @include m(mb8) {
    margin-bottom: 8px;
  }
}
</style>
