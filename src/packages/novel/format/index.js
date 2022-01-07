import { jumpActionToUrl } from "@lego";

function slderList(list) {
  const res = [];
  let dots = 0;
  list.forEach((item, i) => {
    const index = Math.floor(i / 3);
    if (!res[index]) res[index] = [];
    res[index].push(item);
    dots = index + 1;
  });
  return { list: res, dots };
}

function buttonList(list) {
  const buttons = [];
  const BMAP = {};
  list.forEach(item => {
    buttons.push(item.tabName);
    const { tabItem } = item;
    const members = [];
    let dots = 0;
    BMAP[item.tabName] = {};
    tabItem.forEach((tab, i) => {
      const index = Math.floor(i / 3);
      if (!members[index]) members[index] = [];
      members[index].push(tab);
      dots = index;
    });

    BMAP[item.tabName].list = members;
    BMAP[item.tabName].dots = dots + 1;
  });
  BMAP.buttons = buttons;

  return BMAP;
}

function singleFormat(payload) {
  const { dataInfo, cardContent, picUrl, jumpAction, tab } = payload;

  const source = tab[0].tabItem[0];
  const { content, jumpActions } = source;

  const detailUrl = jumpActionToUrl(jumpAction[0]);
  const moreData = {
    title: cardContent[2],
    more: cardContent[3],
    img: picUrl[0],
    url: detailUrl
  };
  // const tagColor = content[0] === "正版精选" ? "#3596FF" : "#2AD181";
  const updateing = content[5] === "连载中";
  const chapters = {
    list: content && content.length >= 10 ? content.slice(10) : [],
    url: jumpActions.slice(2)
  };
  const novelUrl = jumpActionToUrl(jumpActions[0]);
  const chapterUrl = jumpActionToUrl(jumpActions[1]);

  return {
    dataInfo,
    cardContent,
    picUrl,
    jumpAction,
    source,
    detailUrl,
    novelUrl,
    moreData,
    query: content[1],
    updateing,
    chapters,
    chapterUrl
  };
}

function relateFormat(payload) {
  const { dataInfo, cardContent, picUrl, jumpAction, tab } = payload;
  const moreData = {
    title: cardContent[2],
    more: cardContent[3],
    img: picUrl[0],
    url: jumpActionToUrl(jumpAction[0], { title: "全局搜索小说" })
  };
  const list = tab && tab[0] ? tab[0].tabItem : [];

  return {
    dataInfo,
    cardContent,
    picUrl,
    jumpAction,
    moreData,
    list
  };
}

function authorFormat(payload) {
  const { dataInfo, cardContent, picUrl, jumpAction, tab = [] } = payload;

  const moreData = {
    title: cardContent[3],
    more: cardContent[4],
    img: picUrl[0],
    url: jumpActionToUrl(jumpAction[0], { title: "全局搜索小说" })
  };
  const { list, dots } = slderList(tab[0].tabItem);

  return {
    dataInfo,
    cardContent,
    picUrl,
    jumpAction,
    moreData,
    list,
    dots
  };
}

function wideleyFormat(payload) {
  const { dataInfo, cardContent, picUrl, jumpAction, tab } = payload;
  const moreData = {
    title: cardContent[3],
    more: cardContent[4],
    img: picUrl[0],
    url: jumpActionToUrl(jumpAction[0], { title: "全局搜索小说" })
  };
  const { buttons, ...members } = buttonList(tab);
  return {
    dataInfo,
    cardContent,
    picUrl,
    jumpAction,
    moreData,
    buttons,
    members
  };
}

function voiceFormat(payload) {
  const { dataInfo, cardContent, picUrl, jumpAction, tab } = payload;

  const source = tab[0].tabItem[0];
  const voiceRelated = tab[1] && tab[1].tabItem;
  const { jumpActions } = source;

  const detailUrl = jumpActionToUrl(jumpAction[0]);
  const moreData = {
    title: cardContent[2],
    more: cardContent[3],
    img: picUrl[0],
    url: detailUrl
  };

  const chapterUrl = jumpActionToUrl(jumpActions[1]);

  return {
    dataInfo,
    cardContent,
    picUrl,
    jumpAction,
    moreData,
    chapterUrl,
    source,
    detailUrl,
    voiceRelated
  };
}

const MAPPING = {
  130101: singleFormat,
  130106: singleFormat,
  130102: relateFormat,
  130103: authorFormat,
  130104: wideleyFormat,
  130105: wideleyFormat,
  130201: voiceFormat
};

export default (payload, { tname }) => {
  return MAPPING[tname](payload);
};
