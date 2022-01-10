// JSAPI异步接口
import wv from "./wv";
import { isClientEvn, getAsyncInvokeData } from "./core";
import { post } from "../fetch";

/**
 * 游戏预约/取消预约
 * @param type 接口类型
 * @param appID 游戏ID。
 * @param keyWord 搜索query
 * @param appName 游戏名字
 * @param callBack 回调，用于异步获取结果。
 */
function reserveGame(
  type: "reserveapp" | "cancelreservea",
  appID: string,
  keyWord: string,
  appName: string,
  callBack: Function
) {
  if (isClientEvn) {
    wv.invoke(
      "Action.reserveGame",
      {
        type,
        appID,
        keyWord,
        appName
      },
      getAsyncInvokeData(callBack)
    );
  }
}

/**
 * 注册获取页面可见状态
 * @param cb 回调
 */
function pageVisibilityChange(cb: Function) {
  function pageVisibilityChangeFunc() {
    // 用户离开了当前页面
    if (document.visibilityState === "hidden") {
      cb("");
    }

    // 用户打开或回到页面
    if (document.visibilityState === "visible") {
      cb("1");
    }
  }
  document.addEventListener("visibilitychange", pageVisibilityChangeFunc);

  window.addEventListener("beforeunload", () => {
    document.removeEventListener("visibilitychange", pageVisibilityChangeFunc);
  });
  if (document.visibilityState === "visible") {
    cb("1");
  } else if (document.visibilityState === "hidden") {
    cb("");
  }
}

/**
 * 监听键盘弹起or收起
 * @param cb
 */
function keyboardVisibleChange(cb: Function) {
  if (isClientEvn) {
    wv.on("Common.keyboardVisibleChange", cb);
  }
}

/**
 * 监听历史记录开关状态
 * @param cb
 */
function historySwitchChange(cb: Function) {
  if (isClientEvn) {
    wv.on("Common.historySwitchChange", cb);
  }
}

/**
 * 监听网络变化
 * @param cb
 */
function networkStatusChange(cb: Function) {
  if (isClientEvn) {
    wv.on("Common.networkStatusChange", cb);
  }
}

/**
 * 获取相册缩略图接口
 * @param tag 文件夹的唯一标识
 * @param pageNo 页码  int，从0开始
 * @param pageSize 每页请求数量  最大值100
 * @param updateTime 上次查询的最后一条的时间（首次查询0）（long数据类型，首次加载使用0L）
 * @param query query词
 * @param tagId tagID
 * @param cb 获取结果后的回调
 */
function queryAlbumSnapshotInfo(
  tag: string = "",
  pageNo: number,
  pageSize: number = 100,
  updateTime: number,
  query: string = "",
  tagId: string = "",
  cb: Function
) {
  if (isClientEvn) {
    wv.invoke(
      "Common.queryAlbumSnapshotInfo",
      {
        tag,
        pageNo,
        pageSize,
        updateTime,
        query,
        tagId
      },
      getAsyncInvokeData(cb)
    );
  }
}

/**
 * 更多相册接口
 * @param query 查询关键词
 * @param pageNo 页码  int ，从0开始
 * @param pageSize 每页请求数量  最大值100
 * @param tag 文件夹的唯一标识，首次传空字符串“”
 * @param cb 获取结果后的回调
 */
function queryAlbumInfo(
  query: string,
  pageNo: number,
  pageSize: number = 100,
  tag: string = "",
  cb: Function
) {
  if (isClientEvn) {
    wv.invoke(
      "Common.queryAlbumInfo",
      {
        query,
        pageNo,
        pageSize,
        tag
      },
      getAsyncInvokeData(cb)
    );
  }
}

/**
 * sug页搜索方法
 * @param scb 获取结果回调
 * @param sscb 获取session回调
 * @param other 配置信息
 * @returns
 */
