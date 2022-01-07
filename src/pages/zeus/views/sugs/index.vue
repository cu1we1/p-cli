<template>
  <div
    class="zeus-sugs__sug-con"
    v-loading="isLoading || !data.q"
    loading-background="transparent"
    loading-text="正在加载..."
  >
    <div
      :data-log="$utils.inject(data.pageInfo)"
      data-exp="0"
      v-show="!!data.q && !isLoading"
    >
      <refresh
        v-if="refreshShowState"
        :clickAction="reload"
        :clickDismiss="refreshDismiss"
      />
      <view-more
        v-else-if="viewMoreShowState"
        :isSupCustomSource="isSupCustomSource"
        :query="data.q"
        :onSearch="requestSearch"
        :clickDismiss="viewMoreAction"
        :clickAction="viewMoreAction"
      />
      <search-direct
        :index="2"
        v-if="showSearchDirect"
        v-bind="data.searchDirect"
        :query="data.q"
      />
      <app-suggestion
        :index="3"
        :query="data.q"
        :sessionID="data.sessionID"
        :key="`app-suggestion-${data.sessionID}`"
        :localApps="localApps"
        :apps="data.localResult.apps || {}"
        :restore="data.localResult.restore || {}"
        :onlineApps="data.onlineResult.tabItem || []"
        :isOnlineResultsReady="isOnlineResultsReady"
        :isLocalResultsReady="isLocalAppsReady && isLocalRestoreReady"
        :hasOnlineApps="hasOnlineApps"
        :hasLocalApps="hasLocalApps"
        :localState="localState"
        :onlineState="onlineState"
      />
      <search-found-list
        v-if="isShowSearchFound && hasSearchFound"
        :index="4"
        :list="searchFound"
        :onSearch="requestSearch"
        :isSupCustomSource="isSupCustomSource"
      />
      <sug-list
        :index="5"
        :key="`sug-list-${data.sessionID}`"
        :sessionID="`${data.sessionID}`"
        :sugs="data.sugs"
        :history="data.history"
        :q="data.q"
        :onSearch="requestSearch"
        :hasNetwork="hasNetwork"
        :isSupCustomSource="isSupCustomSource"
        :engineName="engineName"
        :isHistoryReady="isHistoryReady"
        :isSugsReady="isOnlineResultsReady"
        :sugNum="+sugNum"
        :historyNum="+historyNum"
        :hasSearchFound="hasSearchFound"
      />
    </div>
  </div>
</template>

<script>
import {
  init,
  getSugSearchResults,
  requestSearch,
  jsonParse,
  trackSearch,
  browserInfo,
  historySwitchChange,
  keyboardVisibleChange,
  networkStatusChange,
  isNetworkAvailable,
  removeExportTag,
  registerAppDownloadProgress,
  getTagOfSearch,
  addVisibilityChangeCallBack,
  SUG_URL as SUG,
  saveHistory,
  FE_VERSION,
  clearLocalListByKey,
  COMPLEX_ONLINE_APPS,
  saveSugIdToLocalForClient,
  setDebugInfoToWindow,
  saveSugOnlineAppsToLocal,
  clearQueryMethods,
  updateSugOnlineAppState,
  getSugOnlineAppState,
  getBrowserInfo,
} from "../../../../lego/lib/index";
import sugList from "./components/sugList/index.vue";
import searchDirect from "./components/searchDirect/index.vue";
import appSuggestion from "./components/appSuggestion";
import viewMore from "./components/viewMore";
import refresh from "./components/refresh";
import searchFoundList from "./components/searchFound";
import format from "./format";

