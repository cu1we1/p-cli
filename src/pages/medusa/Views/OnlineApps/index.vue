<template>
  <div class="medusa-sort-online-apps">
    <NetWorkError :netErrorType="netErrorType" />
    <template v-if="medusa.isInitHasNetwork">
      <div v-if="isLoading">
        <div v-loading="true" loading-background="transparent" />
      </div>
      <template v-else>
        <div
          v-if="onlineAppsList.length !== 0"
          class="medusa-sort-online-apps__box gs_card_bg_color"
          data-exp="0"
          :data-log="
            $utils.inject({
              card_id: '100101',
              card_position: 1,
            })
          "
        >
          <template v-for="(item, index) in onlineAppsList">
            <game-item
              v-if="item.type === 'game'"
              class="medusa-sort-online-apps__item"
              :key="`${item.id}-${index}`"
              v-bind="item"
              :keyword="medusa.query"
              :index="index"
              :showRecommend="true"
            />
            <app-item
              v-else
              class="medusa-sort-online-apps__item"
              :key="`${item.id}-${index}`"
              v-bind="item"
              :keyword="medusa.query"
              :index="index"
              :showRecommend="true"
            />
          </template>
          <div
            v-if="isFoldOnlineApps"
            @click="viewMore"
            class="medusa-sort-online-apps__view-more"
          >
            <div class="medusa-sort-online-apps__view-more--text">
              {{ viewMoreText }}
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.53214 9.33325L15.4679 9.33325C15.7618 9.33325 16 9.57237 16 9.86735C16 9.98874 15.9588 10.1065 15.8832 10.2013L12.5191 14.4163C12.2895 14.7041 11.8709 14.7505 11.5842 14.52C11.546 14.4894 11.5114 14.4546 11.4809 14.4163L8.11684 10.2013C7.9331 9.97105 7.97009 9.63492 8.19946 9.45051C8.29385 9.37461 8.41119 9.33325 8.53214 9.33325Z"
                :fill="$utils.isDark ? 'white' : 'black'"
              />
            </svg>
          </div>
        </div>
        <NoResults v-else />
        <hot-apps
          :list="hotAppsList"
          :recAddList="recAdd"
          :keyword="medusa.query"
          :injectAppsPkg="injectAppsPkgFromOnlineApps"
        />
        <anchor-to-web-page
          :webGuider="webGuider"
          v-if="isClientSupportWebResults"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { AppItem, GameItem } from "@components";
import { post, oreport } from "@lego";
import { APP_API } from "@lego";
import AnchorToWebPage from "@gs/anchorToWebPage";
import NoResults from "@gs/noResults";
import NetWorkError from "@gs/netWorkError";
import HotApps from "./components/HotApps";
import format from "./format";

