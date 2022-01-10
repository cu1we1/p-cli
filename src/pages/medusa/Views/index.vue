<template>
  <div
    class="medusa-index"
    :data-exp="0"
    :data-log="$utils.inject(pageInfoData)"
    ref="colorTabsBox"
  >
    <color-tabs
      ref="colorTabs"
      :swipe-disabled="false"
      :initial-index="medusa.defaultTabIndex - 1"
      :class="tabsClass"
      @change="changeTabIndex"
      @click="clickTabTitle"
    >
      <color-tab-item
        id="SearchLocalPage"
        :lazyRender="true"
        :title="localTabTitle"
        class="
          medusa-index__color-tab-item
          medusa-index__color-tab-item--local
          medusa-index__color-tab-item--has-padding
        "
      >
        <local
          :hasLocalContent="hasLocalContent"
          :isClientSupportWebResults="isClientSupportWebResults"
          :isShowRefresh="isShowRefresh"
        />
      </color-tab-item>
      <color-tab-item
        id="SearchAppsPage"
        :lazyRender="true"
        :title="onlineTabTitle"
        class="
          medusa-index__color-tab-item
          medusa-index__color-tab-item--online-apps
          medusa-index__color-tab-item--has-padding
        "
      >
        <online-apps :isClientSupportWebResults="isClientSupportWebResults" />
      </color-tab-item>
      <color-tab-item
        id="SearchResultPage"
        :lazyRender="true"
        ref="iframeScrollWraper"
        :title="complexTabTitle"
        :class="`
          medusa-index__color-tab-item--complex
          ${
            relatedSearchShowState
              ? 'medusa-index__color-tab-item'
              : 'medusa-index__color-tab-item--no-padding'
          }
          ${isInitHasNetwork ? '' : 'medusa-index__color-tab-item--has-padding'}
          `"
      >
        <related-search
          v-if="isInitHasNetwork"
          originTab="complex"
          key="related-search-complex"
          :actualMrTop="relatedSearchComplexMrTop"
        />
        <complex
          :pageInfo="pageInfoData"
          :putHeight="getRelatedSearch"
          :watchTabsRelationalFromIframe="watchTabsRelationalFromIframe"
          :stopBulleUpTouchEvents="stopBulleUpTouchEvents"
          :relatedSearchShowState="relatedSearchShowState"
        />
      </color-tab-item>
      <color-tab-item
        v-if="isClientSupportWebResults"
        :lazyRender="true"
        id="SearchWebPage"
        :title="webTabTitle"
        :class="`
          medusa-index__color-tab-item
          medusa-index__color-tab-item--web-page
           ${
             isInitHasNetwork ? '' : 'medusa-index__color-tab-item--has-padding'
           }
          `"
      >
        <related-search
          v-if="isInitHasNetwork"
          key="related-serach-web-page"
          originTab="web"
          :actualMrTop="relatedSearchWebMrTop"
        />
        <web
          :relatedSearchShowState="relatedSearchShowState"
          :putHeight="getRelatedSearch"
          :name="medusa.engineName"
          :url="medusa.webUrl"
          :pageInfo="pageInfoData"
          :watchTabsRelationalFromIframe="watchTabsRelationalFromIframe"
          ref="webTab"
        />
      </color-tab-item>
      <color-tab-item
        :lazyRender="true"
        id="SearchGamePage"
        :title="gamesTabTitle"
        class="
          medusa-index__color-tab-item medusa-index__color-tab-item--has-padding
        "
      >
        <game
          :query="query"
          :isClientSupportWebResults="isClientSupportWebResults"
        />
      </color-tab-item>
    </color-tabs>
  </div>
</template>

<script>
import {
  localStorage,
  oreport,
  removeExportTag,
  debounceExport,
  debounceExport500,
  trackClickBaseEle,
} from "@lego";
import { DEFAULT_TAB_INDEX } from "@lego";
import Complex from "./Complex";
import Local from "./Local";
import OnlineApps from "./OnlineApps";
import Web from "./Web";
import Game from "./Games";
import relatedSearch from "@gs/relatedSearch";

const pageIdMapping = {
  百度: "Baidu",
  头条: "Toutiao",
};

export default {
  props: [
    "query",
    "isInitHasNetwork",
    "isClientSupportWebResults",
    "hasLocalContent",
    "isShowRefresh",
  ],
  inject: ["medusa"],
  provide() {
    return {
      changeToLocalTab: this.changeToLocalTab,
      changeToWebTab: this.changeToWebTab,
    };
  },
  components: {
    Complex,
    Local,
    OnlineApps,
    Web,
    Game,
    relatedSearch,
  },
  data() {
    return {
      // 上一时刻滑动元素距离视口的left值（getBoundingClientRect获取）
      lastLeftPosition: null,
      // 上一次判断元素位置的时间点。
      lastLeftPositionTime: null,
      // 当前的触发touch事件的手指id。
      currentIdentifier: null,
      // currentIdentifier的先后排序
      identifierSortList: [],
      // 是否将本次的touch事件冒泡到主页面
      isBubbleUp: true,
      // tab点击事件触发时间
      tabClickTimer: "",
      // 网页搜索跳转来源，取值只有两个：searchLocalPage和searchAppsPage
      webGuider: "",
      relatedSearchComplexMrTop: "0px",
      relatedSearchWebMrTop: "0px",
    };
  },
  computed: {
    pageInfoData() {
      // 切换tab改变pageInfo里面的page_id
      const pageId = this.getPageId(this.medusa.defaultTabIndex);
      return Object.assign(this.medusa.pageInfo, {
        page_id: pageId,
      });
    },
    relatedSearchShowState() {
      return (
        this.medusa.isRelatedSearchReady &&
        this.medusa.relatedSearchList.length > 0
      );
    },
  },
  created() {
    // 使用局部变量。
    this.tabsClass = "";
    if (this.isClientSupportWebResults) {
      this.tabsClass += " medusa-index--has-web";
    } else {
      this.tabsClass += " medusa-index--no-web";
    }
    // 获取网页tab的tab名称
    const searchEngineName = this.medusa.engineName;
    if (!searchEngineName) {
      this.localTabTitle = "本机";
      this.complexTabTitle = "综合";
      this.webTabTitle = "";
      this.onlineTabTitle = "应用";
      this.gamesTabTitle = "游戏";
    } else {
      this.localTabTitle = "本机";
      this.complexTabTitle = "综合";
      this.webTabTitle = searchEngineName?.split("搜索")[0];
      this.onlineTabTitle = "应用";
      this.gamesTabTitle = "游戏";
    }
  },
  mounted() {
    this.medusa.changToComplexTab = this.changToComplexTab;
    // 给每个tab滑动绑定scroll事件，用于处理页面元素曝光等。
    const tabItems = document.getElementsByClassName(
      "medusa-index__color-tab-item"
    );
    if (tabItems.length) {
      Array.prototype.forEach.call(tabItems, (item) => {
        if (item.id === "SearchWebPage") {
          item.addEventListener("scroll", this.webTabScrollFunc);
        } else {
          item.addEventListener("scroll", debounceExport500);
        }
      });
    }
    this.addIDToTabTitles();
  },
  beforeDestroy() {
    // 组件销毁前移除iframe时间的绑定。
    this.removeTabsRelationalFromIframe("web_iframe");
    this.removeTabsRelationalFromIframe("complex_iframe");
    // 给每个tab滑动绑定scroll事件，用于处理页面元素曝光等。
    const tabItems = document.getElementsByClassName(
      "medusa-index__color-tab-item"
    );
    if (tabItems.length) {
      Array.prototype.forEach.call(tabItems, (item) => {
        if (item.id === "SearchWebPage") {
          item.removeEventListener("scroll", this.webTabScrollFunc);
        } else {
          item.removeEventListener("scroll", debounceExport500);
        }
      });
    }
  },
  methods: {
    webTabScrollFunc() {
      debounceExport500();
      this.$refs.webTab.touchEndFunc();
    },
    clickTabTitle(index) {
      if (index + 1 === this.medusa.defaultTabIndex) return;
      this.tabClickTimer = new Date().getTime();
      trackClickBaseEle(this.$refs.colorTabsBox, {
        control_id: this.getPageId(index + 1),
        resource_position: `${this.medusa.defaultTabIndex}`,
        click_pattern: "click",
      });
    },
    // 切换到本地tab
    changeToLocalTab() {
      this.$refs.colorTabs.setCurrentIndex(0);
    },
    // 切换到综合tab
    changToComplexTab() {
      this.$refs.colorTabs.setCurrentIndex(2);
    },
    // 切换到网页tab
    changeToWebTab() {
      this.$refs.colorTabs.setCurrentIndex(3);
    },
    // 埋点重置
    removeExportTag,
    // 页面曝光
    debounceExport,
    getPageId(index) {
      switch (index) {
        case 1:
          return "SearchLocalPage";
        case 2:
          return "SearchAppsPage";
        case 3:
          return "SearchResultPage";
        case 4:
          return `Search${pageIdMapping[this.webTabTitle] || ""}Page`;
        case 5:
          return "SearchGamesPage";
      }
      return "";
    },
    // 元素touches，不支持array操作方法，所以要遍历
    getTouchPoint(e) {
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === this.currentIdentifier) {
          return e.touches[i];
        }
      }
      return null;
    },
    // 重写了touch事件的event对象。
    generTouchEvent(e) {
      const targetPoint = this.getTouchPoint(e);
      if (!targetPoint) return e;
      const touchPoint = {
        clientX:
          targetPoint.clientX +
          this.$refs.colorTabs.translateX +
          this.$refs.colorTabs.currentIndex * this.$refs.colorTabs.width,
        clientY:
          targetPoint.clientY - this.$refs.iframeScrollWraper.$el.scrollTop,
      };
      return {
        target: e.target,
        changedTouches: e.changedTouches,
        touches: [touchPoint],
      };
    },
    // 获取和维护当前的触发touch事件的手指id的先后顺序。
    getCurrentIdentifier(e) {
      let tempIdentifier;
      for (let changeI = 0; changeI < e.changedTouches.length; changeI++) {
        tempIdentifier = e.changedTouches[changeI].identifier;

        let inCurrentTouches = false;
        let sortIndex = this.identifierSortList.indexOf(tempIdentifier);
        for (let touchI = 0; touchI < e.touches.length; touchI++) {
          if (e.touches[touchI].identifier === tempIdentifier) {
            inCurrentTouches = true;
            break;
          }
        }
        if (inCurrentTouches && sortIndex === -1) {
          this.identifierSortList.push(tempIdentifier);
        } else if (inCurrentTouches) {
          this.identifierSortList.splice(sortIndex, 1);
          this.identifierSortList.push(tempIdentifier);
        } else if (!inCurrentTouches && sortIndex > -1) {
          this.identifierSortList.splice(sortIndex, 1);
        }
      }
      return this.identifierSortList.length > 0
        ? this.identifierSortList[this.identifierSortList.length - 1]
        : null;
    },
    // 当前选中的tab改变的时候，实时保存在本地。
    changeTabIndex: function (index) {
      // 过滤点击切换的时候会上报滑动切换
      const timer = new Date().getTime();
      if (timer - this.tabClickTimer > 100) {
        trackClickBaseEle(this.$refs.colorTabsBox, {
          control_id: this.getPageId(index + 1),
          resource_position: `${this.medusa.defaultTabIndex}`,
          click_pattern: "slide",
        });
      }
      this.removeExportTag();
      localStorage.setItem(DEFAULT_TAB_INDEX, JSON.stringify(index + 1));
      this.medusa.defaultTabIndex = index + 1;
      // 切换tab以后上报page_out
      this.medusa.reportPageOut();
      // 每次切换tab，页面浏览时常开始时间都要重置。
      this.medusa.scanPageStart = new Date().getTime();
      this.medusa.pageInfo.web_guide = this.webGuider;
      if (index === 3) {
        this.medusa.pageInfo.engine_channel = this.medusa.webEngineChannel;
      } else if (index === 2) {
        this.medusa.pageInfo.engine_channel = this.medusa.complexEngineChannel;
      }
      setTimeout(() => {
        this.debounceExport();
      }, 500);
      this.tabClickTimer = "";
    },
    touchStartFunc(e) {
      // 当前手指id。
      this.currentIdentifier = this.getCurrentIdentifier(e);
      // 重写处理以后的touch事件对象。
      const event = this.generTouchEvent(e);
      // 调用tab组件实例的touchstart事件处理方法。
      this.$refs.colorTabs.handleContentTouchstart(event);
    },
    touchMoveFunc(e) {
      // 获取此刻touch事件元素的位置信息。和此刻的时间点。
      const dom = e.target;
      const { left } = dom.getBoundingClientRect();
      const nowTime = new Date().getTime();
      if (!this.isBubbleUp) return;
      if (
        // 上一次判断元素位置的时间点存在。
        this.lastLeftPositionTime &&
        // 本次判断元素位置和上次判断元素位置相隔时间大于5ms
        nowTime - this.lastLeftPositionTime > 5
      ) {
        if (
          // 两次元素水平位置没有改变。
          this.lastLeftPosition === left
        ) {
          this.lastLeftPositionTime = nowTime;
          const event = this.generTouchEvent(e);
          this.$refs.colorTabs.handleContentTouchmove(event);
        } else {
          this.isBubbleUp = false;
        }
      }
      this.lastLeftPosition = left;
      // 保存touchstart触发的时间点。
      this.lastLeftPositionTime = new Date().getTime();
    },
    touchEndFunc(e) {
      // 本地滑动结束，重置变量。
      this.lastLeftPosition = null;
      this.lastLeftPositionTime = null;
      if (!this.isBubbleUp) {
        this.isBubbleUp = true;
      }
      const event = this.generTouchEvent(e);
      this.$refs.colorTabs.handleContentTouchend(event);
      if (e.touches.length === 0) this.identifierSortList = [];
      this.currentIdentifier = this.getCurrentIdentifier(e);
    },
    // 在iframe内监听tabs滑动相关的事件，用于tabs组件可以滑动切换。
    watchTabsRelationalFromIframe: function (iframeID) {
      try {
        const iframeDom = document.getElementById(iframeID);
        const iframeDocument = iframeDom?.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument) {
          const searchEngineName = this.medusa.engineName;
          if (searchEngineName !== "头条搜索") {
            iframeDocument.addEventListener("touchstart", this.touchStartFunc);
            // iframe里面的touchmove事件
            iframeDocument.addEventListener("touchmove", this.touchMoveFunc);
            // iframe里面的touchend事件
            iframeDocument.addEventListener("touchend", this.touchEndFunc);
          } else {
            iframeDocument.ontouchstart = this.touchStartFunc;
            iframeDocument.ontouchmove = this.touchMoveFunc;
            iframeDocument.ontouchend = this.touchEndFunc;
          }
          // iframe里面的touchstart事件
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
    removeTabsRelationalFromIframe: function (iframeID) {
      try {
        const iframeDom = document.getElementById(iframeID);
        const iframeDocument = iframeDom?.contentWindow
          ? iframeDom.contentWindow.document
          : null;
        if (iframeDocument) {
          const searchEngineName = this.medusa.engineName;
          if (searchEngineName !== "头条搜索") {
            iframeDocument.removeEventListener(
              "touchstart",
              this.touchStartFunc
            );
            iframeDocument.removeEventListener("touchmove", this.touchMoveFunc);
            iframeDocument.removeEventListener("touchend", this.touchEndFunc);
          } else {
            iframeDocument.ontouchstart = null;
            iframeDocument.ontouchmove = null;
            iframeDocument.ontouchend = null;
          }
        }
      } catch (error) {
        if (location.hostname !== "localhost") {
          console.error(new Error(error));
          oreport.reportError(new Error(error));
        }
      }
    },
    addIDToTabTitles() {
      try {
        const tabTitlesDom = document.getElementsByClassName(
          "color-tabs__tab-title"
        );
        const IDMAPPING = {
          本机: "automated_medusa_local",
          应用: "automated_medusa_online_apps",
          综合: "automated_medusa_complex",
          头条: "automated_medusa_web",
          百度: "automated_medusa_web",
          游戏: "automated_medusa_games",
        };
        Array.prototype.forEach.apply(tabTitlesDom, [
          (item) => {
            if (item && item.setAttribute) {
              const tabTitle = item.innerText;
              item.setAttribute("id", IDMAPPING[tabTitle]);
            }
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    getRelatedSearch(origin, height) {
      if (origin === "complex") {
        this.relatedSearchComplexMrTop = height;
      } else {
        this.relatedSearchWebMrTop = height;
      }
    },
    stopBulleUpTouchEvents() {
      if (this.isBubbleUp) {
        this.isBubbleUp = false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
$namespace: "medusa-"; // 可配置的命名空间
@include b(index) {
  height: 100vh;
  /* 五个tab的 */
  @include m(has-web) {
    .color-tabs__header::deep {
      width: 304px;
    }
  }
  /* 三个tab */
  @include m(no-web) {
    .color-tabs__header::deep {
      width: 248px;
    }
  }
  @include e(color-tab-item) {
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }

    @include m(has-padding) {
      padding-top: 10px;
    }
  }
  @include e(color-tab-item) {
    @include m(no-padding) {
      height: calc(100vh - 32px);
    }
  }
}
</style>
