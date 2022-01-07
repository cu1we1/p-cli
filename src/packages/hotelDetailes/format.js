function domestic(payload) {
  const {
    cardContent,
    jumpAction,
    picUrl,
    tab,
    dataInfo
  } = payload;
  const introduction = tab[0];
  const head = {
    name: cardContent,
    url: jumpAction,
    pics: picUrl,
    introduction
  };
  const booking = tab[1];
  const isHK = cardContent[cardContent.length - 1];
  let score = [];
  const cpDetailsInfo = [];
  if (booking) {
    const {
      tabItem
    } = booking;
    if (Array.isArray(tabItem) && tabItem.length > 0) {
      tabItem.forEach(item => {
        const {
          content: [cpName],
          cpId,
          resourceId,
          jumpActions: [href]
        } = item;
        if (href) {
          const {
            url
          } = href;
          cpDetailsInfo.push({
            cpName,
            cpId,
            resourceId,
            url
          });
        }
      });
    }
  }
  const scoreArr = [];
  if (tab[2] && tab[3]) {
    const {
      tabItem: item1
    } = tab[2];
    const {
      tabItem: item2
    } = tab[3];
    if (item1 < item2) {
      score = [tab[3], tab[2]];
    } else {
      score = [tab[2], tab[3]];
    }
    if (item1.length === 0 && item2.length === 0) {
      score = [];
    }
  }

  const nearby = tab[4];
  const resourceId = cardContent[cardContent.length - 1];

  score.forEach(item => {
    const {
      tabContent
    } = item;
    const [, , , hasComments] = tabContent;
    if (hasComments === "1") {
      scoreArr.push(item);
    }
  });
  return {
    type: "domestic",
    data: {
      head,
      booking,
      scoreArr,
      nearby,
      dataInfo,
      cpDetailsInfo,
      resourceId,
      isHK
    }
  };
}

function foreign(payload) {
  const {
    cardContent,
    jumpAction,
    picUrl,
    tab,
    dataInfo
  } = payload;
  const head = {
    name: cardContent,
    url: jumpAction,
    pics: picUrl
  };
  const booking = tab[1];
  const scoreArr = [];
  const nearby = tab[3];
  const resourceId = cardContent[cardContent.length - 1];
  const score = [tab[2]];
  const cpDetailsInfo = [];
  if (booking) {
    const {
      tabItem
    } = booking;
    if (Array.isArray(tabItem) && tabItem.length > 0) {
      tabItem.forEach(item => {
        const {
          content: [cpName],
          cpId,
          resourceId: singleResourceId,
          jumpActions: [href]
        } = item;
        if (href) {
          const {
            url
          } = href;
          cpDetailsInfo.push({
            cpName,
            cpId,
            resourceId: singleResourceId,
            url
          });
        }
      });
    }
  }
  score.forEach(item => {
    const {
      tabContent,
      tabItem
    } = item;
    const [, , , hasComments] = tabContent;
    if (hasComments === "1" && tabItem.length > 0) {
      scoreArr.push(item);
    }
  });

  return {
    type: "foreign",
    data: {
      head,
      booking,
      scoreArr,
      nearby,
      dataInfo,
      cpDetailsInfo,
      resourceId
    }
  };
}

const MAPPING = {
  "100608": domestic,
  "100609": foreign
};

export default (payload, {
  tname
}) => {
  return MAPPING[tname](payload);
};