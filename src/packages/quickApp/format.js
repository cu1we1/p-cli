function format(payload) {
  const { dataInfo, cardContent, tab, cardInfo } = payload;
  const list = tab[0].tabItem.map((item, i) => {
    return {
      rId: item.resourceId,
      cpId: item.cpId,
      id: item.content[0],
      type: "hap",
      name: item.content[1],
      desc: item.content[2],
      transparent: JSON.stringify({
        contentId: item.content[0]
      }),
      direction: "row",
      tagText: "免安装",
      icon: item.pic[0],
      index: i + 1,
      size: "m",
      url: item.jumpActions[0].url
    };
  });

  return {
    cardName: cardInfo.title,
    cardId: dataInfo.cardId,
    title: cardContent[0],
    list
  };
}

export default format;
