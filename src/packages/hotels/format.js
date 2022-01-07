import { localStorage, jsonParse } from "@lego";

const formatDate = date => {
  if (!date) return "";
  const arr = date.split("-");
  let month = arr[1];
  let day = arr[2];
  if (month.startsWith("0")) {
    month = month.slice(1);
  }
  if (day.startsWith("0")) {
    day = day.slice(1);
  }

  return `${month}月${day}日`;
};

const mapping = {
  "100610": "domestic",
  "100611": "foreign"
};

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

export default (payload, { tname }) => {
  const type = mapping[tname];
  const {
    cardContent,
    dataInfo: { cardId, cpId },
    tab
  } = payload;
  const [
    location,
    checkIn,
    checkOut,
    lat,
    lon,
    poi,
    brand,
    star,
    mdsSearch,
    mdsQuery
  ] = cardContent;
  const [list, activity] = tab;
  let operation;
  if (activity) {
    const { tabItem, tabContent } = activity;
    const time = Number(tabContent[0]) || new Date().getTime();
    const activityId = tabContent[1];
    const activities = jsonParse(localStorage.getItem("hotelActivity"));
    const localData = getLocalById(activityId, activities);
    let hasClosed = false;
    if (localData && localData.isLocalHas) {
      const { deleteTime } = localData;
      hasClosed = time - deleteTime <= 24 * 60 * 60 * 1000;
    }
    operation = {
      activities,
      hasClosed,
      time,
      activityId,
      tabItem
    };
  }
  const head = {
    checkIn: formatDate(checkIn),
    checkOut: formatDate(checkOut),
    location,
    operation,
    lat,
    lon,
    poi,
    brand,
    star
  };

  return {
    type,
    data: {
      cardId,
      cpId,
      head,
      list,
      mdsSearch,
      mdsQuery
    }
  };
};
