import { trackDataMethods, reportDataMethods } from "./methods";
import { parse } from "../utils/queryString";
import { trackPerformance } from "../track_lazy";
import { FE_VERSION } from "../utils/constant";

const perfNow = () => window.performance.now();
class PerfTrack {
  // 记录的时间点
  trackData = {
    // 客户端发起搜索的时间点。
    clientRequest: 0,
    // 客户端初始化webview的耗时
    initWebview: 0, //
    // performace.navigationStart
    navigationStart: 0,
    // performace.timing.responseEnd
    responseEnd: 0,
    jsExecution: 0,
    // 前端开始展示渲染内容的时间点，medusa/index.vue触发mounted
    firstContentPaint: 0,
    // 首屏渲染的时间点
    firstScreenPaint: 0,
    perfFirstContentfulPaint: 0,
    // iframe 开始load url 时间
    iframeStartLoad: 0,
    // iframe 开始check load
    iframeStartLoadCheck: 0,
    // iframe 结束load
    iframeLoaded: 0,
    // local 和 在线app mounted 事件
    localResultMounted: 0,
    appStoreMounted: 0,
    localResultImgLoaded: 0,
    appStoreImgLoaded: 0,
    // 结果页前端注册回调的时间点
    registerCallBack: 0,
    // 结果传输耗时
    nativeToFrontend: 0,
    // 前端收到第一条结果的时间点。
    getFirstResutlData: 0
  };
  // 需要上报的内容
  reportData = {
    // new webview 耗时
    initWebview: 0,
    // 从客户端发起搜索到navigationStart的耗时。
    initEnvironment: 0,
    // 从导航开始到加载html所需耗时。responseEnd - navigationStart
    getHtml: 0,
    // 前端开始展示渲染内容的时间点，medusa/index.vue触发mounted
    firstContentPaint: 0,
    // js同步脚本执行耗时
    jsExecution: 0,
    // 首屏渲染的耗时。 firstScreenPaint
    firstScreenPaint: 0,
    // 首次有内容的渲染（html）
    perfFirstContentfulPaint: 0,
    // 结果数据传输耗时
    nativeToFrontend: 0,
    // iframe 开始load url 时间
    iframeStartLoad: 0,
    // iframe 开始check load
    iframeStartLoadCheck: 0,
    // iframe.onload触发（performance.now())
    iframeLoaded: 0,
    // local 和 在线app mounted 事件
    localResultMounted: 0,
    appStoreMounted: 0,
    localResultImgLoaded: 0,
    appStoreImgLoaded: 0,
    // 结果页前端注册回调的时间点
    registerCallBack: 0,
    // 前端注册回调到拿到第一条数据中间的耗时。
    registerToGetFirstResult: 0,
    // 同步JSAPI耗时
    timeConsumingOfSyncJSAPI: 0,
    // 本地结果完整耗时
    localCompleteTimeConsuming: 0,
    // 在线结果完整耗时
    onlineCompleteTimeConsuming: 0
  };
  searchId = 0;
  isColdStart = 0;
  constructor() {
    this.init();
  }
  // 实例化类需要初始化的操作。
  init() {
    const { sessionID, isColdStart } = parse(window.location.search);
    if (sessionID) {
      this.searchId = Number(sessionID);
      this.trackData.clientRequest = +sessionID;
    }
    // webview是否是冷启动
    this.isColdStart = Number(isColdStart) || 0;
  }
  // 记录时间点方法。
  track(keys, fn?: Function) {
    try {
      const trackFn = (key, fn) => {
        if (typeof key === "string") {
          fn = fn || trackDataMethods[key] || perfNow;
          fn && (this.trackData[key] = fn(this.trackData));
        }
      };
      if (Array.isArray(keys)) {
        keys.forEach(key => {
          trackFn(key, fn);
        });
      } else {
        trackFn(keys, fn);
      }
    } catch (e) {
      console.error(e);
    }
  }
  report(reportKeys = []) {
    try {
      this.computedReportData(reportKeys);
      let detail = "";
      let val;
      reportKeys.forEach(key => {
        val = Math.floor(this.reportData[key]);
        if (val > 0 && val < 10000) detail += `,${key}_${val}`;
      });
      detail = detail.replace(/^,/, "");
      detail &&
        trackPerformance({
          scenes: "page_render",
          version_id: FE_VERSION,
          page_id: "SearchResultPage",
          search_id: this.searchId,
          consume_time_detail: detail,
          is_cold_start: this.isColdStart
        });
    } catch (error) {
      console.log(error);
    }
  }
  reportSyncJSAPI() {
    try {
      this.computedReportData(["timeConsumingOfSyncJSAPI"]);
      let detail = String(this.reportData.timeConsumingOfSyncJSAPI);
      detail = String(detail).replace(/^,/, "");
      detail &&
        trackPerformance({
          scenes: "page_render",
          version_id: FE_VERSION,
          page_id: "SearchResultPage",
          search_id: this.searchId,
          consume_time_jsapi: detail,
          is_cold_start: this.isColdStart
        });
    } catch (error) {
      console.log(error);
    }
  }
  computedReportData(reportKeys) {
    for (let key of reportKeys) {
      Object.prototype.hasOwnProperty.call(this.reportData, key) &&
        (this.reportData[key] = reportDataMethods[key]
          ? reportDataMethods[key](this.trackData)
          : this.trackData[key]);
    }
  }
}

const perfTrack = new PerfTrack();

export default perfTrack;