export default {
  props: ["isClientSupportWebResults"],
  data() {
    return {
      // 当前卡内展示应用推荐的应用包名。
      showRecommendAppPkg: "",
      // 在线app搜索是否已经完成。
      isOnlineAppsReady: this.medusa.isOnlineAppReady,
      // 热门推荐应用搜索是否已经完成。
      isHotAppsReady: false,
      // 热门推荐应用数量是否大于0。
      hasHotApps: false,
      // 在线应用数量是否大于4。
      hasOnlineAppsMoreThanFour: false,
      // 是否折叠在线应用。
      isFold: true,
      // 热门推荐应用数据。
      hotAppsList: [],
      // 在线应用数据。
      onlineAppsList: [],
      // 折叠之前在线应用的列表。
      originalOnlineAppsList: [],
      // injectAppsPkg（来自在线应用）。
      injectAppsPkgFromOnlineApps: [],
      // 提供给推荐app过滤的app包名
      injectAppsPkg: [],
      // 需要补充到推荐应用前的App
      recAdd: [],
    };
  },
  inject: ["medusa"],
  provide() {
    // 提供给子孙组件访问此组件实例。（代替props传值）
    return {
      onlineApps: this,
    };
  },
  components: {
    NetWorkError,
    AnchorToWebPage,
    NoResults,
    AppItem,
    GameItem,
    HotApps,
  },
  computed: {
    netErrorType() {
      if (!this.medusa.isInitHasNetwork) {
        return "2";
      } else if (!this.medusa.hasNetwork) {
        return "1";
      }
      return "";
    },
    isLoading() {
      return !(this.medusa.isOnlineAppReady && this.isHotAppsReady);
    },
    isFoldOnlineApps() {
      // 默认折叠且有热门推荐应用且在线应用数量大于4个。
      return this.isFold && this.hasHotApps && this.hasOnlineAppsMoreThanFour;
    },
  },
  watch: {
    isLoading: function (newV) {
      if (!newV) {
        this.getOnlineAppsAndInjectAppsPkg();
      }
    },
    isFoldOnlineApps: function (newV) {
      this.setOnlineAppsListAndInjectAppsPkgOnFoldState(newV);
    },
  },
  created() {
    this.webGuider = "SearchAppsPage";
    this.viewMoreText = "展开更多";
  },
  mounted() {
    this.getHotApps();
  },
  methods: {
    format,
    changeShowRecommendAppPkg(pkg) {
      if (pkg) {
        this.showRecommendAppPkg = pkg;
      }
    },
    getHotApps() {
      post(APP_API, {
        params: {
          kw: "热门应用",
          f: "json",
          offset: 0,
          size: 20,
          v: "3.0",
          scene: "2",
          search_source: this.medusa.source,
        },
      })
        .then(({ app }) => {
          this.hotAppsList = this.format(app, "rec")?.list || [];
          this.hasHotApps = this.hotAppsList.length > 0;
          this.isHotAppsReady = true;
        })
        .catch((err) => {
          this.hasHotApps = false;
          this.isHotAppsReady = true;
          this.isFold = false;
          console.error(
            new Error(`medusa-views-onlineapps-getHotApps:-${err}`)
          );
          oreport.reportError(
            new Error(`medusa-views-onlineapps-getHotApps:-${err}`)
          );
        });
    },
    getOnlineAppsAndInjectAppsPkg() {
      const list = this.format(this.medusa.onlineAppsInfo).list || [];
      // 获取综合下展示的三个推荐应用。
      const recAdd = (
        this.format(this.medusa.onlineAppsRecAdd, "nointention").list || []
      ).slice(0, 3);
      this.recAdd = recAdd;
      this.hasOnlineAppsMoreThanFour = list.length > 4;
      this.originalOnlineAppsList = list;
      this.injectAppsPkgFromOnlineApps = [...recAdd, ...list].map(
        (item) => item?.pkg || ""
      );
      if (!this.isFoldOnlineApps) {
        this.setOnlineAppsListAndInjectAppsPkgOnFoldState(false);
      }
    },
    viewMore() {
      if (this.isFold) {
        this.isFold = false;
      }
    },
    setOnlineAppsListAndInjectAppsPkgOnFoldState(state) {
      if (state) {
        this.onlineAppsList = this.originalOnlineAppsList.slice(0, 4);
      } else {
        this.onlineAppsList = this.originalOnlineAppsList;
      }
    },
    // 供子组件调用。
    addHotAppsPkgToInjectAppsPkg(pkgList) {
      if (Array.isArray(pkgList) && pkgList.length > 0) {
        this.injectAppsPkg = [...this.injectAppsPkgFromOnlineApps, ...pkgList];
      } else {
        this.injectAppsPkg = [...this.injectAppsPkgFromOnlineApps];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$namespace: medusa-sort-;
@include b(online-apps) {
  position: relative;
  transform: scale(1);
  min-height: calc(100vh - 52px);
  @include e(box) {
    border-radius: 14px;
    box-sizing: border-box;
    position: relative;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 0 10px 10px 10px;
    @include e(item) {
      padding-left: 14px;
      padding-right: 14px;
    }
    @include e(view-more) {
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 1px;
      box-sizing: border-box;
      @include m(text) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        font-weight: 400;
      }
    }
  }
}
</style>
