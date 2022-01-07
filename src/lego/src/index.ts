export {
  O_URL,
  API,
  MEDUSA_API,
  APP_API,
  ZEUS_URL,
  HOTEL_API,
  SUG_URL,
  O_CURL,
  FE_VERSION,
  SUG_ONLINE_APPS,
  COMPLEX_ONLINE_APPS,
  APP_DOWNLOAD_STATE,
  ENTRY_MAP,
  SUG_CURRENT_QUERY,
  COMPLEX_LOCAL_APPS,
  SUG_LOCAL_APPS,
  DEFAULT_TAB_INDEX,
  GS_SUG_ID,
  SHOW_DEV_ELEMENTS,
  tabMapping,
  tabMapping_web,
  WEB_URL_CONSTANT,
  RELATED_API,
  GAME_S_R_API,
  REFRESH_SESSION_ID,
  SUG_ONLINE_APP_STATE,
  SPECIAL_PKG_WALLET_ONLINE,
  SPECIAL_PKG_WALLET_LOCAL,
  APP_SEARCH_API
} from "./utils/constant";

export {
  adReport,
  isApkInstalled,
  isAppHided,
  isNetworkAvailable,
  launchCallByContactID,
  launchMessageByContactID,
  launchPhotoEditPage,
  launchSettings,
  openSearchApp,
  showToast,
  readyToJSBridge,
  requestSearch,
  sendTo,
  setInputTextSelected,
  setKeyboardVisible,
  showLocationPermissionDialog,
  generalStat,
  verifyDeepLink,
  openLinkList,
  getRefreshSessionId,
  pauseDownloadByPkg,
  pushAppDownload,
  localStorage,
  cacheStorage,
  browserInfo,
  getDownloadMenu,
  getBrowserInfo
} from "./sdk/sync";

export {
  reserveGame,
  pageVisibilityChange,
  keyboardVisibleChange,
  historySwitchChange,
  networkStatusChange,
  queryAlbumSnapshotInfo,
  queryAlbumInfo,
  getSugSearchResults,
  getSearchResults,
  getLocalResult,
  registerAppDownloadProgress,
  getTagOfSearch
} from "./sdk/async";

export {
  performanceReport,
  performanceReportJSAPI,
  performanceReportIframe
} from "./perfTrack/performanceReport";

export { throttle } from "./utils/limit";
export { debounce } from "./utils/limit";
export { default as s2hms } from "./utils/s2hms";
export { default as uuid } from "./utils/uuid";
export {
  stringify,
  jsonParse,
  parse,
  getUrlSingleParam
} from "./utils/queryString";
export { addTask, RAF } from "./utils/scheduler";
export { default as inView } from "./utils/inView";
export {
  jumpActionToUrl,
  stringLength,
  scrollTo,
  substr,
  strReverse,
  highLight,
  isEmptyResult,
  multiUrl,
  changeBodyBgWithTheme,
  clipAndHighLight,
  eTrigger
} from "./utils/toolKit";
export { oreport } from "./utils/oreport";

export { default as performanceTrack } from "./perfTrack/perf";

export { get, post } from "./fetch";

export {
  init,
  inject,
  trackClickBaseEle,
  trackPerformance,
  getFristParentLog,
  debounceExport,
  debounceExport500,
  trackClick,
  trackSearch,
  removeExportTag,
  getPageVisibility,
  debounceLazyLoadImage,
  lazyLoadImage,
  debounceLazyLoadAllImage,
  jump,
  toTrackData,
  addVisibilityChangeCallBack,
  trackAppBaseEle
} from "./track_lazy";

export {
  backTop,
  clearQueryMethods,
  formatUrl,
  genHref,
  getPkg,
  getSugQuery,
  setSugQuery,
  saveHistory,
  saveSugOnlineAppsToLocal,
  saveSugLocalAppsToLocal,
  saveComplexOnlineListToLocal,
  saveComplexLocalAppsToLocal,
  clearLocalListByKey,
  setRStatusToUp,
  saveSugIdToLocalForClient,
  iframePageBackToTop,
  setDebugInfoToWindow,
  saveNewSessionIDToLocal,
  clearNewSessionIDFromLocal,
  getNewSessionIDFromLocal,
  updateSugOnlineAppState,
  getSugOnlineAppState
} from "./utils/generalMethods";

export { default as mThemes } from "./utils/theme";

export {
  isFontColor,
  isFontSize,
  isWeight,
  isAlign,
  isColor,
  isTagSize,
  isTagColor
} from "./utils/validator";

export { highLightQuery, highLightApp } from "./utils/matchCharacters";

export { default as matchCharacters } from "./utils/matchCharacters";

export { default as defer } from "./utils/defer";