function getSugSearchResults(
  scb: Function,
  sscb: Function,
  other: {
    list: Array<{ key: string; url: string; timeout: number }>;
    searchKeys: string;
    q: string;
  } = {
    list: [],
    searchKeys: "",
    q: ""
  }
) {
  if (!(typeof scb === "function" && typeof sscb === "function")) return;
  const { list, searchKeys, q } = other;
  if (isClientEvn) {
    wv.on("Action.getSugSearchResults", scb);
    wv.on("Action.getSugSearchSession", sscb);
    wv.invoke("Common.sugSearchCof", { searchKeys });
    return;
  }

  const sessionID = Date.now();
  const len = Array.isArray(list) && list.length;
  let fetchCountDone = 0;
  sscb({
    query: q,
    sessionID,
    source: "other"
  });
  if (len) {
    list.forEach(item => {
      const { key, url, timeout } = item;
      const time = Date.now();
      post(url.replace("KW", q), { timeout })
        .then(result => {
          scb({
            query: q,
            sessionID,
            time: Date.now() - time,
            source: { key },
            data: result
          });
          fetchCountDone += 1;
          if (fetchCountDone === len) {
            scb({
              query: q,
              time: 0,
              sessionID,
              needToRefresh: "1"
            });
          }
        })
        .catch(({ code, message }) => {
          scb({
            query: q,
            sessionID,
            time: Date.now() - time,
            source: { key },
            data: { code, msg: message }
          });
          fetchCountDone += 1;
          if (fetchCountDone === len) {
            scb({
              query: q,
              time: 0,
              sessionID,
              needToRefresh: "1"
            });
          }
        });
    });
  }
}

/**
 * 结果页搜索方法
 * @param scb 获取结果的回调
 * @param other 配置信息
 * @returns
 */
function getSearchResults(
  scb: Function,
  other: {
    list: Array<{ key: string; url: string; timeout: number }>;
    searchKeys: string;
    q: string;
    searchNums: number;
  } = {
    list: [],
    searchKeys: "",
    q: "",
    searchNums: 0
  }
) {
  if (typeof scb !== "function") return;
  const { list, searchKeys, q, searchNums } = other;
  if (isClientEvn) {
    wv.on("Action.getSearchResults", scb);
    wv.invoke("Common.resultsSearchCof", {
      searchKeys,
      searchNums
    });
    return;
  }
  const sessionID = "4869";

  const len = Array.isArray(list) && list.length;
  let fetchCountDone = 0;
  if (len) {
    list.forEach(item => {
      const { key, url, timeout } = item;
      const time = Date.now();
      post(url.replace("KW", q), { timeout })
        .then(result => {
          scb({
            query: q,
            sessionID,
            time: Date.now() - time,
            source: { key },
            data: result
          });
          fetchCountDone += 1;
          if (fetchCountDone === len) {
            scb({
              query: q,
              time: 0,
              sessionID,
              needToRefresh: "1"
            });
          }
        })
        .catch(({ code, message }) => {
          scb({
            query: q,
            sessionID,
            time: Date.now() - time,
            source: { key },
            data: { code, msg: message }
          });
          fetchCountDone += 1;
          if (fetchCountDone === len) {
            scb({
              query: q,
              time: 0,
              sessionID,
              needToRefresh: "1"
            });
          }
        });
    });
  }
}

/**
 * 获取本地搜索结果。
 * @param query 搜索词
 * @param cb 获取结果回调
 * @param verticalKey 垂类ID
 */
function getLocalResult(query: string, cb: Function, verticalKey: string = "") {
  if (isClientEvn) {
    wv.on("Action.getLocalResult", cb);
    wv.invoke("Action.startLocalSearch", {
      query,
      verticalKey,
      filterBlack: true,
      checkSynonym: true,
      isSecondPage: true
    });
  } else {
    setTimeout(cb);
  }
}

/**
 * 获取应用下载进度
 * @param scb 接收应用下载进度回调
 * @returns
 */
function registerAppDownloadProgress(scb: Function) {
  if (isClientEvn) {
    wv.on("Download.receiveDownloadProgress", scb);
    wv.invoke("Download.receiveDownloadProgress");
  } else {
    scb({});
  }
}

/**
 * 结果页发起搜索，通过此方法通知前端。
 * @param cb
 */
function getTagOfSearch(cb: () => {}) {
  if (isClientEvn) {
    wv.on("Action.getTagOfSearch", cb);
  }
}

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
};
