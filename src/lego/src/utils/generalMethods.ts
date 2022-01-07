import { localStorage, browserInfo, getRefreshSessionId } from "../sdk/sync";
import { jumpActionToUrl } from "./toolKit";
import { debounce } from "./limit";
import { post } from "../fetch";
import { oreport } from "./oreport";
import { jsonParse } from "./queryString";
import {
  SUG_ONLINE_APPS,
  SUG_LOCAL_APPS,
  COMPLEX_LOCAL_APPS,
  COMPLEX_ONLINE_APPS,
  SUG_CURRENT_QUERY,
  DEFAULT_TAB_INDEX,
  GS_SUG_ID,
  REFRESH_SESSION_ID,
  SUG_ONLINE_APP_STATE,
  SPECIAL_PKG_WALLET_ONLINE,
  SPECIAL_PKG_WALLET_LOCAL
} from "./constant";
import { kvType } from "../sdk/core";
import { IHref } from "../track_lazy/jump";

// 为了兼容prerender-spa-plugin插件服务端渲染
if (location.port === "8001") {
  post();
}

// 设置结果页默认tab为综合。
const clearQueryMethods = () => {
  localStorage.setItem(DEFAULT_TAB_INDEX, "");
};

//结果页综合tab页面回到顶部。
const backTop = () => {
  window.requestAnimationFrame(() => {
    if (
      document.getElementsByClassName("medusa-complex")[0] &&
      document.getElementsByClassName("medusa-complex")[0].scrollTop
    ) {
      document.getElementsByClassName("medusa-complex")[0].scrollTo(0, 0);
    }
  });
};

// 同时兼容数组的jumpActions和对象的jumpAction,不需要再用genHref方法处理。
const formatUrl = jumpActions => {
  if (Array.isArray(jumpActions) && jumpActions.length > 0) {
    const herf = {};
    jumpActions.forEach(item => {
      const itemHerf = jumpActionToUrl(item);
      Object.assign(herf, itemHerf);
    });
    return herf;
  }
  if (Object.prototype.toString.call(jumpActions) === "[object Object]") {
    return jumpActionToUrl(jumpActions);
  }
  return "";
};

const genHref = ({ fastappUrl }: { fastappUrl: string }): IHref => {
  if (fastappUrl) {
    return {
      hap: fastappUrl
    };
  }
};

// 兼容处理在线包名和本地包名不一致的app。
const getPkg = pkg => {
  // 钱包
  if (pkg === SPECIAL_PKG_WALLET_ONLINE) {
    return SPECIAL_PKG_WALLET_LOCAL;
  }
  return pkg;
};

// 获取sug页用户输入query
const getSugQuery = () => {
  return localStorage.getItem(SUG_CURRENT_QUERY) || "";
};

// 保存sug页用户输入query
const setSugQuery = query => {
  if (!query) return;
  localStorage.setItem(SUG_CURRENT_QUERY, query);
};

// 保存sug历史记录。（客户端开关仅仅控制sug历史记录在sug页展示与否，不控制是否保存）
const saveSugHistory = function(q) {
  const list = jsonParse(localStorage.getItem("sug_search")) || [];
  const result = list.filter(item => item !== q);
  result.unshift(q);
  localStorage.setItem("sug_search", JSON.stringify(result));
};

// 保存首页历史记录。（客户端开关控制首页历史记录展示和保存与否）。
const saveHistory = debounce(function(q) {
  if (!q) return;
  saveSugHistory(q);
  if (browserInfo.searchRecordSwitch !== "1") return;
  const list = jsonParse(localStorage.getItem("search")) || [];
  const result = list.filter(item => item !== q);
  result.unshift(q);
  localStorage.setItem("search", JSON.stringify(result));
}, 0);

// sug保存在线app到本地
function saveSugOnlineAppsToLocal(id, list) {
  const data = {};
  data[id] = list;
  localStorage.setItem(SUG_ONLINE_APPS, JSON.stringify(data));
}

// sug保存本地app到本地。
function saveSugLocalAppsToLocal(id, list) {
  const data = {};
  data[id] = list;
  localStorage.setItem(SUG_LOCAL_APPS, JSON.stringify(data));
}

