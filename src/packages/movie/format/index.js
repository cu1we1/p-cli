import detailFormat from "./detail";
import nearbyCinemaFormat from "./nearbyCinema";
import commentFormat from "./comment";

export default payload => {
  let data = [];
  let minSeatPrice = "";
  let movieScore = "";
  if (Array.isArray(payload) && payload.length) {
    data = payload.map(item => {
      let dataCarrier;

      if (item && item.type === "detail") {
        dataCarrier = detailFormat(item);
        ({
          data: {
            headInfo: { minSeatPrice, remark: movieScore }
          }
        } = dataCarrier);
      }

      if (item && item.type === "nearbyCinema") {
        dataCarrier = nearbyCinemaFormat(item, minSeatPrice);
      }

      if (item && item.type === "comment") {
        dataCarrier = commentFormat(item, movieScore);
      }
      return dataCarrier;
    });
  }

  return data.filter(value => {
    if (
      !value.data ||
      value.data.length === 0 ||
      Object.keys(value.data).length === 0
    ) {
      return false;
    }
    return true;
  });
};
