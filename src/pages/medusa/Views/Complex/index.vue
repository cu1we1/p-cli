<template>
  <div
    v-loading="isLoading"
    :class="`medusa-complex ${
      relatedSearchShowState ? '' : 'medusa-complex__has-padding'
    }`"
    loading-background="transparent"
    ref="complex"
  >
    <!-- 非网页卡 -->
    <Entry
      v-show="showEntry"
      :from="dataFrom"
      :hits="medusa.entryData"
      :searchLocalsData="formatLocalData1"
      :netErrorType="netErrorType"
    />
    <!-- 折叠非网页卡 -->
    <fold-cards
      v-if="medusa.showFoldUnwebCards"
      :defaultText="foldCardsText"
      :clickShow="medusa.showUnwebCards"
      :cardId="foldCardsCardId"
    />
    <web-results
      :name="medusa.engineName"
      :url="medusa.complexUrl"
      :watchTabsRelationalFromIframe="watchTabsRelationalFromIframe"
      :pageInfo="pageInfo"
      :showState="medusa.showWebResult"
      :formatScrollTop="formatScrollTop"
      v-if="medusa.showWebResult"
    />
    <!-- 折叠网页卡 -->
    <fold-cards
      v-if="medusa.showFoldWebpage"
      :defaultText="foldWebText"
      :clickShow="medusa.showWebPage"
      :cardId="foldWebCardId"
    />
  </div>
</template>

<script>
import { debounceExport500 } from "@lego";
import Entry from "../Entry";
import webResults from "./webResults";
import foldCards from "@gs/foldCards";

export default {
  props: [
    "watchTabsRelationalFromIframe",
    "pageInfo",
    "putHeight",
    "stopBulleUpTouchEvents",
    "relatedSearchShowState",
  ],
  inject: ["medusa"],
  created() {
    this.dataFrom = "tabComplex";
    this.foldCardsText = "展开本机和应用内容";
    this.foldCardsCardId = "foldCards";
    this.foldWebText = "展开网页内容";
    this.foldWebCardId = "foldWebPage";
    // 内容区域上一次触发滚动时的滚动距离（用于判断当前的滚动方向）。
    this.contentScrollTopLastMoment = 0;
  },
  mounted() {
    const complexScrollDom = document.querySelector("#SearchResultPage");
    if (complexScrollDom) {
      this.complexScrollDom = complexScrollDom;
      this.addScrollEvents();
    }
  },
  beforeDestroy() {
    if (this.complexScrollDom) {
      this.removeScrollEvents();
    }
  },
  components: {
    webResults,
    Entry,
    foldCards,
  },
  computed: {
    formatLocalData1() {
      return this.medusa.searchLocalsData.slice(0, this.medusa.localsNum);
    },
    netErrorType() {
      if (this.medusa.hasNetwork) {
        return "";
      } else if (
        this.medusa.hasLocalContent ||
        this.medusa.isInitHasNetwork ||
        this.medusa.isShowRefresh
      ) {
        return "1";
      } else if (this.medusa.isSearchReady) {
        return "2";
      }
      return "";
    },
    showEntry() {
      return (
        !this.medusa.isInitHasNetwork ||
        (this.medusa.isOnlineReady &&
          !this.medusa.showFoldUnwebCards &&
          this.medusa.isShowEntry)
      );
    },
    isLoading() {
      if (!this.medusa.isInitHasNetwork) {
        return this.medusa.isLoading;
      }
      return !this.medusa.isOnlineReady;
    },
  },
  methods: {
    addScrollEvents() {
      this.$refs.complex.addEventListener("scroll", this.contentScrollFunc);
    },
    removeScrollEvents() {
      this.$refs.complex.removeEventListener("scroll", this.contentScrollFunc);
    },
    contentScrollFunc(e) {
      this.debounceExport500();
      const scrollTop = e.target.scrollTop;
      this.formatScrollTop(scrollTop);
      this.stopBulleUpTouchEvents();
    },
    formatScrollTop(contentScrollTop) {
      // 判断滚动方向。
      if (contentScrollTop - this.contentScrollTopLastMoment > 0) {
        this.putHeight("complex", "-50px");
      } else {
        this.putHeight("complex", "0px");
      }
      // 保存此次内容区域的滚动距离，用于下次触发滚动的时候计算滚动方向。
      this.contentScrollTopLastMoment = contentScrollTop;
    },
    debounceExport500,
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-"; // 可配置的命名空间
@include b(complex) {
  position: relative;
  height: calc(100vh - 42px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @include e(has-padding) {
    padding-top: 10px;
  }
}
</style>
