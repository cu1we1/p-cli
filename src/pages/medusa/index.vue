<template>
  <div class="medusa-views">
    <!-- 用于在开发debug展示搜索引擎渠道号 -->
    <div v-if="showDevElements" class="medusa-views__debug-ele">
      {{ pageInfo.engine_channel }}
    </div>
    <views
      :query="query"
      :isInitHasNetwork="isInitHasNetwork"
      :isClientSupportWebResults="isClientSupportWebResults"
      :hasLocalContent="hasLocalContent"
      :isShowRefresh="isShowRefresh"
      :isRelatedSearchReady="isRelatedSearchReady"
      :relatedSearchList="relatedSearchList"
    />
  </div>
</template>

<script>
import Views from "./Views";
import {
  performanceTrack,
  trackSearch,
  browserInfo,
  jsonParse,
  parse,
  init,
  historySwitchChange,
  getSearchResults,
  isNetworkAvailable,
  networkStatusChange,
  requestSearch,
  addVisibilityChangeCallBack,
  toTrackData,
  localStorage,
  registerAppDownloadProgress,
  readyToJSBridge,
  post,
  oreport,
  MEDUSA_API as API,
  backTop,
  saveHistory,
  FE_VERSION,
  clearLocalListByKey,
  DEFAULT_TAB_INDEX,
  performanceReport,
  SHOW_DEV_ELEMENTS,
  setDebugInfoToWindow,
  tabMapping,
  tabMapping_web,
  clearQueryMethods,
  RELATED_API,
  saveNewSessionIDToLocal,
  clearNewSessionIDFromLocal,
  getNewSessionIDFromLocal,
} from "@lego";
import { defaultOrder, formatMedusa } from "./format";

const isNetwork = isNetworkAvailable();
const entryData =
  isNetwork === "1"
    ? [
        { tname: "netWorkError" },
        { tname: "operation" },
        { tname: "activity" },
        { tname: "100299" },
      ]
    : [{ tname: "netWorkError" }, { tname: "100299" }];
/**
 * isShowWebResults: 是否展示网页搜索结果。
 * webview: webview类型。0：系统，1：内核。
 * engineName: 搜索引擎名字。
 * engineUrl: 默认搜索引擎src。
 * complexUrl: 综合src
 * webUrl: 网页tab
 */
const { webview, engineName, engineUrl } = browserInfo;
let { complexUrl, webUrl } = browserInfo;
if (!complexUrl) {
  complexUrl = engineUrl;
}
if (!webUrl) {
  webUrl = engineUrl;
}
const isClientSupportWebResults = webview === "1" && engineName && engineUrl;
const mappingForTabIndex = isClientSupportWebResults
  ? tabMapping_web
  : tabMapping;

