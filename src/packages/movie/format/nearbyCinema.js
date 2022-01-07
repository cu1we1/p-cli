export default (nearbyCinema, minSeatPrice) => {
  const price = minSeatPrice;
  let { data } = nearbyCinema;

  if (data) {
    const { hasResult, showName, cinemas, quickApp } = data;

    data = {
      hasResult,
      showName,
      cinemasInfo: hasResult ? cinemas : { price },
      viewMoreHref: quickApp
    };

    if (hasResult && Array.isArray(cinemas) && cinemas.length === 0) {
      data = [];
    }
  }

  return {
    type: "nearbyCinema",
    data
  };
};
