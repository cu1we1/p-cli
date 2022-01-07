<template>
  <div
    id="medusa-sort-web-result"
    :style="containerFilletVariable"
    data-exp="0"
    :data-log="
      $utils.inject({
        big_card_id: '100599',
        big_card_position: cardPosition,
        card_id: '100599',
        card_position: 1,
        card_type: name,
      })
    "
  >
    <div
      class="medusa-sort-web-result__title fw_normal"
      v-show="medusa.isShowEntry"
    >
      {{ `以下网页结果由${name}提供` }}
    </div>
    <div
      v-show="medusa.isShowEntry"
      class="medusa-sort-web-result__iframe-bottom-gap"
      ref="iframe_bottom_gap"
    />
    <div
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_name: name,
          resource_source: 1,
        })
      "
      class="medusa-sort-web-result"
    >
      <iframe
        key="iframe"
        name="global-search-web-results"
        class="medusa-sort-web-result__iframe-content"
        id="complex_iframe"
        ref="complex_iframe"
        :src="src"
        scrolling="yes"
        @load="iframeLoaded"
      />
      <div
        v-if="showMask"
        class="medusa-sort-web-result__iframe-mask"
        id="iframe-mask"
      />
      <back-top
        ref="childBackTop"
        :fnMonitorTheScroll="fnMonitorTheScroll"
        :formatScrollTop="formatScrollTop"
        :name="name"
        data-href=""
        :data-log="
          $utils.inject({
            control_name: 'sticky_icon',
            control_type: 'button',
            control_position: 1,
          })
        "
      />
    </div>
  </div>
</template>

<script>
import {
  inView,
  toTrackData,
  addVisibilityChangeCallBack,
  oreport,
  debounce,
  trackSearch,
  throttle,
  performanceReportIframe,
  performanceTrack,
} from "@lego";

