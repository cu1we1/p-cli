<template>
  <div
    class="medusa-sort-online-apps"
    :data-exp="0"
    :data-log="
      $utils.inject({
        page_id: 'AppListPage',
      })
    "
  >
    <div v-if="isLoading">
      <div
        v-loading="true"
        loading-text="正在加载..."
        loading-background="transparent"
      />
    </div>
    <NetWorkError
      class="medusa-sort-online-apps__net-work-error"
      v-else-if="!hasNetwork"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: 'netWordError',
        })
      "
    />
    <Empty
      v-else-if="!hasResults"
      class="medusa-sort-online-apps__empty"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: 'empty',
        })
      "
      subtitle="无搜索结果"
    >
    </Empty>
    <div
      v-else
      class="medusa-sort-online-apps__box"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: '100101',
          card_position: 1,
        })
      "
    >
      <template v-for="(item, index) in onlineApps">
        <game-item
          v-if="item.type === 'game'"
          class="medusa-sort-online-apps__item"
          :key="`${item.id}-${index}`"
          v-bind="item"
          :keyword="query"
          :index="index"
          :showRecommend="true"
        />
        <app-item
          v-else
          class="medusa-sort-online-apps__item"
          :key="`${item.id}-${index}`"
          v-bind="item"
          :keyword="query"
          :index="index"
          :showRecommend="true"
        />
      </template>
    </div>
  </div>
</template>

<script>
import {
  init,
  localStorage,
  registerAppDownloadProgress,
  isNetworkAvailable,
  post,
  oreport,
} from "@lego";
import { SUG_ONLINE_APPS, COMPLEX_ONLINE_APPS, APP_API } from "@lego";
import { NetWorkError, Empty, AppItem, GameItem } from "@components";
import format from "./format";

const isNetwork = isNetworkAvailable();

export default {
  data() {
    const { q: query, id, from, sup_app_progress } = this.$route.query;
    return {
      id,
      from,
      isLoading: true,
      // 是否有网络。
      hasNetwork: isNetwork === "1",
      onlineApps: [],
      injectAppsPkg: [],
      query,
      // 是否支持app下载进度。
      isSupAppDownloadProgress: sup_app_progress === "1",
      // 正在下载的app信息。key为包名，value为下载进度信息。
      downloadAppsInfo: {},
      // 暂停接收下载进度的app集合。
      pauseReceivingDownloadProgressList: [],
      hasResults: false,
      // 当前卡内展示应用推荐的应用包名
      showRecommendAppPkg: "",
      // 需要更新状态的游戏。
      gamesPKGNeedUpdateStatus: {},
    };
  },
  provide() {
    // 提供给子孙组件访问此组件实例。（代替props传值）
    return {
      medusa: this,
      onlineApps: this,
    };
  },
  components: {
    NetWorkError,
    Empty,
    AppItem,
    GameItem,
  },
  created() {
    init();
  },
  mounted() {
    if (this.from === "search_shark") {
      this.fetchDataFromOnline();
    } else {
      this.fetchDataFromLocal();
    }
    // 注册从客户端获取app下载进度的方法。
    if (this.isSupAppDownloadProgress) {
      registerAppDownloadProgress(this.checkAppDownloadProgress);
    }
  },
  methods: {
    fetchDataFromOnline() {
      post(APP_API, {
        params: {
          kw: this.query,
          f: "json",
          offset: 0,
          size: 20,
          v: "3.0",
          scene: "2",
        },
      })
        .then(({ app }) => {
          const dataApps = format(app)?.list || [];
          this.onlineApps = dataApps;
          this.hasResults = dataApps.length > 0;
          this.isLoading = false;
          this.injectAppsPkg = dataApps.map((item) => item?.pkg || "");
        })
        .catch((err) => {
          this.hasResults = false;
          this.isLoading = false;
          console.error(
            new Error(`zeus-views-onlineapps-fetchDataFromOnline:-${err}`)
          );
          oreport.reportError(
            new Error(`zeus-views-onlineapps-fetchDataFromOnline:-${err}`)
          );
        });
    },
    fetchDataFromLocal() {
      let storageOnlineKey = "";
      if (this.from === "complex") {
        storageOnlineKey = COMPLEX_ONLINE_APPS;
      } else if (this.from === "sugs") {
        storageOnlineKey = SUG_ONLINE_APPS;
      }
      // 根据id获取本地保存的app。
      const localstorageOnlineList = this.getOnlineAppsById(
        storageOnlineKey,
        this.id
      );
      if (localstorageOnlineList) {
        this.onlineApps = format(localstorageOnlineList).list;
        this.hasResults = this.onlineApps?.length > 0;
      }
      // 展示app的包名列表
      this.injectAppsPkg = this.onlineApps?.map((item) => item?.pkg || "");
      this.isLoading = false;
    },
    getOnlineAppsById(key, id) {
      if (!(key && id)) return "";
      const localList = JSON.parse(localStorage.getItem(key) || null) || {};
      const dataList = localList[id];
      return dataList;
    },
    getItemDesc(rate, installNum) {
      if (rate && installNum) {
        return `${rate}  |  ${installNum}`;
      } else if (!(rate && installNum)) {
        return "";
      } else {
        return rate || installNum;
      }
    },
    checkAppDownloadProgress(result) {
      /**
       * pkgName:包名
       * status:下载状态
       * percent:下载进度
       * totalLength:总长度
       * speed:下载速度
       * errorCode:错误码
       */
      const { pkgName } = result;
      // 更新app下载进度信息。
      if (
        pkgName &&
        !this.pauseReceivingDownloadProgressList.includes(pkgName)
      ) {
        const currentAppInfo = {
          [pkgName]: result,
        };
        this.downloadAppsInfo = Object.assign(
          {},
          this.downloadAppsInfo,
          currentAppInfo
        );
      }
    },
    // 1s内暂停接收某个app的下载进度。
    pauseReceivingDownloadProgressOfApp(pkg) {
      this.pauseReceivingDownloadProgressList.push(pkg);
      setTimeout(() => {
        this.pauseReceivingDownloadProgressList.shift();
      }, 1000);
    },
    changeShowRecommendAppPkg(pkg) {
      if (pkg) {
        this.showRecommendAppPkg = pkg;
      }
    },
    // 更新预约游戏状态：pkg：包名，newStatus：新的状态。
    gamesUpdateStatus(pkg, newStatus) {
      if (!pkg || !newStatus) return;
      this.gamesPKGNeedUpdateStatus = Object.assign(
        {},
        this.gamesPKGNeedUpdateStatus,
        {
          [pkg]: newStatus,
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
$namespace: medusa-sort-;
@include b(online-apps) {
  min-height: 100vh;
  margin: 0 10px;
  border-radius: 14px;
  background-color: #fff;
  @include e(net-work-error) {
    height: 100vh;
  }
  @include e(box) {
    box-sizing: border-box;
    min-height: 100vh;
    position: relative;
    padding-top: 10px;
    @include e(item) {
      padding-left: 14px;
      padding-right: 14px;
    }
  }
}
</style>
