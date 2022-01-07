function playPhone(payload) {
  let { tab, dataInfo: card } = payload;
  const tabs = {
    type: "tab",
    data: tab
  };
  const cardInfo = {
    type: "card",
    cardInfo: card
  };
  return [tabs, cardInfo];
}

export default payload => {
  return playPhone(payload);
};
