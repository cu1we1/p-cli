import {
  jumpActionToUrl,
  SPECIAL_PKG_WALLET_ONLINE,
  SPECIAL_PKG_WALLET_LOCAL,
  isApkInstalled
} from "@lego";
function format(data = {}) {
  const {
    q,
    sugs = [],
    apps,
    restore,
    searchDirect,
    searchFound,
    onlineApp,
    history = []
  } = data;
  let localResult = {},
    foundData = [],
    directData = {},
    onlineResult = {};
  if (apps && apps.list.length) {
    localResult.apps = apps;
  }
  if (restore && restore.list.length) {
    localResult.restore = restore;
  }
  // 搜索发现小于8条不展示
  if (searchFound?.tab[0]?.tabItem?.length > 7) {
    const { tabItem } = searchFound.tab[0];
    tabItem?.slice(0, 12).forEach(item => {
      const [text] = item.content;
      foundData.push({ text, id: Math.floor(Math.random() * 100000) });
    });
  }
  // 搜索query直达数据。
  if (searchDirect?.tab[0].tabItem?.length > 0) {
    const { tabItem } = searchDirect.tab[0];
    const [title, subtitle, btnText] = tabItem[0].content;
    const [icon] = tabItem[0].pic;
    const { jumpActions } = tabItem[0];
    let hrefs = "",
      searchSource = "";
    if (Array.isArray(jumpActions) && jumpActions.length > 0) {
      for (const item of jumpActions) {
        const { mode, url } = item;
        switch (mode) {
          /**
            //1:H5, 2:Deeplink, 3:hap，7:query-综合tab，8:query-本机tab，9:应用tab，10:网页位置；
           */
          case 1:
            hrefs = Object.assign(hrefs || {}, {
              h5: {
                mode: "page",
                url,
                title: ""
              }
            });
            break;
          case 2:
          case 3:
            hrefs = Object.assign(hrefs || {}, jumpActionToUrl(item));
            break;
          case 7:
            searchSource = "complex";
            break;
          case 8:
            searchSource = "local";
            break;
          case 9:
            searchSource = "online_apps";
            break;
          case 10:
            searchSource = "web";
            break;
        }
      }
    }
    directData = {
      title,
      subtitle,
      btnText,
      icon,
      href: {
        jump: hrefs,
        search: searchSource
      }
    };
  }

  if (onlineApp && onlineApp.tab && onlineApp.tab.length) {
    const {
      tab,
      dataInfo: { cardId, cpId }
    } = onlineApp;
    onlineResult.cardId = cardId;
    onlineResult.cpId = cpId;
    const { tabItem } = tab[0];
    if (tabItem && tabItem.length) {
      onlineResult.tabItem = tabItem.filter(item => {
        let pkg = item.jumpActions[1].pkg;
        if (pkg === SPECIAL_PKG_WALLET_ONLINE) {
          pkg = SPECIAL_PKG_WALLET_LOCAL;
        }
        return !isApkInstalled(pkg);
      });
    }
  }

  return {
    q,
    localResult,
    sugs,
    searchFound: foundData,
    searchDirect: directData,
    onlineResult,
    history
  };
}

export default format;