let session = "";
let newData = {};
let searchSession = 0;
let searchTime = [];
export default {
  data() {
    /**
     * q：用于输入词
     * from：搜索来源
     * source：搜索来源
     * sup_app_progress：是否支持端内同步下载进度。
     * custom_source：是否支持requestSearch传自定义source。
     * tip_time：viewMore延时出现时机。
     * history_num：展示历史记录条数（最多5，最少1，默认2）
     * history_switch：是否展示历史记录。
     * sugword_num：展示sug的条数。（最多10，最少1，默认5）
     */
    const {
      q,
      from,
      source,
      sup_app_progress,
      custom_source,
      tip_time,
      history_num = "2",
      sugword_num = "5",
      ...others
    } = this.$route.query;
    let historyNum = history_num,
      sugNum = sugword_num;

    historyNum < 1 && (historyNum = 1);
    historyNum > 5 && (historyNum = 5);

    sugNum < 1 && (sugNum = 1);
    sugNum > 10 && (sugNum = 10);

    return {
      data: {
        pageInfo: {
          module_id: "GlobalSearch",
          page_id: "SearchNewSugPage",
          search_scenes: source || from,
          search_id: Date.now(),
          fe_version: FE_VERSION,
          experiment_id: "",
          rankPileInfo: "",
          nlpPileInfo: "",
          ...others,
        },
        sessionID: "1",
        sugs: [],
        localResult: {},
        q,
        // 搜索直达
        searchDirect: {},
        onlineResult: {},
        history: [],
      },
      // 搜索发现数据
      searchFound: [],
      // 用于键盘收起上报埋点。
      searchCompleteTag: true,
      isLoading: true,
      consumeTime: new Date().getTime(),
      // 是否有结果。（本地，在线）
      hasResult: false,
      // 是否有网络
      hasNetwork: this.isNetworkAvailable() === "1",
      // 是否有本机app结果。
      hasLocalApps: false,
      // 是否有在线app结果。
      hasOnlineApps: false,
      // 本机app是否已经完成搜索。
      isLocalAppsReady: false,
      // 本机可恢复卸载应用是否已经完成搜索。
      isLocalRestoreReady: false,
      // 是否支持app下载进度。
      isSupAppDownloadProgress: sup_app_progress === "1",
      // 是否展示搜索发现
      isShowSearchFound: false,
      // 是否展示本地app卡。
      localState: true,
      // 是否展示搜索直达卡
      showSearchDirect: false,
      // 本次搜索是否返回了搜索发现的数据。
      hasSearchFound: false,
      // 正在下载的app信息。key为包名，value为下载进度信息。
      downloadAppsInfo: {},
      // 暂停接收下载进度的app集合。
      pauseReceivingDownloadProgressList: [],
      // 在线结果页是否已经返回。
      isOnlineResultsReady: false,
      isSupCustomSource: custom_source === "1",
      // 是否展示refresh卡
      refreshShowState: false,
      isRefreshSearch: false,
      /**
       * 一次搜索中viewMore卡状态不变，
       * 除非满足下面三个条件之一：
       * 1、点击提示上面的两个按钮
       * 2、进入搜索结果页
       * 3、回到首页
       */
      viewMoreStateTag: tip_time > 0,
      // 是否展示viewMore卡
      viewMoreShowState: false,
      // 是否需要重新加载搜索引擎信息。
      isNeedUpdateSearchEngineInfo: false,
      engineName: "",
      //  judgeViewMoreSeconds：延时多久出现viewMore卡。
      judgeViewMoreSeconds: tip_time,
      // historyNum：展示的历史数量
      historyNum,
      //  sugNum：展示的sug词条数
      sugNum,
      // 此用户是否展示在线app（默认不展示）
      onlineState: false,
      // 历史记录是否已经返回
      isHistoryReady: false,
      // 搜索来源
      source,
    };
  },
  components: {
    sugList,
    searchDirect,
    appSuggestion,
    refresh,
    viewMore,
    searchFoundList,
  },
  provide() {
    // 提供给子孙组件访问此组件实例。（代替props传值）
    return {
      medusa: this,
    };
  },
  computed: {
    localApps() {
      const appsList = (this.data.localResult.apps || {}).list || [],
        restoreList = (this.data.localResult.restore || {}).list || [];
      return [...restoreList, ...appsList].slice(0, 5);
    },
  },
  created() {
    getSugSearchResults(this.searchMethod, this.frontSearchMethod, {
      searchKeys: "sugs_apps_restore_sughistory",
      list: [
        {
          key: "sugs",
          url: `${SUG}?kw=KW&v=3.0&search_source=${this.source}`,
          timeout: 3000,
        },
      ],
      q: this.data.q,
    });
    this.initNonResponsiveData();
    this.updateSearchEngineInfo();
  },
  mounted() {
    init(this.initToMounted);
    // 注册客户端首页历史记录开关状态方法。
    historySwitchChange(({ searchRecordSwitch }) => {
      browserInfo.searchRecordSwitch = searchRecordSwitch;
    });
    // 注册监听键盘动作  1：收起  2：展开
    keyboardVisibleChange((state) => {
      if (state === 1 && this.searchCompleteTag && this.data.q) {
        // 键盘收起以后并且query词存在上报搜索结束。
        trackSearch(
          Object.assign(
            {
              scenes: "sug_info",
              search_status: "search_complete",
              consume_time: this.consumeTime,
              consume_time_detail: searchTime.join(","),
            },
            newData.pageInfo
          )
        );
        this.searchCompleteTag = false;
      }
    });
    //注册网络监听
    networkStatusChange((hasnet) => {
      // 从无网络变成有网络。
      if (!this.hasNetwork && hasnet) {
        // 页面重新loading
        this.isLoading = true;
        this.requestSearch(this.data.q, "netError_reload");
        this.hasNetwork = true;
      }
      // 从有网络变成无网络。
      if (this.hasNetwork && !hasnet) {
        this.hasNetwork = false;
      }
    });
    // 注册从客户端获取app下载进度的方法。
    if (this.isSupAppDownloadProgress) {
      registerAppDownloadProgress(this.checkAppDownloadProgress);
    }
    if (this.judgeViewMoreSeconds > 0) {
      // 给document绑定touchstart事件，监听用户交互
      this.addMonitorToGlobal();
      getTagOfSearch(this.getMedusaSearchState);
      // 监听网页搜索引擎相关信息改变。页面每次从不可见到可见都调用获取一次。
      addVisibilityChangeCallBack((data) => {
        if (+data === 1) {
          this.startJudgeViewMoreState();
        }
      });
    }
  },
  beforeDestroy() {
    if (this.judgeViewMoreSeconds > 0) {
      this.removeMonitorFromGlobal();
    }
  },
  methods: {
    clearLocalListByKey,
    isNetworkAvailable,
    requestSearch,
    format,
    removeExportTag,
    searchMethod({ sessionID, time, items, source, data, needToRefresh }) {
      setDebugInfoToWindow({
        sessionID,
        time,
        items,
        source,
        data,
        needToRefresh,
      });
      if (session !== sessionID) {
        return;
      }
      if (!source) {
        // 客户端尚未完成应用入库，用户即开始搜索，展示刷新卡，可刷新结果。
        if (needToRefresh === "1") {
          this.refreshShowState = true;
        }

        if (this.isLoading) {
          this.isLoading = false;
          this.updateData(sessionID);
        }
        if (!this.isLocalAppsReady) {
          this.isLocalAppsReady = true;
        }
        if (!this.isLocalRestoreReady) {
          this.isLocalRestoreReady = true;
        }
        if (!this.isHistoryReady) {
          this.isHistoryReady = true;
        }
        this.judgeResult();
        if (this.data.q) {
          this.consumeTime = time;
          trackSearch(
            Object.assign(
              {
                scenes: "sug_info",
                search_status: "search_result",
                consume_time: time,
                consume_time_detail: searchTime.join(","),
                // 是否有结果
                result: this.hasResult ? 1 : 0,
              },
              this.data.pageInfo
            )
          );
        }
        // 如果本次搜索无结果，并且上次搜索也无结果，则在500ms后展示搜索发现。
        if (!this.hasResult) {
          if (!this.isShowSearchFound) {
            this.searchTimer = setTimeout(() => {
              this.isShowSearchFound = true;
            }, 300);
          }
        } else {
          // 如果有结果，不展示搜索发现，并且下次展示刷新。
          this.isShowSearchFound = false;
          this.hasSearchFound = false;
        }
        this.startJudgeViewMoreState();
        this.saveAppsToLocal();
        return;
      }

      const { key, icon } = source;
      searchTime.push(`${key}_${time}_${time}`);
      let nData = key === "sugs" || key === "sughistory" ? data : items;
      if (key === "restore") {
        this.isLocalRestoreReady = true;
      } else if (key === "restore") {
        this.isLocalAppsReady = true;
      } else if (key === "sugs") {
        this.isOnlineResultsReady = true;
      } else if (key === "sughistory") {
        !this.isHistoryReady && (this.isHistoryReady = true);
      }
      if (!nData || (Array.isArray(nData) && !nData.length)) {
        return;
      }

      if (key === "sugs") {
        nData = typeof data === "object" ? data : jsonParse(data);
        const {
          bucketIds,
          rankPileInfo,
          nlpPileInfo,
          sugs,
          cards,
          sugId,
          // 是否屏蔽本地app卡，0:展示，1:屏蔽
          localState = 0,
          // 此用户是否命中在线App放量，0：未命中，1：命中
          onlineAppState,
        } = nData;
        if (onlineAppState === undefined) {
          // 如果服务端没有下发，那么前端从缓存中取。
          this.onlineState = getSugOnlineAppState() === 1;
        } else {
          // 如果服务端有下发，那么前端需要存入缓存，用于无网络或者服务端无下发的情况。
          this.onlineState = onlineAppState === 1;
          this.$nextTick(() => {
            updateSugOnlineAppState(onlineAppState);
          });
        }
        this.localState = localState === 0;
        newData.pageInfo.experiment_id = bucketIds;
        newData.pageInfo.rankPileInfo = rankPileInfo || "";
        newData.pageInfo.nlpPileInfo = nlpPileInfo || "";
        newData.sugs = Array.isArray(sugs) ? sugs.slice(0, this.sugNum) : [];
        cards?.forEach((item) => {
          const cardID = item?.dataInfo?.cardId;
          if (cardID) {
            switch (cardID) {
              // 搜索直达卡
              case "170002":
                newData.searchDirect = item;
                break;
              // 搜索发现卡
              case "170001":
                newData.searchFound = item;
                break;
              case "100101":
                newData.onlineApp = item;
                break;
            }
          }
        });
        this.saveSugIdToLocalForClient(sugId);
      } else if (key === "apps") {
        newData[key] = {
          key,
          list: nData,
          title: "本机应用",
          icon,
        };
        if (!this.hasLocalApps && nData.length) {
          this.hasLocalApps = true;
        }
      } else if (key === "restore") {
        newData[key] = {
          key,
          list: nData,
          title: "可恢复卸载应用",
          icon,
        };
        if (!this.hasLocalApps && nData.length) {
          this.hasLocalApps = true;
        }
      } else if (key === "sughistory") {
        nData = typeof data === "object" ? data : jsonParse(data);
        newData.history = nData;
      }
      this.updateData(sessionID);
    },
    frontSearchMethod({ query, sessionID, source }) {
      // 如果1s内发起新的搜索，则不展示搜索发现。
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      session = sessionID;
      searchTime = [];
      // 搜索间隔大于3s，生成新的searchSession。
      if (sessionID - searchSession > 3000) {
        searchSession = sessionID;
      }
      const nq = (query && query.trim()) || "";
      this.refreshShowState = false;
      this.searchCompleteTag = true;
      this.hasResult = false;
      this.hasLocalApps = false;
      this.isLocalAppsReady = false;
      this.hasOnlineApps = false;
      newData = {
        q: nq,
        pageInfo: Object.assign({}, this.data.pageInfo, {
          search_scenes: this.isRefreshSearch ? "update_tips" : source,
          search_id: sessionID,
          search_session: searchSession,
          keyword: nq,
          experiment_id: "",
          rankPileInfo: "",
          nlpPileInfo: "",
        }),
      };
      this.isRefreshSearch = false;
      if (this.isNeedUpdateSearchEngineInfo) {
        this.updateSearchEngineInfo();
        this.isNeedUpdateSearchEngineInfo = false;
      }
      if (!nq) {
        // 当query为空的时候，remove当前曝光埋点。
        this.removeExportTag();
        // 当query为空（回到首页）加载loading
        this.updateData(sessionID);
        // 当回到首页时，清空结果页综合tab保存的在线app。
        this.clearLocalListByKey(COMPLEX_ONLINE_APPS);
        // 当回到首页时，修改默认tab为综合。
        clearQueryMethods();
        // 回到首页，下次搜索需要更新搜索引擎相关信息。
        this.isNeedUpdateSearchEngineInfo = true;
        /**
         * 回到全搜首页，代表一次完整的搜索完成。需要做：
         * 1、更新viewMore卡的状态。
         * 2、如果viewMore卡展示，那么需要刷新状态。
         */
        this.judgeViewMoreSeconds > 0 &&
          this.viewMoreStateTag === false &&
          (this.viewMoreStateTag = true);
        this.viewMoreShowState && (this.viewMoreShowState = false);
      }
      if (nq) {
        trackSearch(
          Object.assign(
            {
              scenes: "sug_info",
              search_status: "search_start",
            },
            newData.pageInfo
          )
        );
      }
    },
    updateData(sessionID) {
      let {
        q,
        sugs,
        localResult,
        searchFound,
        searchDirect,
        onlineResult,
        history,
      } = this.format(newData);
      if (!this.hasSearchFound) {
        this.hasSearchFound = searchFound.length > 0;
        this.searchFound = searchFound;
      }
      this.showSearchDirect = Object.keys(searchDirect)?.length > 0;
      this.data = {
        q,
        sugs,
        localResult,
        sessionID,
        searchDirect,
        pageInfo: newData.pageInfo,
        onlineResult,
        history,
      };
      if (!this.hasOnlineApps) {
        this.hasOnlineApps = (this.data.onlineResult.tabItem || []).length > 0;
      }
      if (this.isLoading) {
        this.isLoading = false;
      }
      // 兼容10.0/10.1/10.2版本registerNotifyNetState方法在sug页没有回调场景。
      this.hasNetwork = this.isNetworkAvailable() === "1";
    },
    // 判断是否有结果（本地app，在线App，sug词，搜索直达）
    judgeResult() {
      if (
        this.hasLocalApps ||
        this.data.sugs.length > 0 ||
        this.showSearchDirect ||
        this.data.onlineResult.tabItem?.length > 0 ||
        this.data.history.length > 0
      ) {
        this.hasResult = true;
      }
    },
    saveSugIdToLocalForClient,
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
    // 保存app结果到localstorage。
    saveAppsToLocal() {
      let onlineList = newData.onlineApp || {};
      saveSugOnlineAppsToLocal(this.data.sessionID, onlineList);
    },
    initNonResponsiveData() {
      this.viewMoreTimer = null;
    },
    initToMounted() {
      saveHistory(this.data.q);
    },
    reload() {
      this.requestSearch(this.data.q, "sugs");
      this.isRefreshSearch = true;
    },
    refreshDismiss() {
      this.refreshShowState = false;
    },
    viewMoreAction() {
      /**
       * 点击viewMore按钮以后，viewMore卡的状态在本次完整的搜索完成前不做更新。
       * viewMoreStateTag：标识一次完整的搜索（本次完整的搜索结束时会更新为!viewMoreStateTag）
       * viewMoreShowState：viewMore卡展示状态。
       */
      this.viewMoreStateTag = false;
      this.viewMoreShowState = false;
    },
    startJudgeViewMoreState() {
      /**
       * 1、viewMore卡已经在展示
       * 2、一次搜索完整的搜索还没完成
       * 3、展示了refresh卡
       * 4、策略平台未配置延时
       * 满足任意一个，则不重新更新viewMore卡的状态。
       */
      if (
        this.viewMoreShowState ||
        !this.viewMoreStateTag ||
        this.refreshShowState ||
        !this.judgeViewMoreSeconds
      )
        return;
      if (this.viewMoreTimer) {
        clearTimeout(this.viewMoreTimer);
      }
      this.viewMoreTimer = setTimeout(() => {
        if (!this.viewMoreStateTag) return;
        this.viewMoreShowState = true;
        this.viewMoreStateTag = false;
      }, this.judgeViewMoreSeconds);
    },
    clickFunc() {
      // 超过x秒没有进一步行为（点击、输入），则出现viewMore卡
      /**
       * 1、viewMore卡已经在展示
       * 2、一次搜索完整的搜索还没完成
       * 3、展示了refresh卡
       * 4、策略平台未配置延时
       * 满足任意一个，则不重新更新viewMore卡的状态。
       */
      if (
        this.viewMoreShowState ||
        !this.viewMoreStateTag ||
        this.refreshShowState ||
        !this.judgeViewMoreSeconds
      )
        return;
      if (this.viewMoreTimer) {
        clearTimeout(this.viewMoreTimer);
      }
      this.viewMoreTimer = setTimeout(() => {
        this.viewMoreShowState = true;
        this.viewMoreStateTag = false;
      }, this.judgeViewMoreSeconds);
    },
    addMonitorToGlobal() {
      document.addEventListener("click", this.clickFunc);
    },
    removeMonitorFromGlobal() {
      document.removeEventListener("click", this.clickFunc);
    },
    getMedusaSearchState(state) {
      if (state === 1) {
        /**
         * 结果页发起搜索。（跳转到结果页），代表一次完整的搜索完成。需要做：
         * 1、更新viewMore卡的状态。
         */
        this.viewMoreStateTag = !this.viewMoreStateTag;
        this.viewMoreShowState && (this.viewMoreShowState = false);
      }
    },
    updateSearchEngineInfo() {
      const { engineName } = getBrowserInfo();
      this.engineName = engineName;
    },
  },
};
</script>
<style lang="scss" scoped>
$namespace: "zeus-"; // 可配置的命名空间
@include b(sugs) {
  @include e(sug-con) {
    min-height: 50vh;
    padding: 12px 0 2px 0;
    // background-color: #f2f2f2;
  }
}
</style>
