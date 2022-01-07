import performanceTrack from "./perf";

const performanceReport = () => {
  performanceTrack.track([
    "initWebview",
    "navigationStart",
    "responseEnd",
    "jsExecution",
    "perfFirstContentfulPaint"
  ]);
  performanceTrack.report([
    "initWebview",
    "initEnvironment",
    "getHtml",
    "jsExecution",
    "perfFirstContentfulPaint",
    "registerCallBack",
    "registerToGetFirstResult"
  ]);
};
const performanceReportIframe = () => {
  performanceTrack.track(["firstScreenPaint"]);
  performanceTrack.report([
    "firstScreenPaint",
    "iframeStartLoad",
    "iframeStartLoadCheck",
    "iframeLoaded",
    "localResultMounted",
    "localResultImgLoaded",
    "appStoreMounted",
    "appStoreImgLoaded",
    "localCompleteTimeConsuming",
    "onlineCompleteTimeConsuming"
  ]);
};

const performanceReportJSAPI = () => {
  performanceTrack.reportSyncJSAPI();
};

export { performanceReport, performanceReportJSAPI, performanceReportIframe };
