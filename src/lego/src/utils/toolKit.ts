import { browserInfo } from "../sdk/sync";
import { RAF } from "./scheduler";

const { appVersion, theme } = browserInfo;
const escapeRegExp = (str: string) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

interface jumpAction {
  mode?: number;
  url?: string;
  pkg?: string;
  click_type?: number;
}

interface cardInfo {
  tab: Array<object>;
}

interface urlParams {
  title?: string;
  mode?: string;
}

interface ScrollToOptions {
  duration?: number;
  callback?: () => any;
}

/* eslint-disable */
function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}
/* eslint-enable */

// 单jumpAction转url
function jumpActionToUrl(jumpAction: jumpAction, params: urlParams = {}) {
  // 兼容7.1.0客户端bug，产品同意
  const defaultMode =
    appVersion && appVersion.indexOf("7.1.0") === 0 ? "project" : "page";
  const { title, mode = defaultMode } = params;
  if (!jumpAction || !jumpAction.mode) return "";
  switch (jumpAction.mode) {
    case 1:
      return { h5: { url: jumpAction.url, mode: "project", title } };
    case 2:
      return { deeplink: { url: jumpAction.url, pkg: jumpAction.pkg } };
    case 3:
      return { hap: jumpAction.url };
    default:
      return { h5: { url: jumpAction.url, mode, title } };
  }
}

// 需传多url的情况
function multiUrl(jumpActions: Array<jumpAction>) {
  const urls = {};
  jumpActions.forEach(jumpAction =>
    Object.assign(urls, jumpActionToUrl(jumpAction))
  );
  return urls;
}

function stringLength(fData: string) {
  let intLength = 0;
  for (let i = 0; i < fData.length; i += 1) {
    if (fData.charCodeAt(i) < 0 || fData.charCodeAt(i) > 255) intLength += 2;
    else intLength += 1;
  }
  return intLength;
}

// 定位到指定位置
function scrollTo(offsetY: number = 0, options: ScrollToOptions = {}) {
  const { duration = 500, callback } = options;
  const startTime = Date.now();
  const pageOffset = window.pageYOffset;

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      window.pageYOffset,
      offsetY,
      duration
    );
    window.scrollTo(window.pageXOffset, nextScrollTop);
    if (time < duration) {
      RAF(frameFunc);
    } else if (typeof callback === "function") {
      callback();
    }
  };
  if (pageOffset > offsetY) {
    RAF(frameFunc);
  }
}

function substr(str: string, start: number, count: number) {
  let len = 0;
  let tmpStr = "";
  for (let i = start; i < str.length; i += 1) {
    // 遍历字符串
    if (/[\u4e00-\u9fa5]/.test(str[i])) {
      // 中文 长度为两字节
      len += 2;
    } else {
      len += 1;
    }
    if (len > count) {
      break;
    } else {
      tmpStr += str[i];
    }
  }
  return tmpStr;
}

function strReverse(str: string) {
  if (!str || typeof str !== "string") return str;
  return str
    .split("")
    .reverse()
    .join("");
}

function highLight(str: string, q: string, className: string = "cl_price") {
  if (!str || !q) return "";
  return str.replace(
    new RegExp(escapeRegExp(q), "ig"),
    w => `<em class=${className}>${w}</em>`
  );
}

// 这里的count通过Math.floor(容器宽度 % 字体大小) * 2来确定
function clipAndHighLight(
  str: string,
  q: string,
  count: number,
  className: string = "cl_price"
) {
  let clipStr = "";
  const newStr = str.toLowerCase();
  const newQ = q.toLocaleLowerCase();
  const pos = newStr.indexOf(newQ);
  if (!str || !q || pos < 0) return `<p class="lc1">${str}</p>`; // 无飘红的字段，向后截断
  const length = stringLength(str); // 字符长度
  const qLength = stringLength(q); // q字符长度
  const originL = q.length; // 原始q长度
  const limit = count - qLength;
  const nClassName = className || "cl_price";
  const half = Math.floor(limit / 2);
  const originQ = str.slice(pos, pos + originL);
  if (length <= limit) {
    // 无需截断
    clipStr = str;
  } else {
    const pre = str.slice(0, pos);
    let append = str.slice(pos + originL);
    let reversePre = strReverse(pre);
    const preL = stringLength(pre);
    const appendL = stringLength(append);
    if (pos > limit * 0.6 && appendL < half) {
      // 向前截断
      reversePre = strReverse(
        substr(reversePre, 0, limit - appendL - qLength - 2)
      );
      clipStr = `...${reversePre}${originQ}${append}`;
    } else if (pos < limit * 0.4) {
      // 向后截断
      clipStr = str;
    } else {
      // 中间截断
      reversePre = strReverse(substr(reversePre, 0, preL > half ? half : preL));
      append = substr(append, 0, appendL > half ? half : appendL);
      clipStr = `...${reversePre}${originQ}${append}${
        appendL > half ? "..." : ""
      }`;
    }
  }
  return `<p class="lc1">${highLight(clipStr, originQ, nClassName)}</p>`;
}

function isEmptyResult(cards: Array<cardInfo>) {
  const result = cards.filter(item => item.tab.length);
  if (result.length) return false;
  return true;
}

function changeBodyBgWithTheme() {
  // 1是暗色，0是正常
  if (!theme) {
    document.body.style.backgroundColor = "#fff";
  } else {
    document.body.style.backgroundColor = "#000";
  }
}

function eTrigger(action: string, detail: Object = {}) {
  /* eslint-disable */
  const evt = new CustomEvent(action, { detail });
  /* eslint-enable */
  window.dispatchEvent(evt);
}

export {
  jumpActionToUrl,
  stringLength,
  scrollTo,
  substr,
  strReverse,
  highLight,
  isEmptyResult,
  multiUrl,
  changeBodyBgWithTheme,
  clipAndHighLight,
  eTrigger
};
