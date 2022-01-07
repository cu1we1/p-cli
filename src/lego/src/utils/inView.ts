const inViewBox = (
  rect: DOMRect,
  threshold = 10
): { in: boolean; tb: string; rl: string } => {
  const viewPortRect = {
    top: 0,
    bottom: document.documentElement.clientHeight,
    left: 0,
    right: document.documentElement.clientWidth
  };

  if (!rect.height || !rect.width) {
    return {
      in: false,
      tb: "00",
      rl: "00"
    };
  }

  const bottom = +(rect.bottom > viewPortRect.top + threshold);
  const top = +(rect.top < viewPortRect.bottom - threshold);
  const left = +(rect.left < viewPortRect.right - threshold);
  const right = +(rect.right > viewPortRect.left + threshold);

  return {
    in: !!(top && right && bottom && left),
    tb: `${top}${bottom}`,
    rl: `${right}${left}`
  };
};

export default inViewBox;
