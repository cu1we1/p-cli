const isFontColor = value =>
  ["darkest", "darker", "dark", "normal", "light", "lighter"].includes(value);
const isFontSize = value =>
  ["xs", "s", "m", "l", "xl", "xxl", "xxxl"].includes(value);
const isWeight = value => ["bold", "medium", "normal", "light"].includes(value);
const isAlign = value => ["left", "center", "right"].includes(value);
const isColor = value => ["primary", "price", "vip"].includes(value);
const isTagSize = value => ["m", "s", "l"].includes(value);
const isTagColor = value =>
  ["primary", "price", "vip", "douban"].includes(value);

export {
  isFontColor,
  isFontSize,
  isWeight,
  isAlign,
  isColor,
  isTagSize,
  isTagColor
};
