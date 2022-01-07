import { formatUrl } from "@lego";

function entryFormat(entry) {
  return entry.map(item => {
    return {
      ...item,
      ...{ url: formatUrl(item.jumpAction) }
    };
  });
}

function format(payload) {
  const { cardContent, dataInfo } = payload;
  let other_info = JSON.parse(cardContent[1]),
    { headImg, textInfo, entry } = other_info.data.setting,
    hits = [];
  if (headImg) {
    hits.push({ type: "headImg", id: "headImg", pageData: headImg });
  }
  if (textInfo) {
    hits.push({ type: "textInfo", id: "textInfo", pageData: textInfo });
  }
  if (entry) {
    hits.push({ type: "entry", id: "entry", pageData: entryFormat(entry) });
  }
  return {
    id: dataInfo.cardId,
    resourceId: cardContent[3],
    hits
  };
}

export default format;
