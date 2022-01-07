export default payload => {
  const { quickApp: viewMoreHref } = payload;
  const { itemId } = payload;
  let { movies } = payload;

  if (Array.isArray(movies) && movies.length) {
    movies = movies.slice(0, 5).map(item => {
      const {
        poster,
        showName,
        soldType,
        openTime,
        quickApp,
        showMark,
        wantCount,
        buyQuickApp,
        leadingRole,
        minSeatPrice,
        remark,
        id
      } = item;

      return {
        poster,
        showName,
        soldType,
        openTime,
        movieDetailsHref: quickApp,
        showMark,
        wantCount,
        buyTicketsHref: buyQuickApp,
        leadingRole,
        minSeatPrice,
        remark,
        id
      };
    });
  }
  return {
    movies,
    viewMoreHref,
    itemId
  };
};
