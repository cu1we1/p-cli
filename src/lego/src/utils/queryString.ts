function decodeUrl(s: string) {
  return decodeURIComponent(s.replace(/\+/g, " "));
}

function parse(query: string = "") {
  const ret: { [k: string]: string } = {};
  const vars = query
    .trim()
    .replace(/^(#\/\?|\?|#|&)/, "")
    .replace(/[^?]*\?/, "")
    .split("&");
  let pair: Array<string>;

  vars.forEach(item => {
    if (item) {
      pair = item.split("=");
      ret[decodeUrl(pair[0])] = decodeUrl(pair[1] || "");
    }
  });

  return ret;
}

function stringify(data: { [k: string]: string | [] } = {}, url: string = "") {
  let ret = "";
  if (Object.prototype.toString.call(data) === "[object Object]") {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            ret += `&${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
          });
        } else {
          ret += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      }
    });
  }

  return url ? (url + ret).replace(/[&?]{1,2}/, "?") : ret.substr(1);
}

/* eslint-disable no-eval */
function jsonParse(input: string) {
  let result: any;
  try {
    result = JSON.parse(input || "null");
  } catch (e) {
    result = null;
  }
  return result;
}
/**
 * 获取url里面的key对应的值
 * @param key 需要获取值的key
 * @param url 需要比对的url，默认为location.serach
 * @returns string | ''
 */
function getUrlSingleParam(key: string, url = location.search): string {
  const reg = new RegExp(`(\\?|&)${key}=([^&]*)(&|$)`);
  const r = url.match(reg);
  if (r !== null) {
    return r[2];
  }
  return "";
}

export { parse, stringify, jsonParse, getUrlSingleParam };
