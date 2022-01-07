export default detail => {
  let { data } = detail;
  if (data) {
    const {
      backgroundPicture,
      description,
      id,
      minSeatPrice,
      buyQuickApp,
      openTime,
      poster,
      showMark,
      showName,
      soldType,
      showType,
      wantCount,
      remark,
      actors,
      directors,
      quickApp,
      detailItemId
    } = data;

    let actorsList = [].concat(directors || []).concat(actors || []);
    const viewMoreHref = quickApp;
    const buyHref = buyQuickApp;
    const headInfo = {
      backgroundPicture: backgroundPicture || poster,
      description,
      id,
      minSeatPrice,
      openTime,
      buyHref,
      viewMoreHref,
      poster,
      showMark,
      showName,
      soldType,
      movieType: showType,
      wantCount,
      remark,
      detailItemId
    };

    actorsList = actorsList.map(item => {
      const { name, avatar, profession, quickApp: href, roleName } = item;
      const quickAppHref = href;
      let cast = "演员";

      if (profession) {
        cast = "导演";
      } else if (roleName) {
        cast = `饰${roleName}`;
      }

      return {
        name,
        avatar,
        quickAppHref,
        cast
      };
    });

    if (actorsList.length > 5) {
      actorsList = actorsList.slice(0, 8);
      actorsList.push({ viewMoreHref });
    }

    data = {
      headInfo,
      actorsList,
      viewMoreHref
    };
  }

  return {
    type: "detail",
    data
  };
};
