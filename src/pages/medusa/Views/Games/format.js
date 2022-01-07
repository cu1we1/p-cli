import { isAppHided, isApkInstalled } from "@lego";
function formatList(list) {
  return list
    .map(item => {
      const {
        content,
        cpId,
        downloadToken,
        jumpActions,
        pic,
        resourceId: rId,
        channelId
      } = item;
      const [type, name, desc, rateText, timeOnline] = content;
      const [{ url, pkg }] = jumpActions;
      if (type === "0") {
        // 过滤本地已安装或者隐藏的app
        const filterTag = !isApkInstalled(pkg) && !isAppHided(pkg);
        // 普通游戏（App）
        return filterTag
          ? {
              rId,
              cpId,
              id: rId,
              type,
              name,
              rateText,
              icon: pic[0],
              pkg,
              url,
              installNum: desc,
              token: downloadToken,
              channelId
            }
          : "";
      } else if (type === "1") {
        // 可预约游戏
        return {
          rId,
          cpId,
          id: rId,
          type,
          name,
          timeOnline,
          icon: pic[0],
          url,
          pkg,
          reservation: desc,
          reservationState: rateText,
          channelId
        };
      } else if (type === "2") {
        // 小游戏（快应用）
        return {
          rId,
          cpId,
          id: rId,
          type,
          name,
          desc,
          url,
          icon: pic[0],
          channelId
        };
      }
    })
    .filter(i => i);
  // 过滤空元素
}

export default function format(payload) {
  let result = [],
    recommend = [];
  payload.forEach(item => {
    const {
      dataInfo: { cardId },
      tab
    } = item;
    const list = tab[0] ? tab[0].tabItem : [];
    if (list.length > 0) {
      switch (cardId) {
        case "170004":
          result = formatList(list);
          break;
        case "170005":
          recommend = formatList(list);
          break;
      }
    }
  });
  return {
    result,
    recommend
  };
}
