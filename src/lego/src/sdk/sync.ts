import wv from "./wv";
import { getUrlSingleParam } from "../utils/queryString";

import {
  getSyncInvokeData,
  isClientEvn,
  frontCache,
  getValueFromCache
} from "./core";
import {
  SPECIAL_PKG_WALLET_ONLINE,
  SPECIAL_PKG_WALLET_LOCAL
} from "../utils/constant";
// JSAPI同步接口

type browserInfoResp = {
  complexUrl: string;
  engineName: string;
  engineUrl: string;
  webUrl: string;
  webview: string;
  urlMapping: string;
  appVersion: string;
  brand: string;
  language: string;
  searchRecordSwitch: string;
  theme: number;
  encryptResult: string;
  sIv: string;
  sKey: string;
  mobileName: string;
  colorOsVersion: string;
  androidReleaseVersion: string;
  networkType: string;
  O_OUIS: string;
  O_CURL: string;
  O_URL: string;
  O_MEDUSA_URL: string;
  urlCdn: string;
};

type mappingP = {
  ouis_search: string;
  medusa_search: string;
  global_index: string;
  config_server: string;
};

// 获取设备相关信息。
let browserInfo: browserInfoResp = {
  complexUrl: "https://m.baidu.com/s?from=1023341c&tn=ins&wd=",
  engineName: "百度搜索",
  engineUrl: "https://m.baidu.com/s?from=1023341c&tn=ins&wd=",
  webUrl: "https://m.baidu.com/s?from=1020681r&tn=ins&wd=",
  webview: "1",
  urlMapping:
    '{"ouis_search":"https://ouis.search.heytapmobi.com","config_server":"https://config.search.heytapmobi.com","global_index":"https://i.search.heytapmobi.com","medusa_search":"https://ms.search.heytapmobi.com"}',
  appVersion: "10.14.0",
  brand: "oppo",
  language: "zh-CN",
  searchRecordSwitch: "",
  theme: 0,
  encryptResult:
    "4dcc4296701ae76c69514fe5290b136ca2991882419663de6b310382a4f4490912672c0f1065218b685c0a3d23c4fe2fe4727be685ef0b1bed1368a391661279485cfc70c3e3b09d58f74805adb3506488480af5824384f6092cda4112ae04afe227252b487ea2143b5b4028fd2a177b717280833edd1f84663cce8c44d954d828680eb44b248725b0d63a4b92fcdb28d25ee5e974568de202287e19d408458e0a2a5527376de1e5aa03ebe0e0abad4f20800423f0681fdf11e23669edccc0616d5b83bc0ee14324a7239b9d9b36a5c79e9b7b1112f86ed6f3e575523eea2cdc14ebdb7d3eb5dc6694fe5bc70165a3155dc5c190a8ffc04b1353ecfb6176bbf52e19c5d903ed32a1369ad2998f80938c004dcfde6efad7573f3305cb2e72ae823eecb2bd1eb93497059229ab5618ec67f722aabf0f02d412d63b915dba17cf1e6620afd193fa9f93d2a5a90e3c741c94fa7e7007283c2eafdafbd85c2c2f277ccbfd9303d424ca9c54fe665d01fad127f56b0709f18311864436bee64c6976efec213909c16e4b67a1069c63634abab0a9f96bb6a70ce35afcc0ac4ff8dcac7fc0abf41e90efca37adb0cc24deff089b700217b178a4f2a8f2b47459d70a0a56",
  sIv: "",
  sKey: "",
  mobileName: "OPPO R11s",
  colorOsVersion: "",
  androidReleaseVersion: "",
  networkType: "wifi",
  O_OUIS: "https://ouis.search.heytapmobi.com",
  O_URL: "https://i.search.heytapmobi.com",
  O_MEDUSA_URL: "https://ms.search.heytapmobi.com",
  O_CURL: "https://config.search.heytapmobi.com",
  urlCdn: "https://prod-search.nearme.com.cn"
};
if (isClientEvn) {
  browserInfo = getBrowserInfo();
  if (browserInfo.urlMapping) {
    const urlMapping: mappingP = JSON.parse(browserInfo.urlMapping);
    browserInfo.O_OUIS = urlMapping.ouis_search;
    browserInfo.O_URL = urlMapping.global_index;
    browserInfo.O_MEDUSA_URL = urlMapping.medusa_search;
    browserInfo.O_CURL = urlMapping.config_server;
  }
} else {
  // 本地开发设置全局背景色
  document?.body?.classList.add("local_dev");
}