export default {
  name: "result",
  data() {
    /**
     * keyword:用户搜索词
     * source:本次搜索来源。
     * tab_default:默认展示的tab和是否定位到网页
     */
    const { keyword, source, tab_default } = parse(window.location.search);
    const query = String(keyword || "").trim();
    // 兼容不支持网页，就不展示网页tab。

    // 获取默认tab。优先级：本地保存 > query干预 > 客户端url传参
    let defaultTabIndex =
      Number(localStorage.getItem(DEFAULT_TAB_INDEX) || "") ||
      mappingForTabIndex[tab_default] ||
      3;

    const positionToWebPage = tab_default === "web_results";

    // 如果是点击sug底部查看更多，需要跳转到网页tab
    if (source === "search_sugs_more") {
      defaultTabIndex = 4;
      // 设置默认tab为综合。
      clearQueryMethods();
    }
    // 如果搜索来源是摇一摇，那么需要使用客户端的tab_default
    if (source === "search_shark" && tab_default) {
      defaultTabIndex = mappingForTabIndex[tab_default];
    }

    return {
      /**
       * search_scenes: 搜索来源字段，客户端source。
       * fe_version:  前端每次发布需要更改这里的版本号
       * anchor_point: 锚点卡片ID
       * webcard_status: 网页卡的状态：0展示，1折叠，2屏蔽不展示
       * web_guide: 标识网页是从哪里跳转过来的。（从本机tab或者应用tab）
       */
      pageInfo: {
        search_scenes: source,
        module_id: "GlobalSearch",
        search_id: Date.now(),
        keyword: query,
        fe_version: FE_VERSION,
        web_guide: "",
        anchor_point: positionToWebPage ? "100599" : "",
        webcard_status: "",
        experiment_id: "",
        rankPileInfo: "",
        nlpPileInfo: "",
        page_id: "",
        engine_channel: "",
      },
      query,
      formatQuery: encodeURIComponent(query),
      // 是否有网络。
      hasNetwork: isNetwork === "1",
      // 搜索结果在线卡数据。
      entryData,
      // 300ms内返回的本地卡数据。
      searchLocalsData: [],
      // 本地卡片默认排序规则。
      order: defaultOrder,
      // 是否排除在线卡的展示。
      expectOnline: isNetwork !== "1",
      // 本次搜索是否有结果。
      hasResult: false,
      // 是否需要loading。
      isLoading: true,
      // 是否排除网页结果的展示。
      expectWebResults: isNetwork !== "1",
      // 开始浏览页面的时间点。
      scanPageStart: new Date().getTime(),
      // 搜索是否完成
      isSearchReady: false,
      // 是否有本地结果
      hasLocalContent: false,
      // 默认定位的tab
      defaultTabIndex,
      tabInitIndex: defaultTabIndex,
      // 是否需要初始化定位到网页卡。
      positionToWebPage,
      // 是否展示除网页以外的卡（如果需要一开始定位到网页卡，则不展示，反之展示）。
      isShowEntry: !(positionToWebPage && isNetwork === "1"),
      // 正在下载的app信息。key为包名，value为下载进度信息。
      downloadAppsInfo: {},
      // 在线app
      onlineAppsInfo: null,
      // 应用tab需要补充的在线推荐App
      onlineAppsRecAdd: null,
      // 在线app是否已经返回结果。
      isOnlineAppReady: false,
      // 网页结果展示状态：0展示，1折叠，2屏蔽不展示，默认不展示。
      webResultsShowState: "2",
      // 网页结果折叠状态。false不折叠，true折叠
      isFoldWebResults: true,
      // 在线结果是否已经返回
      isOnlineReady: false,
      // 搜索来源
      source: source,
      // 非网页卡展示状态，0为展示，1为折叠，2为还未收到服务端下发状态（不展示）
      unwebResultsShowState: 2,
      // 非网页结果折叠状态。false不折叠，true折叠
      isFoldUnwebResults: isNetwork === "1",
      // 在线结果是否超时（400ms），如果超时，非网页结果不折叠。
      isTimeOut: false,
      // 需要更新状态的游戏。
      gamesPKGNeedUpdateStatus: {},
      // 综合tab和网页tab相关搜索滑动距离(scrollLeft).
      relatedSearchScrollLeft: 0,
      relatedSearchScrollOriginTab: "",
      // 搜索发现数据list
      relatedSearchList: [],
      engine_channel: "",
      // 是否展示刷新结果卡
      isShowRefresh: false,
      // 是否全局隐藏refresh卡。
      globalHideRefreshShowState: true,
      // 搜索发现是否请求完成。
      isRelatedSearchReady: false,
    };
  },
  computed: {
    // 是否展示网页结果。(使用局部变量)
    showWebResult({
      webResultsShowState,
      isClientSupportWebResults,
      isLoading,
      isFoldWebResults,
      expectWebResults,
      isOnlineReady,
    }) {
      if (webResultsShowState === "0") {
        return isClientSupportWebResults && !expectWebResults && !isLoading;
      } else if (webResultsShowState === "1") {
        return (
          isClientSupportWebResults &&
          !expectWebResults &&
          !isLoading &&
          !isFoldWebResults &&
          isOnlineReady
        );
      }
      return false;
    },
    // 是否展示网页折叠卡。
    showFoldWebpage() {
      return (
        this.isInitHasNetwork &&
        this.webResultsShowState === "1" &&
        this.isOnlineReady &&
        this.isFoldWebResults
      );
    },
    // 是否展示非网页折叠卡。（本地，在线）
    showFoldUnwebCards() {
      return (
        this.isShowEntry &&
        this.hasResult &&
        this.isOnlineReady &&
        this.unwebResultsShowState === 1 &&
        this.isFoldUnwebResults
      );
    },
  },
  components: {
    Views,
  },
  provide() {
    // 提供给子孙组件访问此组件实例。（代替props传值）
    return {
      reload: this.reload,
      backTop: this.backTop,
      onSearch: this.search,
      medusa: this,
      setRelatedSearchScrollLeft: this.setRelatedSearchScrollLeft,
    };
  },
  created: function () {
    this.initNonResponsiveData();
    // 注册从客户端获取结果的方法。
    this.searchFormQuery(this.query);
  },
  mounted() {
    clearNewSessionIDFromLocal();
    this.getRelatedSearch(this.query);
    // 注册客户端历史记录开关状态方法。
    historySwitchChange(({ searchRecordSwitch }) => {
      browserInfo.searchRecordSwitch = searchRecordSwitch;
    });
    // 注册从客户端获取app下载进度的方法。
    if (this.isSupAppDownloadProgress) {
      registerAppDownloadProgress(this.checkAppDownloadProgress);
    }
    // 上报搜索开始埋点。
    trackSearch(
      Object.assign(
        {
          scenes: "all_info",
          search_status: "search_start",
        },
        this.pageInfo
      )
    );
    //注册网络监听
    networkStatusChange((hasnet) => {
      // 从无网络变成有网络。
      if (!this.hasNetwork && hasnet) {
        // 页面重新loading
        this.isLoading = true;
        // 页面属性。
        this.reload();
        this.hasNetwork = true;
        this.expectOnline = false;
        this.expectWebResults = false;
      }
      // 从有网络变成无网络。
      if (this.hasNetwork && !hasnet) {
        this.hasNetwork = false;
      }
    });
    // 监听网页搜索引擎相关信息改变。页面每次从不可见到可见都调用获取一次。
    addVisibilityChangeCallBack((data) => {
      if (+data === 1) {
        this.scanPageStart = new Date().getTime();
      } else {
        // 页面从可见到不可见上报page_out和页面浏览时长。
        this.reportPageOut();
      }
    });
    performanceTrack.track("firstContentPaint");
    // 项目基础方法，埋点，跳转等注册。
    init(() => {
      this.saveHistory(this.query);
    }, false);
    const source = this.source;
    /*
     *** 当发起搜索的来源为以下任意一种时，保存历史记录。
     *** search_btn: 点击搜索框搜索按钮。
     *** history_word: 点击首页搜索历史。
     *** search_keyboard: 点击键盘搜索按钮。
     *** related_search: 相关搜索。
     *** search_keyboard: 点击键盘搜索按钮。
     */
    if (
      source === "search_btn" ||
      source === "history_word" ||
      source === "voice_search" ||
      source === "related_search" ||
      source === "search_keyboard"
    ) {
      this.saveHistory(this.query);
    }
    // 页面onload触发以后上报性能数据埋点
    window.onload = function () {
      if (this.isSearchReady && !this.isReportPerformance) {
        performanceReport();
      }
    };
  },
  methods: {
    touchStartFunc() {
      // 注册touchstart方法，触发的时候展示除网页卡以外的其他卡。
      if (!this.isShowEntry && this.positionToWebPage) {
        const complexContentDom =
          document.getElementsByClassName("medusa-complex")[0];
        if (!complexContentDom) return;
        // 给一个1px的滚动距离是防止touchstart触发的时候，滚动条跳动。
        complexContentDom.scrollTo(0, 1);
        this.isShowEntry = true;
      }
    },
    // page_out上报方法
    reportPageOut() {
      toTrackData(
        1001,
        Object.assign(
          {
            exposure_type: "page_out",
            exposure_time: new Date().getTime() - this.scanPageStart,
          },
          this.pageInfo
        )
      );
    },
    //搜索结果重新加载（重新发起搜索）
    reload() {
      saveNewSessionIDToLocal(this.query);
      location.reload();
    },
    //获取客户端返回结果以后需要进行的操作
    afterGetResults() {
      // 每次更新搜索结果时，判断是否展示更多本地结果卡。
      if (
        this.searchLocalsData.length > 0 &&
        !this.hasAddMoreLocalContentCard &&
        // 是否展示更多本地内容卡(如果本地卡数量大于2，则展示更多本地内容卡)
        this.searchLocalsData.length > this.localsNum
      ) {
        const localStepIndex = this.entryData.findIndex(
          (item) => item.tname === "100299"
        );
        this.entryData.splice(localStepIndex + 1, 0, {
          tname: "moreLocalContent",
        });
        this.hasAddMoreLocalContentCard = true;
      }
      // 判断是否有本地结果。
      if (!this.hasLocalContent && this.searchLocalsData.length > 0) {
        this.hasLocalContent = true;
      }
    },
    //保存历史搜索记录
    saveHistory,
    /**
     * sessionID: 本次搜索所对应的sessionID，每次搜索sessionID唯一。也是客户端发起搜索的时间戳。
     * time: 本条结果搜索客户端耗时。
     * items: 搜索结果列表。
     * source: 本条结果相关信息对象{ key: '' }
     * data: 服务端的数据json字符串。
     * isRefresh: 本条结果是否来自缓存。
     * from: 来源。
     * finishSearchTime：客户端回调本条结果的时间戳。
     */
    registerSearchMethodScb({
      sessionID,
      time,
      items,
      source,
      data,
      isRefresh = false,
      from,
      finishSearchTime,
      needToRefresh,
    }) {
      setDebugInfoToWindow({
        sessionID,
        time,
        items,
        source,
        data,
        isRefresh,
        from,
        finishSearchTime,
        needToRefresh,
      });
      // 记录第一次收到结果的时间点。
      if (!performanceTrack.trackData.getFirstResutlData) {
        performanceTrack.track("getFirstResutlData");
      }
      if (finishSearchTime) {
        performanceTrack.track(["nativeToFrontend"], () => {
          return new Date().getTime() - +finishSearchTime;
        });
        performanceTrack.report(["nativeToFrontend"]);
      }
      if (this.sessionIDData !== sessionID) {
        return;
      }
      // source为空标识本次搜索结束。
      if (!source) {
        // 客户端尚未完成应用入库，用户即开始搜索，展示刷新卡，可刷新结果。
        if (needToRefresh === "1") {
          this.isShowRefresh = true;
          this.entryData.splice(0, 0, {
            tname: "update_tips",
          });
        }
        // 解决无任何结果返回时，一直loading的问题
        if (this.isLoading) {
          this.isLoading = false;
        }
        if (!this.isOnlineAppReady) {
          this.isOnlineAppReady = true;
        }
        if (!this.isOnlineReady) {
          this.isOnlineReady = true;
        }
        // 搜索完成时间点
        this.isSearchReady = true;
        // 如果网页结果屏蔽且没有其他结果，需要展示无结果卡。
        if (this.webResultsShowState === "2" && !this.hasResult) {
          this.entryData.push({ tname: "noResults" });
        }
        // 埋点相关，暂时不处理
        const inViewLocals = [];
        this.order.forEach((element) => {
          this.searchLocalsData.find((item) => item.key === element)
            ? inViewLocals.push(element)
            : "";
        });
        // 上报搜索完成埋点
        trackSearch(
          Object.assign(
            {
              scenes: "all_info",
              result: this.hasResult ? 1 : 0,
              search_status: "search_result",
              consume_time: time,
              consume_time_detail: this.searchTime.join(","),
              result_list: this.entryData
                .map((item) => {
                  return item && item.tname;
                })
                .toString()
                .replace(
                  "100299,",
                  inViewLocals.length ? `${inViewLocals.toString()},` : ""
                ),
            },
            this.pageInfo
          )
        );
        // 搜索完成如果还没上报性能埋点，则上报。
        if (!this.isReportPerformance) {
          performanceReport();
          this.isReportPerformance = true;
        }
        return;
      }

      let nData = items;

      const { key, icon, label: title } = source;
      if (key === "online") {
        nData = typeof data === "object" ? data : jsonParse(data);
      }
      this.searchTime.push(`${key}_${time}_${time}`);
      if (!nData || (Array.isArray(nData) && !nData.length)) {
        return;
      }
      // 返回在线结果卡
      if (key === "online") {
        const [
          nHits,
          order,
          experiment_id,
          rankPileInfo,
          nlpPileInfo,
          activity,
          operationInfo,
          hasOnlineResults,
          onlineAppsInfo,
          webResultsShowState,
          unwebResultsShowState,
          onlineAppsRecAdd,
        ] = formatMedusa(nData);
        // 判断是否有在线卡
        if (!this.hasResult && hasOnlineResults) {
          this.hasResult = hasOnlineResults;
        }
        this.onlineAppsInfo = onlineAppsInfo;
        this.onlineAppsRecAdd = onlineAppsRecAdd;
        this.isOnlineAppReady = true;
        this.isOnlineReady = true;
        // 如果服务端下发的网页状态为折叠或者屏蔽
        if (webResultsShowState !== "0") {
          // 非网页卡正常展示。
          this.unwebResultsShowState = 0;
          // 取消锚点到网页部分。
          if (!this.isShowEntry && this.positionToWebPage) {
            this.positionToWebPage = false;
            this.isShowEntry = true;
          }
        } else if (!this.isTimeOut) {
          this.unwebResultsShowState = unwebResultsShowState;
        }
        this.webResultsShowState = webResultsShowState;
        this.pageInfo.webcard_status = webResultsShowState;
        // 算法埋点字段。
        this.pageInfo.experiment_id = experiment_id;
        // 算法埋点字段。
        this.pageInfo.rankPileInfo = rankPileInfo;
        // 算法埋点字段。
        this.pageInfo.nlpPileInfo = nlpPileInfo;
        let hits = JSON.parse(JSON.stringify(this.entryData));
        if (this.expectOnline) {
          hits = [{ tname: "netWorkError" }, { tname: "100299" }];
        } else if (!hits.length) {
          hits = [
            { tname: "netWorkError" },
            { tname: "operation" },
            { tname: "activity" },
            { tname: "100299" },
            ...nHits,
          ];
        } else {
          // 如果已经有本地卡，则将在线卡排在后面。
          hits = hits.concat(nHits);
        }
        // 强制将运营活动排在首位
        if (!this.expectOnline && activity && activity.payload) {
          hits = hits.filter((item) => {
            if (item.tname === "activity") {
              item.tname = "100401";
              item.payload = activity.payload;
            }
            return true;
          });
        }
        // 强制将运营模板卡排在首位。
        if (
          !this.expectOnline &&
          operationInfo &&
          operationInfo.operation &&
          operationInfo.operationOrder === "0"
        ) {
          hits = hits.filter((item) => {
            if (item.tname === "operation") {
              item.tname = "100403";
              item.payload = operationInfo.operation.payload;
            }
            return true;
          });
        }
        if (this.isLoading) {
          this.order = order;
        }
        this.entryData = hits;
      } else if (key === "apps") {
        if (!this.hasResult) {
          this.hasResult = true;
        }
        const appsInfo = this.searchLocalsData.find(
          ({ key: k }) => k === "apps"
        );
        appsInfo
          ? (appsInfo.list = appsInfo.list.concat(nData))
          : this.searchLocalsData.push({
              key: "apps",
              rKey: "restore",
              list: nData,
              rList: [],
              title: "本机应用",
              icon: icon,
              rIcon: "",
            });
      } else if (key === "restore") {
        if (!this.hasResult) {
          this.hasResult = true;
        }
        const appsInfo = this.searchLocalsData.find(
          ({ key: k }) => k === "apps"
        );
        appsInfo
          ? (appsInfo.rList = appsInfo.rList.concat(nData))
          : this.searchLocalsData.push({
              key: "apps",
              rKey: "restore",
              list: [],
              rList: nData,
              title: "本机应用",
              icon: "",
              rIcon: icon,
            });
      } else {
        if (!this.hasResult) {
          this.hasResult = true;
        }
        const settingsInfo =
          key === "settings"
            ? this.searchLocalsData.find(({ key: k }) => k === "settings")
            : null;
        if (settingsInfo && from !== "db" && isRefresh) {
          settingsInfo.list = nData;
        }

        if (!settingsInfo) {
          this.searchLocalsData.push({
            key,
            icon,
            title,
            list: nData,
          });
        }
      }
      if (this.isLoading) {
        this.isLoading = false;
      }
      // 减少性能消耗。
      requestAnimationFrame(() => this.afterGetResults());
    },
    //发起搜索
    searchFormQuery: function (q) {
      getSearchResults(this.registerSearchMethodScb, {
        searchKeys:
          "online_apps_settings_shortcuts_files_albumsearch_calendar_contacts_note_mms_restore",
        list: [
          {
            key: "online",
            url: `${API}?keyword=KW&v=3.0&f=json&ms_parameter=${
              this.ms_parameter || ""
            }&search_source=${this.source}`,
            timeout: 6000,
          },
        ],
        q,
        searchNums: 9,
      });
      performanceTrack.track("registerCallBack");
      // 前端注册成功以后告知客户端。
      readyToJSBridge(this.sessionIDData);
      // 防止若网情况下，本地结果较慢的情况。
      setTimeout(() => {
        this.isTimeOut = true;
        if (!this.isOnlineReady) {
          this.unwebResultsShowState = 0;
          this.isOnlineReady = true;
        }
      }, 400);
    },
    //搜索方法（供品类调用）
    search: function (q, from) {
      const query = q ? q.trim() : "";
      requestSearch(query, from);
    },
    backTop,
    clearLocalListByKey,
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
    // 初始化非响应式实例变量。减少初始化性能成本。
    initNonResponsiveData() {
      /**
       * ms_parameter: 用于调卡片排序的字段。
       * sup_app_progress: 是否支持应用下载进度。
       * sessionID: 搜索session。
       * custom_source: 是否支持自定义source发起搜索。
       */
      const { sup_app_progress, sessionID, custom_source } = parse(
        window.location.search
      );
      const complexEngineChannel = this.getEngineChannelNum(complexUrl);
      const webEngineChannel = this.getEngineChannelNum(webUrl);
      const engineChannel =
        this.defaultTabIndex === 3 ? complexEngineChannel : webEngineChannel;
      const localSessionID = getNewSessionIDFromLocal();
      // 刷新发起的搜索
      if (localSessionID) {
        this.source = "update_tips";
        this.pageInfo.search_scenes = "update_tips";
      }
      // 初始化是否有网络。
      this.isInitHasNetwork = isNetwork === "1";
      // 综合tab下默认最多展示本地卡数量
      this.localsNum = 2;
      // 是否支持app下载进度。
      this.isSupAppDownloadProgress = sup_app_progress === "1";
      // 暂停接收下载进度的app集合。
      this.pauseReceivingDownloadProgressList = [];
      // 埋点相关字段，用于统计搜索耗时
      this.searchTime = [];
      // 搜索的sessionID，每次搜索都会不同。有本地保存的sessionID，说明是刷新触发的重新搜索。
      this.sessionIDData = localSessionID || sessionID;
      // 是否已经添加查看更多本地内容卡。
      this.hasAddMoreLocalContentCard = false;
      // 是否上报了性能埋点
      this.isReportPerformance = false;
      // 客户端是否支持网页搜索结果，综合判断。
      this.isClientSupportWebResults = isClientSupportWebResults;
      this.engineName = engineName;
      this.complexUrl = complexUrl;
      this.webUrl = webUrl;
      this.pageInfo.engine_channel = engineChannel;
      // 是否展示开发debug用元素（上线最后一次打包需要关闭）
      this.showDevElements = SHOW_DEV_ELEMENTS;
      this.isSupCustomSource = custom_source === "1";
      this.complexEngineChannel = complexEngineChannel;
      this.webEngineChannel = webEngineChannel;
    },
    // 调用以后展开折叠的网页结果。
    showWebPage() {
      if (this.isFoldWebResults) {
        this.isFoldWebResults = false;
      }
    },
    // 调用以后展开折叠的非网页卡。
    showUnwebCards() {
      if (this.isFoldUnwebResults) {
        this.isFoldUnwebResults = false;
      }
    },
    // 获取搜索引擎的渠道号。
    getEngineChannelNum(engineUrl) {
      if (!engineUrl) return "";
      const parameters = parse(engineUrl);
      return parameters?.traffic_source || parameters?.from || "";
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
    // 修改相关搜索滑动距离(scrollLeft)
    setRelatedSearchScrollLeft({ scrollLeft, originTab }) {
      this.relatedSearchScrollLeft = scrollLeft;
      this.relatedSearchScrollOriginTab = originTab;
    },
    // 获取相关搜索相关数据。
    getRelatedSearch(query) {
      post(RELATED_API, {
        params: {
          f: "json",
          keyword: query,
        },
      })
        .then(({ cards }) => {
          if (Array.isArray(cards) && cards.length > 0) {
            const data = cards[0]?.tab[0]?.tabItem || [];
            const list = data.map((item) => {
              return item.content[0];
            });
            this.relatedSearchList = list;
            this.isRelatedSearchReady = true;
          }
        })
        .catch((err) => {
          console.error(
            `getRelatedSearch---query:, ${this.query}, "---", ${err}`
          );
          oreport.reportError(
            new Error(`getRelatedSearch---query:, ${this.qurey}, "---", ${err}`)
          );
          this.isRelatedSearchReady = true;
        });
    },
  },
};
</script>

<style lang="scss">
@import "src/style/functions/index.scss";
@import "src/style/index.scss";

$namespace: "medusa-"; // 可配置的命名空间
@include b(views) {
  min-height: 100vh;
  @include e(debug-ele) {
    position: fixed;
    top: 0;
    right: 0;
    font-size: 16px;
    color: rgba(255, 0, 0, 0.5);
  }
}
</style>
