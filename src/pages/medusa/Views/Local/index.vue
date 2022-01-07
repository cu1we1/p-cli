<template>
  <div
    v-loading="medusa.isLoading"
    class="medusa-local"
    loading-background="transparent"
  >
    <div v-if="medusa.isLoading" />
    <Entry
      v-else
      :from="dataFrom"
      :hits="hits"
      :searchLocalsData="medusa.searchLocalsData"
      :webGuider="webGuider"
    />
  </div>
</template>

<script>
import Entry from "../Entry";
export default {
  props: ["isClientSupportWebResults", "hasLocalContent", "isShowRefresh"],
  inject: ["medusa"],
  components: {
    Entry,
  },
  created() {
    this.webGuider = "SearchLocalPage";
    this.dataFrom = "tabLocal";
  },
  computed: {
    hits({ isClientSupportWebResults, hasLocalContent, isShowRefresh }) {
      if (isShowRefresh) {
        if (isClientSupportWebResults) {
          if (hasLocalContent) {
            // 有网页结果且有本地卡。
            return [
              { tname: "update_tips" },
              { tname: "100299" },
              { tname: "anchorToWebPage" },
            ];
          } else {
            // 有网页tab且无本地卡
            return [
              { tname: "update_tips" },
              { tname: "noResults" },
              { tname: "anchorToWebPage" },
            ];
          }
        } else {
          if (hasLocalContent) {
            // 没有网页结果且有本地卡
            return [{ tname: "100299" }];
          } else {
            // 没有网页tab且没有本地卡
            return [{ tname: "100299" }, { tname: "noResults" }];
          }
        }
      } else {
        if (isClientSupportWebResults) {
          if (hasLocalContent) {
            // 有网页结果且有本地卡。
            return [{ tname: "100299" }, { tname: "anchorToWebPage" }];
          } else {
            // 有网页tab且无本地卡
            return [{ tname: "noResults" }, { tname: "anchorToWebPage" }];
          }
        } else {
          if (hasLocalContent) {
            // 没有网页结果且有本地卡
            return [{ tname: "100299" }];
          } else {
            // 没有网页tab且没有本地卡
            return [{ tname: "100299" }, { tname: "noResults" }];
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-"; // 可配置的命名空间
@include b(local) {
  min-height: calc(100vh - 52px);
  position: relative;
  @include e(empty) {
    height: calc(100vh - 52px);
  }
}
</style>
