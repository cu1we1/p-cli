import { browserInfo } from "../sdk/sync";

let { O_URL, O_MEDUSA_URL, O_OUIS, O_CURL, urlCdn } = browserInfo;
// 结果页在线搜索接口。
const MEDUSA_API = `${O_MEDUSA_URL}/search/global/new_medusa`;
// 在线app二级页接口。
const APP_API = `${O_MEDUSA_URL}/search/global/app`;
// sug二级页接口。
const SUG_URL = `${O_MEDUSA_URL}/search/global/new_sug`;
// 二级页在线地址。
const ZEUS_URL = `${urlCdn}/zeus.html`;
// 酒店预订接口。
const HOTEL_API = `${O_OUIS}/search/external/hotel`;
// 相关搜索接口。
const RELATED_API = `${O_MEDUSA_URL}/search/global/related_search`;
// 游戏tab搜索+推荐接口
const GAME_S_R_API = `${O_MEDUSA_URL}/search/global/search_page_game`;
// 应用垂搜首页接口
const APP_SEARCH_API = `${O_MEDUSA_URL}/search/global/app_search_index`;

// 前端版本号，用于埋点上报使用。
const FE_VERSION =
  (process && process.env && process.env.APP_VERSION) || "0.0.0";
// 是否展示开发用于debug的元素。
const SHOW_DEV_ELEMENTS =
  (process && process.env && process.env.APP_SHOW_DEV_ELEMENTS) || false;

// 用于localstorage保存的key
const SUG_ONLINE_APPS = "sug_online_apps_list";
const SUG_LOCAL_APPS = "sug_local_apps_list";
const COMPLEX_ONLINE_APPS = "complex_online_apps_list";
const COMPLEX_LOCAL_APPS = "complex_local_apps_list";
const SUG_CURRENT_QUERY = "sug_current_query";
const REFRESH_SESSION_ID = "refresh_session_id";
const SUG_ONLINE_APP_STATE = "sug_online_app_state";
// 默认tab
const DEFAULT_TAB_INDEX = "default_tab_index";
// 客户端请求服务端sug接口需要拼接的参数sugid
const GS_SUG_ID = "sugid";

const tabMapping = {
  local: 1,
  online_apps: 2,
  complex: 3,
  web_results: 3
};

const tabMapping_web = {
  local: 1,
  online_apps: 2,
  complex: 3,
  web_results: 3,
  web: 4
};
// 用于拼接在网页iframe的url里面做唯一标识的。
// 取值：new Date('Fri Feb 22 2222 22:22:22 GMT+0800 (中国标准时间)').getTime()
const WEB_URL_CONSTANT = "7956886942000";

// 钱包在线应用下发包名
const SPECIAL_PKG_WALLET_ONLINE = "com.coloros.wallet";
// 钱包本地应用下发包名
const SPECIAL_PKG_WALLET_LOCAL = "com.finshell.wallet";

// 应用下载状态
/**
 * 应用下载状态
 * -2: 客户端自定义操作导致下载开始（移动网络取消等）。
 * -1: 未初始化，商店无该下载任务。
 * 0: 下载中。
 * 1: 准备中。
 * 2: 暂停中。
 * 3: 下载完成，未安装。
 * 4: 安装中。
 * 5: 已安装。
 * 8: 失败。
 * 11: 可更新。
 * 12: 已预约（商店进程存在的情况下，切换到wifi会自动下载）。
 */
const APP_DOWNLOAD_STATE = {
  "-2": "custom",
  "-1": "uninitialized",
  "0": "started",
  "1": "prepare",
  "2": "paused",
  "3": "finished",
  "4": "installing",
  "5": "installed",
  "8": "failed",
  "11": "update",
  "12": "reserved"
};
// 已有在线卡卡片ID。
const ENTRY_MAP = [
  "100101",
  "100105",
  "100102",
  "100299",
  "100401",
  "280101",
  "netWorkError",
  "100403",
  "130101",
  "130103",
  "130104",
  "130105",
  "130106",
  "130201",
  "movie",
  "moviesFuzzy",
  "moreLocalContent",
  "100610",
  "100611",
  "100608",
  "100609",
  "anchorToWebPage",
  "noResults",
  "refresh"
];

export {
  O_URL,
  O_MEDUSA_URL as API,
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
};