// 通过key清除保存在本地在线app数据
function clearLocalListByKey(key) {
  localStorage.setItem(key, JSON.stringify(""));
}

// 综合搜索结果页保存在线app到本地
function saveComplexOnlineListToLocal(id, list) {
  // 先获取之前保存的list，将本次保存的assign进去。结果页可能多核打开多个，为了保证每个页面功能都独立。
  const dataBefore = localStorage.getItem(COMPLEX_ONLINE_APPS);
  const parseDataBefore = JSON.parse(dataBefore || null) || {};
  parseDataBefore[id] = list;
  localStorage.setItem(COMPLEX_ONLINE_APPS, JSON.stringify(parseDataBefore));
}

// 综合搜索结果页保存本地app到本地。
function saveComplexLocalAppsToLocal(id, list) {
  // 先获取之前保存的list，将本次保存的assign进去。结果页可能多核打开多个，为了保证每个页面功能都独立。
  const dataBefore = localStorage.getItem(COMPLEX_LOCAL_APPS);
  const parseDataBefore = JSON.parse(dataBefore || null) || {};
  parseDataBefore[id] = list;
  localStorage.setItem(COMPLEX_LOCAL_APPS, JSON.stringify(parseDataBefore));
}

// Button组件上报resource_status方法。
function setRStatusToUp(ele, status) {
  if (!ele || !status) return;
  let element = ele;
  while (element && !element.hasAttribute("data-exp")) {
    element = element.parentElement;
  }
  if (element) {
    const dataLog = JSON.parse(element.dataset.log || null);
    const newDataLog = Object.assign({}, dataLog, {
      resource_status: status
    });
    element.setAttribute("data-log", JSON.stringify(newDataLog));
  }
}

// 保存sugid到本地，给予客户端读取。
function saveSugIdToLocalForClient(sugId) {
  if (sugId && typeof sugId === "string") {
    localStorage.setItem(GS_SUG_ID, sugId || "");
  }
}

// iframe内页面回到顶部方法。iframeDom为iframe的dom元素
function iframePageBackToTop(iframeDom) {
  if (!iframeDom) return;
  // try catch主要去除本地开发时的跨域报错。
  try {
    const iframeDocument = iframeDom?.contentWindow
      ? iframeDom.contentWindow.document
      : null;
    const iframeWindow = iframeDom.contentWindow;
    if (
      iframeDocument &&
      iframeDocument.documentElement &&
      iframeDocument.documentElement.scrollTo
    ) {
      iframeDocument.documentElement.scrollTo(0, 0);
    } else if (iframeWindow && iframeWindow.scrollTo) {
      iframeWindow.scrollTo(0, 0);
    }
  } catch (error) {
    if (location.hostname !== "localhost") {
      console.error(new Error(error));
      oreport.reportError(new Error(error));
    }
  }
}

// 往window.GSCL里面push进debug信息。
function setDebugInfoToWindow(info) {
  try {
    if (!info) return;
    if (Array.isArray((<kvType>window).GSCL)) {
      (<kvType>window).GSCL.push(info);
    } else {
      (<kvType>window).GSCL = [info];
    }
  } catch (error) {
    console.error(new Error(error));
    oreport.reportError(new Error(error));
  }
}

// 调用location.reload()之前需要获取新的sessionID，并且保存到本地。
function saveNewSessionIDToLocal(query) {
  const newSessionID = getRefreshSessionId(query);
  if (newSessionID) {
    localStorage.setItem(REFRESH_SESSION_ID, newSessionID);
  }
}

function getNewSessionIDFromLocal() {
  return localStorage.getItem(REFRESH_SESSION_ID) || "";
}

function clearNewSessionIDFromLocal() {
  localStorage.setItem(REFRESH_SESSION_ID, "");
}

// 保存SUG_ONLINE_APP_STATE状态到本地。
function updateSugOnlineAppState(state) {
  localStorage.setItem(SUG_ONLINE_APP_STATE, state);
}

function getSugOnlineAppState() {
  return Number(localStorage.getItem(SUG_ONLINE_APP_STATE)) || 0;
}

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
};
