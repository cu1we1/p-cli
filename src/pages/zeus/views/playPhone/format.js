function playPhone(payload) {
  const { cards } = payload;
  const phone =
    cards &&
    cards.find(item => item.dataInfo && item.dataInfo.cardId === "280101");
  let { tab } = phone;
  const tabs = {
    type: "tab",
    data: tab
  };
  return [tabs];
}

export default payload => {
  return playPhone(payload);
};
