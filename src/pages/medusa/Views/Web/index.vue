<template>
  <div
    :class="`medusa-web-page ${
      relatedSearchShowState ? '' : 'medusa-web-page--has-margin'
    }`"
    :style="containerFilletVariable"
    :data-log="
      $utils.inject({
        big_card_id: '100599',
        big_card_position: 1,
      })
    "
  >
    <NetWorkError :netErrorType="netErrorType" />
    <div
      v-if="medusa.isInitHasNetwork"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: '100599',
          card_type: medusa.engineName,
        })
      "
    >
      <iframe
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_name: medusa.engineName,
          })
        "
        ref="web_iframe"
        key="iframe"
        name="global-search-web-results"
        class="medusa-web-page__iframe"
        id="web_iframe"
        width="100%"
        scrolling="yes"
        :src="src"
        @load="iframeLoaded"
      />
      <back-to-top
        v-if="showBackToTop"
        :clickBackToTop="clickBackToTop"
        class="medusa-web-page__back-top"
        data-href=""
        :data-log="
          $utils.inject({
            control_name: 'sticky_icon',
            control_type: 'button',
            control_position: 1,
          })
        "
      />
      <!-- 如果还未绑定watchTabsRelationalFromIframe，那么需要展示mask -->
      <div
        v-if="!isWebIframeBindTouching"
        ref="web_iframe_mask"
        class="medusa-web-page__iframe-mask"
      />
    </div>
  </div>
</template>

<script>
import NetWorkError from "@gs/netWorkError";
import { BackToTop } from "@components";
import { iframePageBackToTop } from "@lego";
import { oreport, trackSearch } from "@lego";
let iframeDom = null;
export default {
  data() {
    return {
      // 子iframe是否在滚动。
      isScrolling: false,
      // 定时tag
      timer: "",
      // 上一时刻iframe内页面滚动的距离值，用于判断iframe滚动是否停止。
      beforeIfameScrollTop: 0,
      // 网页tab的iframe内部是否已经绑定了相关事件。
      isWebIframeBindTouching: false,
      // iframe内容是否有滚动距离
      iframeWhetherTheContentHasAScrollValue: false,
    };
  },
  props: [
    "name",
    "url",
    "watchTabsRelationalFromIframe",
    "pageInfo",
    "putHeight",
    "relatedSearchShowState",
  ],
  computed: {
    netErrorType() {
      if (!this.medusa.isInitHasNetwork) {
        return "2";
      }
      return "";
    },
    showBackToTop() {
      // iframe页面有滚动并且没有正在滚动，展示回到顶部控件。
      return (
        !this.isScrolling &&
        this.beforeIfameScrollTop > 0 &&
        this.medusa.defaultTabIndex === 4
      );
    },
    containerFilletVariable() {
      return `--gs-web-page-radius: ${
        this.iframeWhetherTheContentHasAScrollValue ? "0" : "14px"
      };`;
    },
  },
  inject: ["medusa"],
  components: {
    BackToTop,
    NetWorkError,
  },
  beforeCreate() {
    // 记录网页开始load的时间。
    this.consumeTimeStart = new Date().getTime();
  },
  created() {
    this.whetherBlockedBaiduRelatedSearch = false;
    this.isWebIframeBindScroll = false;
    const srcQuery = this.medusa.formatQuery;
    if (!srcQuery) return "";
    /**
     * 加时间戳是为了保证唯一性。
     * new Date().getTime()sessionID：保证每次搜索对应的url唯一。
     * new Date().getTime()from=gs：客户端用于识别url做拦截。
     */
    this.src = `${this.url}${srcQuery}&gsfrom=gs`;
    // 初始化tab的index，用于上报search_engine_load
    this.tabInitIndex = this.medusa.tabInitIndex;
  },
  mounted() {
    iframeDom = this.$refs.web_iframe;
    const webScrollDom = document.querySelector("#SearchWebPage");
    this.$refs.web_iframe_mask?.addEventListener("touchend", this.touchEndFunc);
    if (webScrollDom) {
      this.webScrollDom = webScrollDom;
    }
  },
  beforeDestroy() {
    this.$refs.web_iframe_mask?.removeEventListener(
      "touchend",
      this.touchEndFunc
    );
    this.removeWatchIframeScrolling();
  },
  methods: {
    iframeLoaded() {
      this.setToutiaoOperate();
      const consumeTime = new Date().getTime() - (this.consumeTimeStart || 0);
      const oldSearchId = this.pageInfo?.search_id || 0;
      trackSearch(
        Object.assign({}, this.pageInfo, {
          search_status: "search_engine_time",
          scenes: this.name,
          consume_time: consumeTime,
          page_num: "0",
          search_id: Date.now(),
          ori_search_id: oldSearchId,
          engine_url: this.src,
          result_status: 1,
        })
      );
      if (this.tabInitIndex !== 4) {
        trackSearch(
          Object.assign({}, this.pageInfo, {
            search_status: "search_engine_load",
            scenes: this.name,
            consume_time: consumeTime,
            page_num: "0",
            search_id: Date.now(),
            ori_search_id: oldSearchId,
            engine_url: this.src,
            result_status: 1,
          })
        );
      }
      this.touchEndFunc();
    },
    touchEndFunc() {
      if (!this.isWebIframeBindTouching) {
        // 给iframe里面设置touch事件监听
        this.isWebIframeBindTouching =
          this.watchTabsRelationalFromIframe("web_iframe");
      }
      if (!this.isWebIframeBindScroll) {
        this.isWebIframeBindScroll = this.watchIframeScrolling();
      }
    },
    clickBackToTop() {
      iframePageBackToTop(this.$refs.web_iframe);
    },
    watchIframeScrolling() {
      try {
        const iframeDocument = iframeDom?.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument) {
          if (this.name !== "头条搜索") {
            iframeDocument.addEventListener("scroll", this.iframeScrollFunc);
          } else {
            // 头条页面滚动事件无法触发问题fix。
            iframeDocument.onscroll = this.iframeScrollFunc;
          }
        }
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
        return false;
      }
    },
    removeWatchIframeScrolling() {
      this.isWebIframeBindScroll = false;
      try {
        const iframeDocument = iframeDom?.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument) {
          if (this.name !== "头条搜索") {
            iframeDocument.removeEventListener("scroll", this.iframeScrollFunc);
          } else {
            // 头条页面滚动事件无法触发问题fix。
            iframeDocument.onscroll = null;
          }
        }
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
      }
    },
    // 子iframe scroll监听函数。
    iframeScrollFunc: function () {
      this.isWebIframeBindScroll = true;
      this.isScrolling = true;
      const iframeWindow = iframeDom?.contentWindow;
      const iframeDocument = iframeDom?.contentWindow
        ? iframeDom.contentWindow.document
        : null;
      if (iframeDocument) {
        if (
          !this.whetherBlockedBaiduRelatedSearch &&
          this.name === "百度搜索"
        ) {
          this.blockBaiduRelatedSearch(iframeDocument);
        }
        // 实时获取子iframe当前的滚动距离。
        const contentScrollTop = iframeDocument.documentElement.scrollTop;
        if (contentScrollTop > 0) {
          this.iframeWhetherTheContentHasAScrollValue = true;
        } else if (contentScrollTop === 0) {
          this.iframeWhetherTheContentHasAScrollValue = false;
        }
        // 判断滚动方向。
        if (contentScrollTop - this.beforeIfameScrollTop > 0) {
          this.putHeight("web", "-50px");
        } else {
          this.putHeight("web", "0px");
        }
        this.beforeIfameScrollTop = contentScrollTop;
      }
      // 本次滚动清楚上一次滚动设定的定时。
      if (this.timer) {
        iframeWindow.clearTimeout(this.timer);
      }
      // 每次滚动触发以后设定定时，用于判断滚动是否结束。
      this.timer = iframeWindow.setTimeout(() => {
        this.judgeScrollingStateFromIframe();
      }, 200);
    },
    // 判断iframe页面是否停止滚动
    judgeScrollingStateFromIframe: function () {
      const iframeDocument = iframeDom.contentWindow
        ? iframeDom.contentWindow.document
        : null;
      if (iframeDocument) {
        const iframeScrollTop = iframeDocument.documentElement.scrollTop;
        // 如果当前子iframe的滚动距离===200ms前iframe的滚动距离，确定滚动结束。
        if (iframeScrollTop === this.beforeIfameScrollTop) {
          this.isScrolling = false;
        }
      }
    },
    setToutiaoOperate() {
      // 派发scroll事件到头条页面。
      if (this.name !== "头条搜索") return;
      try {
        const iframeWindow = iframeDom.contentWindow;
        if (iframeWindow) {
          iframeWindow.dispatchEvent(new Event("scroll"));
        }
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
      }
    },
    // 屏蔽百度相关搜索
    blockBaiduRelatedSearch(iframeDocument) {
      const baiduRelatedSearchDom = iframeDocument.getElementById(
        "se-recommend-word-list-container"
      );
      if (baiduRelatedSearchDom) {
        baiduRelatedSearchDom.setAttribute(
          "style",
          "display: none !important;"
        );
        this.whetherBlockedBaiduRelatedSearch = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-"; // 可配置的命名空间
@include b(web-page) {
  min-height: calc(100vh - 52px);
  position: relative;
  border-radius: var(--gs-web-page-radius) var(--gs-web-page-radius) 0 0;
  margin: 0px 10px 0px 10px;
  overflow: hidden;
  @include m(has-margin) {
    margin-top: 10px;
  }
  @include e(iframe) {
    overflow: hidden;
    border: none;
    height: calc(100vh - 42px);
    display: block;
  }
  @include e(back-top) {
    position: fixed;
    z-index: 1000;
    bottom: 15px;
    right: calc(100vw + 9px);
  }
  @include e(iframe-mask) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
