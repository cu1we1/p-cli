import { parse } from "..";
import { kvType } from "../sdk/core";

const perfNow = () => window.performance.now();
const getPaintTime = name => {
  const data = performance.getEntriesByName(name)[0];
  if (data && data.name === name) {
    return data.startTime;
  }
  return 0;
};
export const trackDataMethods = {
  initWebview: () => {
    const { initWebView } = parse(window.location.search);
    return Number(initWebView) || 0;
  },
  navigationStart: () => performance.timing.navigationStart,
  responseEnd: () => performance.timing.responseEnd,
  // 首次有内容的渲染（loading）
  perfFirstContentfulPaint: () => getPaintTime("first-contentful-paint"),
  firstContentPaint: () => perfNow(),
  frontendGetResponse: () => perfNow(),
  firstScreenPaint: () => (<kvType>window)?.firstResourceExp || 0,
  jsExecution: () =>
    (<kvType>window)._scriptsEnd - (<kvType>window)._scriptsStart,
  iframeStartLoad: () =>
    (<kvType>window)._GSEISearchTime - performance.timing.navigationStart
};

export const reportDataMethods = {
  initWebview: trackData => trackData.initWebview,
  getHtml: trackData => trackData.responseEnd - trackData.navigationStart,
  firstContentPaint: trackData => trackData.firstContentPaint,
  jsExecution: trackData => trackData.jsExecution,
  firstScreenPaint: trackData => trackData.firstScreenPaint,
  perfFirstContentfulPaint: trackData => trackData.perfFirstContentfulPaint,
  registerCallBack: trackData => trackData.registerCallBack,
  registerToGetFirstResult: trackData =>
    trackData.getFirstResutlData - trackData.registerCallBack,
  iframeStartLoad: trackData => trackData.iframeStartLoad,
  timeConsumingOfSyncJSAPI: () => {
    const result = String((<kvType>window).timeConsumingOfSyncJSAPI);
    // 由于onload上报一次，onbeforeunload也会上报一次，防止重复上报。
    (<kvType>window).timeConsumingOfSyncJSAPI = "";
    return result;
  },
  initEnvironment: trackData =>
    trackData.navigationStart - trackData.clientRequest,
  localCompleteTimeConsuming: trackData => {
    const { initWebview = 0, localResultImgLoaded = 0 } = trackData;
    return initWebview + localResultImgLoaded;
  },
  onlineCompleteTimeConsuming: trackData => {
    const { initWebView = 0, appStoreImgLoaded = 0 } = trackData;
    return initWebView + appStoreImgLoaded;
  }
};
