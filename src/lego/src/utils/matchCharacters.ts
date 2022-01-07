import {
  clipAndHighLight,
  highLight,
  stringLength,
  substr,
  strReverse
} from "./toolKit";

const matchCharacters = (
  str,
  query,
  count,
  rowNum = 1,
  className = "cl_price"
) => {
  if (!str || !query) {
    return str;
  }
  if (count) {
    return clipAndHighLight(str, query, count, className);
  } else {
    return `<p class="lc${rowNum}">${highLight(str, query, className) ||
      str}</p>`;
  }
};
export default matchCharacters;

//单纯高亮关键字
export const highLightQuery = (str, query, className = "cl_price") => {
  if (str && query) {
    return `<span >${highLight(str, query, className)}</span>`;
  }
  return str;
};

const _clipAndHighLight = function(str, q, count) {
  let clipStr = "";
  const newStr = str.toLowerCase();
  const newQ = q.toLocaleLowerCase();
  const pos = newStr.indexOf(newQ);
  if (!str || !q || pos < 0)
    return {
      str,
      query: q
    }; // 无飘红的字段，向后截断
  const length = stringLength(str); // 字符长度
  const qLength = stringLength(q); // q字符长度
  const originL = q.length; // 原始q长度
  const limit = count - qLength;
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
  return {
    str: clipStr,
    query: originQ
  };
};
//HTML标签转义（<  &lt;）
const html2Escape = function(sHtml) {
  return sHtml.replace(/[<&"]/g, function(c) {
    return {
      "<": "&lt;",
      "&": "&amp;",
      '"': "&quot;"
    }[c];
  });
};
const regSymbols = [
  "\\",
  "^",
  "$",
  "*",
  "+",
  "?",
  "{",
  "}",
  ",",
  ".",
  "(",
  ")",
  "|",
  "-",
  "[",
  "]"
];
export const highLightApp = (
  str,
  query,
  rowNum = 1,
  count = 0,
  className = "cl_price"
) => {
  let _str = html2Escape(str),
    _query = query;
  if (count) {
    const result = _clipAndHighLight(html2Escape(str), query, count);
    _str = result.str;
    _query = result.query;
  }
  if (_str && _query) {
    let querys = _query.split(""),
      regMatch = "([^\\u4e00-\\u9fa5|^A-Za-z0-9]+|[\\u00a0\\u0020\\u3000 ]*)",
      regStr = "";
    querys.forEach((item, idx) => {
      let _item = item;
      if (regSymbols.includes(item)) {
        _item = `\\${item}`;
      }
      idx !== querys.length - 1
        ? (regStr += _item + regMatch)
        : (regStr += _item);
    });
    regStr += "";
    let reg = new RegExp(regStr, "ig");
    return `<p class="lc${rowNum}">${_str.replace(
      reg,
      w => `<em style="display: inline;" class=${className} >${w}</em>`
    )}</p>`;
  } else {
    return _str;
  }
};