let iframeDom = null;
let frameStartLoadTime = 0;
import BackTop from "./backTop";
export default {
  props: [
    "name",
    "url",
    "watchTabsRelationalFromIframe",
    "pageInfo",
    "showState",
    "formatScrollTop",
  ],
  components: {
    BackTop,
  },
  inject: ["medusa"],
  data() {
    return {
      // 开始浏览网页内容的开始时间戳。用于统计浏览时常。
      scanStart: 0,
      // 网页内容是否满屏。
      isFullIn: false,
      // iframe内容是否可以滚动。
      iframeState: "yes",
      // 是否已经给iframe内容容器设置了overflow:hidden;
      hasSetHidden: false,
      // iframe内容的高度。
      iframeContentHeight: "",
      // 网页内容加载页数。
      webPageNum: 1,
      // 是否展示遮罩层。
      showMask: true,
      // 间距元素是否在视口中
      isGapIn: false,
      // 是否已经上报valid_card_in
      isUploadValid: false,
      // 是否已经上报half_screen_in
      isUploadHalfScreenIn: false,
      // 是否已经上报full_screen_in
      isUploadFullScreenIn: false,
      // 容器圆角变量
      iframeWhetherTheContentHasAScrollValue: false,
    };
  },
  beforeCreate() {
    // 记录网页开始load的时间。
    this.consumeTimeStart = new Date().getTime();
  },
  created() {
    // 是否成功屏蔽了百度相关搜索
    this.whetherBlockedBaiduRelatedSearch = false;
    // 当前屏幕高度。
    this.clientHeight = document.documentElement.clientHeight;
    if (this.name === "头条搜索") {
      this.domId = "page-main";
    } else if (this.name === "百度搜索") {
      this.domId = "page";
    } else {
      this.domId = "";
    }
    this.setIframeSrc();
    // 初始化tab的index，用于上报search_engine_load
    this.tabInitIndex = this.medusa.tabInitIndex;
  },
  computed: {
    cardPosition() {
      return this.medusa.entryData.length + 1;
    },
    defaultTabIndex() {
      return this.medusa.defaultTabIndex;
    },
    containerFilletVariable() {
      return `--web-results-radius: ${
        this.iframeWhetherTheContentHasAScrollValue ? "0" : "14px"
      };`;
    },
  },
  watch: {
    iframeContentHeight: function (newValue, oldValue) {
      if (!(newValue && oldValue)) return;
      const newHeight = newValue.split("px")[0];
      const oldHeight = oldValue.split("px")[0];
      if (newHeight - oldHeight >= this.clientHeight) {
        this.webPageNum = this.webPageNum + 1;
        this.loadNextPage();
      }
    },
    // 监听tab的切换，上报funll_screen_in or out
    defaultTabIndex(newValue, oldValue) {
      if (oldValue === 3) {
        this.postFullScreenInfoOfOut();
      }
      if (newValue === 3) {
        setTimeout(() => {
          this.judgeResults();
          this.isWebOnly();
          this.postFullScreenInfoOfIn();
        }, 500);
      }
    },
  },
  mounted() {
    iframeDom = this.$refs.complex_iframe;
    addVisibilityChangeCallBack((data) => {
      if (+data === 1) {
        setTimeout(() => {
          this.postFullScreenInfoOfIn();
        }, 500);
      } else {
        this.postFullScreenInfoOfOut();
      }
    });
    if (document.getElementsByClassName("medusa-complex")[0]) {
      document
        .getElementsByClassName("medusa-complex")[0]
        .addEventListener("scroll", this.getScrollerTop);
    }
    document.addEventListener("touchstart", this.touchStartFunc);
    document.addEventListener("touchend", this.touchEndFunc);
    // 给外层组件注册上报full_screen_out方法。
    this.medusa.postFullScreenInfoOfOut = this.postFullScreenInfoOfOut;
    this.appendIframe();
    if (this.defaultTabIndex !== 3) return;
    this.judgeResults();
    this.isWebOnly();
  },
  beforeDestroy() {
    if (document.getElementsByClassName("medusa-complex")[0]) {
      document
        .getElementsByClassName("medusa-complex")[0]
        .removeEventListener("scroll", this.getScrollerTop);
    }
    document.removeEventListener("touchstart", this.touchStartFunc);
    document.removeEventListener("touchend", this.touchEndFunc);
    iframeDom = null;
  },
  methods: {
    setIframeSrc() {
      const srcQuery = this.medusa.formatQuery;
      /**
       * 加时间戳是为了保证唯一性。
       * new Date().getTime()sessionID：保证每次搜索对应的url唯一。
       * new Date().getTime()from=gs：客户端用于识别url做拦截。
       */
      this.src = `${this.url}${srcQuery}&gsfrom=gs`;
    },
    // 是否只有网页结果。
    isWebOnly() {
      if (!this.$refs.complex_iframe || !this.showState) return;
      const iframeGetToTop =
        this.$refs.complex_iframe.getBoundingClientRect().top <= 110;
      if (iframeGetToTop) {
        this.uploadValidCardIn("1");
      }
    },
    // 上报半屏埋点（此埋点仅上报一次）。
    uploadHalfScreenIn() {
      if (!this.isUploadHalfScreenIn) {
        toTrackData(
          1001,
          Object.assign(
            {
              exposure_type: "half_screen_in",
              big_card_id: "100599",
              big_card_position: this.cardPosition,
              card_id: "100599",
              card_type: this.name,
            },
            this.pageInfo
          )
        );
        this.isUploadHalfScreenIn = true;
      }
    },
    // 上报valid_card_in方法（此埋点仅上报一次）。
    uploadValidCardIn(state) {
      if (!this.isUploadValid) {
        toTrackData(
          1001,
          Object.assign(
            {
              exposure_type: "valid_card_in",
              big_card_id: "100599",
              big_card_position: this.cardPosition,
              card_id: "100599",
              card_type: this.name,
              is_web_only: state || "0",
            },
            this.pageInfo
          )
        );
        this.isUploadValid = true;
      }
    },
    // 判断网页结果是否超过半屏。
    judgeResults() {
      if (!this.$refs.complex_iframe || !this.showState) return;
      // 半屏需要减去tab高度+’以下网页结果由头条搜索提供‘。
      const iframeGetToTop =
        this.$refs.complex_iframe.getBoundingClientRect().top <=
        (+this.clientHeight - 110) / 2;
      if (iframeGetToTop) {
        this.setToutiaoOperate();
        this.uploadHalfScreenIn();
      }
    },
    // 派发scroll事件到头条页面。
    setToutiaoOperate() {
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
    postFullScreenInfoOfIn() {
      if (!this.showState) return;
      if (this.isFullIn) {
        this.scanStart = new Date().getTime();
        toTrackData(
          1001,
          Object.assign(
            {
              exposure_type: "full_screen_in",
              card_id: "100599",
              card_position: 1,
              big_card_id: "100599",
              big_card_position: this.cardPosition,
              card_type: this.name,
            },
            this.pageInfo
          )
        );
      } else {
        if (!this.$refs.iframe_bottom_gap || !this.$refs.complex_iframe) return;
        const isIframeIn =
          this.$refs.complex_iframe.getBoundingClientRect().top <= 99;
        if (isIframeIn) {
          this.scanStart = new Date().getTime();
          this.isFullIn = true;
          toTrackData(
            1001,
            Object.assign(
              {
                exposure_type: "full_screen_in",
                card_id: "100599",
                card_position: 1,
                big_card_id: "100599",
                big_card_position: this.cardPosition,
                card_type: this.name,
              },
              this.pageInfo
            )
          );
        }
      }
    },
    postFullScreenInfoOfOut() {
      if (!this.isFullIn || !this.showState) return;
      toTrackData(
        1001,
        Object.assign(
          {
            exposure_type: "full_screen_out",
            exposure_time: new Date().getTime() - this.scanStart,
            big_card_id: "100599",
            big_card_position: this.cardPosition,
            card_id: "100599",
            card_position: 1,
            card_type: this.name,
          },
          this.pageInfo
        )
      );
      this.isFullIn = false;
    },
    appendIframe() {
      if (!iframeDom) return;
      iframeDom.style = "";
      frameStartLoadTime = +new Date() - window._GSEISearchTime;
    },
    touchStartFunc() {
      // 为了初始化定位到网页部分，touchstart的时候展示其他卡片切保证页面不滚动。
      this.medusa.touchStartFunc();
      if (this.defaultTabIndex !== 3 || !this.showMask) return;
      this.setHidden("0");
    },
    touchEndFunc() {
      // touchEnd触发的时候隐藏遮罩层，为了解决第一次横向滑动问题。
      if (this.defaultTabIndex !== 3 || !this.showMask) return;
      if (this.hasSetHidden) {
        this.showMask = false;
      }
    },
    loadNextPage() {
      if (!this.showState) return;
      toTrackData(
        1003,
        Object.assign(this.pageInfo, {
          search_status: "search_engine_time",
          scenes: this.name,
          page_num: this.webPageNum,
        })
      );
    },
    iframeLoaded() {
      if (!iframeDom) return;
      const consumeTime = new Date().getTime() - (this.consumeTimeStart || 0);
      trackSearch(
        Object.assign(
          {},
          {
            search_status: "search_engine_time",
            scenes: this.name,
            consume_time: consumeTime,
            page_num: "0",
            engine_url: this.src,
            result_status: 1,
          },
          this.pageInfo
        )
      );
      if (this.tabInitIndex !== 3) {
        trackSearch(
          Object.assign(
            {},
            {
              search_status: "search_engine_load",
              scenes: this.name,
              consume_time: consumeTime,
              page_num: "0",
              engine_url: this.src,
              result_status: 1,
            },
            this.pageInfo
          )
        );
      }
      performanceTrack.track("iframeLoaded");
      performanceTrack.track("iframeStartLoad");
      performanceTrack.track("iframeStartLoadCheck", () => frameStartLoadTime);
      performanceReportIframe();

      this.setObserver();
      // iframe加载完成以后，如果网页结果占比超过半屏，那么派发scroll事件给头条页面。
      if (this.defaultTabIndex === 3) {
        this.judgeResults();
        this.isWebOnly();
      }
      if (this.iframeState === "no" || this.hasSetHidden || !this.showMask)
        return;
      this.setHidden("0");
    },
    setObserver() {
      try {
        const iframeDocument = iframeDom.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument && this.domId) {
          const MObserver = MutationObserver;
          const elementBody = iframeDocument.body;
          const elementPageMain = iframeDocument.getElementById(this.domId);
          if (!elementPageMain) return;
          const observer = new MObserver(
            debounce(() => {
              this.iframeContentHeight =
                getComputedStyle(elementPageMain).height;
            }, 200)
          );
          observer.observe(elementBody, {
            childList: true,
            attributes: true,
          });
        }
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
      }
    },
    setHidden(state) {
      this.setWatchersToIframe();
      try {
        const iframeDocument = iframeDom.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument) {
          if (
            !this.whetherBlockedBaiduRelatedSearch &&
            this.name === "百度搜索"
          ) {
            this.blockBaiduRelatedSearch(iframeDocument);
          }
          const iframeInnerDom = iframeDocument.body;
          if (iframeInnerDom && state === "0" && this.iframeState === "yes") {
            iframeInnerDom.style.overflow = "hidden";
            this.iframeState = "no";
          }
          if (iframeInnerDom && state === "1" && this.iframeState === "no") {
            iframeInnerDom.style.overflow = "auto";
            this.iframeState = "yes";
            if (this.showMask) {
              this.showMask = false;
            }
          }
        }
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
      }
    },
    getScrollerTop: throttle(function () {
      if (!this.$refs.iframe_bottom_gap || !iframeDom || !this.showState)
        return;
      this.isGapIn = inView(
        this.$refs.iframe_bottom_gap.getBoundingClientRect(),
        43
      ).in;
      const isIframeIn = iframeDom.getBoundingClientRect().top <= 99;
      if (!isIframeIn && this.isFullIn) {
        this.isFullIn = false;
        this.isUploadFullScreenIn = false;
        toTrackData(
          1001,
          Object.assign(
            {
              exposure_type: "full_screen_out",
              exposure_time: new Date().getTime() - this.scanStart,
              card_id: "100599",
              card_position: 1,
              big_card_id: "100599",
              big_card_position: this.cardPosition,
              card_type: this.name,
            },
            this.pageInfo
          )
        );
      }
      if (isIframeIn && !this.isUploadFullScreenIn) {
        this.scanStart = new Date().getTime();
        this.isFullIn = true;
        this.isUploadFullScreenIn = true;
        toTrackData(
          1001,
          Object.assign(
            {
              exposure_type: "full_screen_in",
              card_id: "100599",
              card_position: 1,
              big_card_id: "100599",
              big_card_position: this.cardPosition,
              card_type: this.name,
            },
            this.pageInfo
          )
        );
      }
      if (this.isGapIn) {
        this.setHidden("0");
        this.judgeResults();
        this.uploadValidCardIn();
      } else {
        this.setHidden("1");
      }
    }, 500),
    setWatchersToIframe() {
      if (this.hasSetHidden) return;
      this.hasSetHidden =
        this.watchTabsRelationalFromIframe("complex_iframe") &&
        this.$refs.childBackTop.watchIframeScrolling();
    },
    // 屏蔽百度相关搜索。
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
    fnMonitorTheScroll(scrollTop) {
      if (scrollTop > 0) {
        this.iframeWhetherTheContentHasAScrollValue = true;
      } else if (scrollTop === 0) {
        this.iframeWhetherTheContentHasAScrollValue = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-sort-";
@include b(web-result) {
  position: relative;
  border-radius: var(--web-results-radius) var(--web-results-radius) 0 0;
  margin: 0px 10px 0px 10px;
  overflow: hidden;
  @include e(title) {
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 700;
    margin: 16px;
  }
  @include e(iframe-content) {
    overflow: hidden;
    border: none;
    width: 100%;
    height: calc(100vh - 32px);
    display: block;
    @include m(border-none) {
      border: none;
    }
  }
  @include e(iframe-bottom-gap) {
    width: 100%;
    height: 1px;
    // background-color: red;
  }
  @include e(iframe-mask) {
    width: 100%;
    height: 100%;
    // background-color: rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