if (browserInfo.theme === 1) {
  document?.body?.classList.add("gs_dark");
}

/**
 * 获取设备信息。
 * @returns 设备信息
 */
function getBrowserInfo(): browserInfoResp {
  if (isClientEvn) {
    const method = "Common.getBrowserInfo";
    const source = getUrlSingleParam("source");
    return JSON.parse(
      getSyncInvokeData(method, wv.invoke(method, { source })) || null
    );
  } else {
    return browserInfo;
  }
}

function adReport(data: {} | string) {
  try {
    if (isClientEvn) {
      wv.invoke("Stat.adReport", {
        str: data
      });
    } else {
      console.log(data);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * 查询APP是否安装
 * @param pkg 包名
 * @returns "" | "1"
 */
function isApkInstalled(pkg: string): string {
  if (isClientEvn) {
    const method = "Common.isApkInstalled";
    let value: string | undefined = getValueFromCache(method, pkg);
    if (typeof value === "string") return value;
    // 兼容部分手机OPPO钱包包名不一样。
    if (pkg === SPECIAL_PKG_WALLET_ONLINE) {
      value = getSyncInvokeData(
        method,
        wv.invoke(method, {
          pkg: SPECIAL_PKG_WALLET_LOCAL
        })
      );
    }
    value = getSyncInvokeData(
      method,
      wv.invoke(method, {
        pkg
      })
    );
    frontCache(method, pkg, value);
    return value;
  }
  return "";
}

/**
 * 查询App是否隐藏
 * @param pkg 包名
 * @returns "" | "1"
 */
function isAppHided(pkg: string): string {
  if (isClientEvn) {
    const method = "Common.isAppHided";
    let value: string | undefined = getValueFromCache(method, pkg);
    if (typeof value === "string") return value;
    value = getSyncInvokeData(
      method,
      wv.invoke(method, {
        pkg
      })
    );
    frontCache(method, pkg, value);
    return value;
  }
  return "";
}

function isNetworkAvailable(): string {
  if (isClientEvn) {
    const method = "Common.isNetworkAvailable";
    return getSyncInvokeData(method, wv.invoke(method));
  }
  return "1";
}

function launchCallByContactID(contactId: string, phoneNumber: string): string {
  if (isClientEvn) {
    const method = "Action.launchCallByContactID";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        contactId,
        phoneNumber
      })
    );
  }
  return "1";
}

function launchMessageByContactID(
  contactId: string,
  phoneNumber: string
): string {
  if (isClientEvn) {
    const method = "Action.launchMessageByContactID";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        contactId,
        phoneNumber
      })
    );
  }
  return "1";
}

function launchPhotoEditPage(
  id: string,
  ids: Array<string>,
  type: string
): string {
  if (isClientEvn) {
    const method = "Action.launchPhotoEditPage";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        id,
        ids,
        type
      })
    );
  }
  return "1";
}

function launchSettings(): string {
  if (isClientEvn) {
    const method = "Action.launchSettings";
    return getSyncInvokeData(method, wv.invoke(method));
  }
  return "1";
}

function openSearchApp(key: string, item: { icon: string }): string {
  if (isClientEvn) {
    const method = "Action.openSearchApp";
    let newItem: {} = { ...item, icon: "" };
    if (key === "note" || key === "mms" || key === "calendar") {
      newItem = { ...newItem, subTitle: "", title: "" };
    }
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        source: key,
        dataEntity: JSON.stringify(newItem)
      })
    );
  }
  return "1";
}

function showToast(text: string): string {
  if (isClientEvn && text) {
    const method = "Action.showToast";
    return getSyncInvokeData(method, wv.invoke(method, text));
  }
  return "1";
}

function readyToJSBridge(session: string): string {
  if (isClientEvn) {
    const method = "Common.readyToJSBridge";
    return getSyncInvokeData(method, wv.invoke(method, session));
  }
  return "1";
}

function requestSearch(query: string, source?: string): string {
  if (isClientEvn) {
    const method = "Action.requestSearch";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        query,
        source
      })
    );
  }
  return "1";
}

function sendTo(pkg: string): string {
  if (isClientEvn) {
    const method = "Action.sendTo";
    return getSyncInvokeData(
      method,
      wv.invoke({
        pkg
      })
    );
  }
  return "1";
}

//设置输入框文本选中，选中（‘1’）or不选中（‘0’）
function setInputTextSelected(visible: string): string {
  if (isClientEvn) {
    const method = "Action.setInputTextSelected";
    return getSyncInvokeData(method, wv.invoke(method, visible));
  }
  return "1";
}

