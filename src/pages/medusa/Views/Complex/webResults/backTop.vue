<template>
  <back-to-top
    class="medsua-complex-web-results-back-top"
    v-if="isShow"
    :clickBackToTop="clickBackToTop"
  />
</template>

<script>
import { inView, debounce, oreport } from "@lego";
import { BackToTop } from "@components";
import { iframePageBackToTop } from "@lego";
export default {
  props: ["formatScrollTop", "name", "fnMonitorTheScroll"],
  inject: ["backTop", "medusa"],
  components: {
    BackToTop,
  },
  data() {
    return {
      // 当前页面（主页面或者子iframe）是否在滚动。
      isScrolling: false,
      // 当前iframe是否在视口内。
      isIframeInView: this.medusa.positionToWebPage,
      // 当前主页面的滚动距离。
      scrollTop: 0,
      // 定时tag
      timer: "",
      // 上一时刻iframe内页面滚动的距离值，用于判断iframe滚动是否停止。
      beforeIfameScrollTop: 0,
      // 获取父组件的iframe元素
      iframeDom: this.$parent.$refs.complex_iframe,
    };
  },
  computed: {
    isShow() {
      // 当iframe在视口内并且页面（主页面或者子iframe）没有在滚动，展示回到顶部控件。
      return (
        this.isIframeInView &&
        !this.isScrolling &&
        this.medusa.defaultTabIndex === 3
      );
    },
  },
  mounted() {
    // 给综合tab绑定scroll事件。
    if (document.getElementsByClassName("medusa-complex")[0]) {
      document
        .getElementsByClassName("medusa-complex")[0]
        .addEventListener("scroll", this.scrollFunc);
    }
  },
  beforeDestroy() {
    // remove综合tab的scroll事件。
    if (document.getElementsByClassName("medusa-complex")[0]) {
      document
        .getElementsByClassName("medusa-complex")[0]
        .removeEventListener("scroll", this.scrollFunc);
    }
    // remove iframe的scroll事件。
    this.removeWatchIframeScrolling();
  },
  methods: {
    // 点击以后回到顶部方法。（主页面和子iframe都回到顶部）
    clickBackToTop: function () {
      if (this.backTop) {
        // 主页面回到顶部
        this.backTop();
      }
      // 子iframe回到顶部。
      const iframeDom = this.iframeDom;
      iframePageBackToTop(iframeDom);
    },
    // 主页面scroll监听函数
    scrollFunc: function () {
      this.isScrolling = true;
      this.judgeIframeIsInView();
    },
    // 判断iframe是否在视口内。用防抖判断滚动是否停止。
    judgeIframeIsInView: debounce(function () {
      this.isScrolling = false;
      // 获取当前综合tab的滚动距离。
      const scrollTop =
        document.getElementsByClassName("medusa-complex")[0].scrollTop;
      const iframe = this.iframeDom;
      if (!iframe) return;
      // 如果iframe在视口内并且当前综合tab滚动距离不为0。
      if (inView(iframe.getBoundingClientRect(), 42).in && scrollTop) {
        this.isIframeInView = true;
      } else {
        this.isIframeInView = false;
      }
    }, 200),
    // 给子iframe添加scroll监听函数，给父组件调用。
    watchIframeScrolling() {
      try {
        const iframeDom = this.iframeDom;
        const iframeDocument = iframeDom.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument) {
          if (this.name !== "头条搜索") {
            iframeDocument.addEventListener("scroll", this.iframeScrollFunc);
          } else {
            // 头条页面滚动事件无法触发问题fix。
            iframeDocument.onscroll = this.iframeScrollFunc;
          }
          return true;
        }
        return false;
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
        return false;
      }
    },
    // remove子iframe scroll监听函数。
    removeWatchIframeScrolling() {
      try {
        const iframeDom = this.iframeDom;
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
      this.isScrolling = true;
      const iframeDom = this.iframeDom;
      const iframeWindow = iframeDom.contentWindow;
      const iframeDocument = iframeDom.contentWindow
        ? iframeDom.contentWindow.document
        : null;
      if (iframeDocument) {
        const scrollTop = iframeDocument.documentElement.scrollTop;
        this.fnMonitorTheScroll(scrollTop);
        this.formatScrollTop(scrollTop);
        // 实时获取子iframe当前的滚动距离。
        this.beforeIfameScrollTop = scrollTop;
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
      const iframeDom = this.iframeDom;
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
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medsua-complex-web-results-"; // 可配置的命名空间
@include b(back-top) {
  position: fixed;
  z-index: 1000;
  bottom: 15px;
  right: calc(200vw + 9px);
}
</style>
