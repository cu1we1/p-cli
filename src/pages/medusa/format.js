import { ENTRY_MAP } from "@lego";
const KEY_TYPE = {
  // 应用程序
  100201: "apps",
  // 设置
  100202: "settings",
  // 相册
  100209: "albumsearch",
  // 电话本
  100203: "contacts",
  // 日历
  100204: "calendar",
  // 文件
  100208: "files",
  // 便签
  100205: "note",
  // 短信
  100206: "mms",
  // 浏览器
  100207: "browser",
  // 快捷方式
  100210: "shortcuts"
};

// App > 快捷功能 > 设置 > 相册 > 文件 > 电话本 > 日历 > 便签 > 信息
const defaultOrder = [
  "apps",
  "shortcuts",
  "settings",
  "albumsearch",
  "files",
  "contacts",
  "calendar",
  "note",
  "mms"
];

function formatMedusa(data) {
  const {
    messageType,
    cards,
    bucketIds,
    nlpPileInfo = "",
    rankPileInfo = "",
    code,
    cardsState = "0"
  } = data;
  let hasOnlineResults = false;
  let onlineAppsInfo, onlineAppsRecAdd;
  // 网页卡展示状态。前端默认2：屏蔽
  let webResultsShowState = "2";
  // 服务端是否返回了100600网页卡状态
  let isGetWebResultsState = false;
  if (code !== 0) {
    return [
      [],
      defaultOrder,
      "",
      "",
      "",
      null,
      { operation: null, operationOrder: null },
      false,
      onlineAppsInfo,
      (webResultsShowState = "0"),
      cardsState
    ];
  }
  //序列化data，便于取值。
  if (cards && cards.length) {
    cards.forEach(item => {
      const { dataInfo, tab, cardInfo } = item;
      if (dataInfo) {
        // 判断是否有在线结果展示
        if (!hasOnlineResults && ENTRY_MAP.includes(dataInfo.cardId)) {
          hasOnlineResults = true;
        }
        // 如果有在线app，获取以后供应用tab展示。
        if (
          dataInfo.cardId === "100101" &&
          tab[0] &&
          tab[0].tabItem &&
          tab[0].tabItem.length > 0
        ) {
          onlineAppsInfo = item;
        }
        // 如果有推荐app，获取以后供应用tab推荐卡展示。
        if (
          // dataInfo.cardId === "100105" &&
          dataInfo.cardId === "100105" &&
          tab[0] &&
          tab[0].tabItem &&
          tab[0].tabItem.length > 0
        ) {
          onlineAppsRecAdd = item;
        }
        // 获取100600网页卡展示状态。
        if (dataInfo.cardId === "100600" && cardInfo?.showStatus) {
          webResultsShowState = cardInfo.showStatus;
          isGetWebResultsState = true;
          return;
        }
        data[dataInfo.cardId] = item;
      }
    });
  }

  // 如果服务端没有返回100600卡，表示此query没有做干预，前端需要展示网页卡。
  if (!isGetWebResultsState) {
    webResultsShowState = "0";
    // webResultsShowState = "1";
  }
  const hits = [];
  let activity = null;
  let operation = null;
  let operationOrder = null;
  //根据服务端下发的卡片排序规则排序卡片。
  messageType.forEach(item => {
    if (item === "100403") {
      //取出运营卡模板卡（新）
      operation = {
        tname: "100403",
        payload: data[item]
      };
      if (data[item] && data[item].cardContent) {
        [, , , , operationOrder] = data[item].cardContent;
      }
    } else if (item === "100401") {
      // 取出活动卡（旧）
      activity = {
        tname: "100401",
        payload: data[item]
      };
    } else {
      hits.push({
        tname: item,
        payload: data[item]
      });
    }
  });
  // 默认强制本地app排在本地卡首位。
  const order = ["apps"];
  let nHits = [];
  //筛出mixApp\本地\运营活动卡。
  nHits = hits.filter(item => {
    const { tname, payload } = item;
    const isLocalName = KEY_TYPE[tname];
    if (tname === "mixApp") {
      return false;
    }
    if (isLocalName) {
      order.push(isLocalName);
      return false;
    }
    if (
      tname === "100401" ||
      tname === "100403" ||
      tname === "weibo" ||
      tname === "videoMovie" ||
      payload === undefined
    ) {
      return false;
    }
    return true;
  });

  if (operationOrder > 0 && operation && operation.payload) {
    nHits.splice(operationOrder - 1, 0, operation);
  }

  return [
    nHits,
    [...new Set(order.concat(defaultOrder))],
    bucketIds,
    rankPileInfo,
    nlpPileInfo,
    activity,
    {
      operation,
      operationOrder
    },
    hasOnlineResults,
    onlineAppsInfo,
    webResultsShowState,
    cardsState,
    onlineAppsRecAdd
  ];
}

export { defaultOrder, formatMedusa };
