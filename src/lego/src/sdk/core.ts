import wv from "@cpc/lib-search-jsapi/dist/wv.esm";
export interface kvType {
  [k: string]: any;
}
const isClientEvn = wv.supportHeytapApi;
(<kvType>window).gs_front_cache = {};

/**
 * 缓存某些同步JSAPI结果。
 * @param methodName 需要缓存结果的JSAPI方法名
 * @param category 需要缓存的结果key
 * @param value 缓存的结果
 * @returns "0" | "1"
 */
const frontCache = (
  methodName: string,
  category: string,
  value: string
): "0" | "1" => {
  if (!(methodName && category && value !== undefined)) return "0";
  if ((<kvType>window).gs_front_cache[methodName]) {
    (<kvType>window).gs_front_cache[methodName][category] = value;
    return "1";
  } else {
    (<kvType>window).gs_front_cache[methodName] = {
      [category]: value
    };
    return "1";
  }
};

/**
 * 获取本地缓存的JSAPI结果。
 * @param methodName 需要缓存结果的JSAPI方法名
 * @param category 需要缓存的结果key
 * @returns string
 */
const getValueFromCache = (methodName: string, category: string): string => {
  if (!(methodName && category)) return "";
  return (
    (<kvType>window).gs_front_cache[methodName] &&
    (<kvType>window).gs_front_cache[methodName][category]
  );
};

/**
 * 获取同步接口数据
 * @param name JSAPI方法名
 * @param result JS-SDK返回的数据
 * @returns result.data
 */
const getSyncInvokeData = (
  name: string,
  result: {
    code: number;
    message: string;
    data?: string;
  }
): any => {
  try {
    if (!result) return "";
    const { code, data, message } = result;
    if (code === 0) {
      return data;
    } else {
      console.error(`${name}-${message}`);
      return "";
    }
  } catch (error) {
    console.error(`${name}-${error}`);
    return "";
  }
};

/**
 * format异步函数的返回值。
 * @param callback 回调函数
 * @returns format以后的回调
 */
const getAsyncInvokeData = (
  callback: Function
): ((result: { code: number; data?: string }) => {}) => {
  return function(result: { code: number; data?: string }) {
    if (!result) return "";
    const { code, data } = result;
    if (code === 0) {
      callback(data);
    } else {
      callback(data);
    }
  };
};

export {
  getAsyncInvokeData,
  getSyncInvokeData,
  isClientEvn,
  frontCache,
  getValueFromCache
};
