import { localStorage, jsonParse } from "@lego";
import { formatUrl } from "@lego";

function getLocalById(id, activities) {
  let deleteTime;
  if (Array.isArray(activities) && activities.length) {
    activities.some(item => {
      if (item[id]) {
        deleteTime = item[id];
      }
      return !!item[id];
    });
  }

  return {
    isLocalHas: !!deleteTime,
    deleteTime
  };
}

function formatPic(otherInfo) {
  if (!otherInfo) return {};
  const { data, ...rest } = otherInfo;
  const list = [];
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(item => {
      const {
        jumpAction,
        img,
        resourceName,
        resourceProvider,
        resourceId,
        ...restItem
      } = item;
      if (jumpAction && img && resourceName && resourceProvider && resourceId) {
        const hrefObj = formatUrl(jumpAction);
        const { click_type: resourceSource } = (jumpAction &&
          jumpAction[0]) || {
          click_type: ""
        };
        list.push({
          hrefObj,
          resourceSource,
          resourceName,
          resourceProvider,
          resourceId,
          img,
          ...restItem
        });
      }
    });
  }
  return {
    hasData: list.length > 0,
    picStyle: 0,
    list,
    ...rest
  };
}

export default payload => {
  const activities = jsonParse(localStorage.getItem("activityTemplates"));
  const { cardContent } = payload;
  const style = Number(cardContent[0]);
  const otherInfo = jsonParse(cardContent[1]);
  const closeAble = Number(otherInfo.closeAble);
  const time = Number(cardContent[2]);
  const id = Number(cardContent[3]);
  const localData = closeAble && getLocalById(id, activities);
  const nowDate = time || new Date().getTime();
  let hasClosed = false;
  let data;

  if (localData && localData.isLocalHas) {
    const { deleteTime } = localData;
    hasClosed = nowDate - deleteTime <= 24 * 60 * 60 * 1000;
  }

  if (style === 0) {
    data = formatPic(otherInfo);
  }

  return {
    id,
    hasClosed,
    type: "pic",
    data,
    nowDate,
    activities
  };
};