function setKeyboardVisible(visible: string): string {
  if (isClientEvn) {
    const method = "Action.setKeyboardVisible";
    return getSyncInvokeData(method, wv.invoke(method, visible));
  }
  return "1";
}

function showLocationPermissionDialog(): string {
  if (isClientEvn) {
    const method = "Action.showLocationPermissionDialog";
    return getSyncInvokeData(method, wv.invoke(method));
  }
  return "1";
}

// trigger 参数没有作用
function generalStat(
  id: string | number,
  log: {} | string,
  trigger: boolean = false
): string {
  try {
    const data = {
      id,
      map: log
    };
    if (isClientEvn) {
      const method = "Stat.generalStat";
      // console.log(data);
      return getSyncInvokeData(
        method,
        wv.invoke(method, {
          str: JSON.stringify(data),
          trigger
        })
      );
    }
    console.log(data);
    return "1";
  } catch (error) {
    console.error(error);
  }
}

function verifyDeepLink(url: string, pkg: string = ""): string {
  if (isClientEvn) {
    const method = "Common.verifyDeepLink";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        url,
        pkg
      })
    );
  }
  return "1";
}

const localStorage = {
  getItem,
  setItem
};

function getItem(key: string, defValue = ""): string {
  if (isClientEvn) {
    const method = "Common.kvGet";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        key: `h5-${key}`,
        defValue
      })
    );
  } else {
    return window.localStorage.getItem(key);
  }
}

function setItem(key: string, value: {} | string): string {
  if (value === undefined || value === null) return;
  if (isClientEvn) {
    const method = "Common.kvPut";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        key: `h5-${key}`,
        value
      })
    );
  } else {
    window.localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
    return "1";
  }
}

const cacheStorage = {
  getItem: cacheGet,
  setItem: cachePut
};

function cacheGet(key: string, defValue = "") {
  if (isClientEvn) {
    const method = "Common.cacheGet";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        key: `h5-cache-${key}`,
        defValue
      })
    );
  } else {
    return window.localStorage.getItem(key);
  }
}

function cachePut(key: string, value: {} | string): string {
  if (value === undefined || value === null) return;
  if (isClientEvn) {
    const method = "Common.cachePut";
    return getSyncInvokeData(
      method,
      wv.invoke(method, {
        key: `h5-cache-${key}`,
        value
      })
    );
  } else {
    window.localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
    return "1";
  }
}

function openLinkList(
  data: {
    type: string;
    hrefs: { url?: string; mode?: number; title?: string };
    judgeNet?: boolean;
  }[]
) {
  if (isClientEvn) {
    const method = "Redirection.openLinkList";
    return getSyncInvokeData(method, wv.invoke(method, { data }));
  }
  let url: any;
  data.some(value => {
    if (value.type === "h5") {
      ({ url } = value.hrefs);
      return url;
    }
    return false;
  });
  window.location.href = url;
  return null;
}

function getRefreshSessionId(query: string): string {
  if (isClientEvn) {
    const method = "Common.getRefreshSessionId";
    return getSyncInvokeData(method, wv.invoke(method, { query }));
  }
}

/**
 * 开始应用下载
 * @param data 游戏相关信息
 * @returns '0'or'1'
 */
function pushAppDownload(data: {
  pkg: string;
  autoDownload: Boolean;
  url: string;
  transparent: string;
  adpos: Number;
  token: string;
}) {
  if (isClientEvn) {
    const method = "Download.startDownload";
    return getSyncInvokeData(method, wv.invoke(method, data));
  }
  return "";
}

/**
 * 此方法用于暂停一个应用的下载
 * @param pkg 包名
 * @returns
 */
function pauseDownloadByPkg(pkg: string) {
  if (isClientEvn) {
    const method = "Download.pauseDownloadByPkg";
    return getSyncInvokeData(method, wv.invoke(method, pkg, 2));
  }
  return "";
}

/**
 * 获取应用垂搜首页下载管理菜单
 * @returns string
 */
function getDownloadMenu(): string {
  if (isClientEvn) {
    const method = "Common.getDownloadMenu";
    return getSyncInvokeData(method, wv.invoke(method));
  }
}

export {
  adReport,
  browserInfo,
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
  localStorage,
  cacheStorage,
  openLinkList,
  getRefreshSessionId,
  pushAppDownload,
  pauseDownloadByPkg,
  getDownloadMenu,
  getBrowserInfo
};
