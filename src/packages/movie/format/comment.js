export default (comment, movieScore) => {
  let { data } = comment;
  const score = movieScore;

  if (data) {
    const { count, quickApp, showName, commentResultList, itemId } = data;

    data = {
      count,
      href: quickApp,
      showName,
      commentResultList,
      score,
      itemId
    };
  }
  return {
    type: "comment",
    data
  };
};
