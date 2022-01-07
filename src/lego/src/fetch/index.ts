/* eslint-disable no-param-reassign */
import { isNetworkAvailable, browserInfo } from "../sdk/sync";
import { stringify } from "../utils/queryString";
import uuid from "../utils/uuid";

type kvType = { [k: string]: any };
const { fetch, setTimeout } = <kvType>window;
// 网络异常
const NETWORK_CODE_ERROR = 1000;
// 超时
const NETWORK_CODE_TIMEOUT = 2000;
// 网络不可用
const NETWORK_CODE_UNAVAILABLE = 3000;
// pb相关错误
// const PB_CODE_ERROR = 4000;

const PID = "10002_10001";

// 客户端隐私合规相关参数
const { encryptResult: XUA, sIv: SIV, sKey: SKEY } = browserInfo;

// todo 如何真正abort掉请求 减少网络通道的链接数 AbortController chrome62
class FetchError extends Error {
  public code: number;

  public constructor({ message = "", code = 1000 }) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

function abortableFetch(fetchPromise: Promise<void>, timeout: number) {
  let abortFn: Function;
  let timeOutId = setTimeout(() => {
    if (timeOutId === 0) {
      return;
    }
    abortFn(
      new FetchError({
        message: "request timeout",
        code: NETWORK_CODE_TIMEOUT
      })
    );
  }, timeout);

  const abortPromise = new Promise((resolve, reject) => {
    abortFn = (e: Error) => {
      timeOutId = 0;
      reject(e);
    };
  });

  const abortablePromise: Promise<void> | { abort: Function } = Promise.race([
    fetchPromise,
    abortPromise
  ])
    .then(
      (res: any) => res.json(),
      e => {
        let error = new FetchError({
          message: "request error",
          code: NETWORK_CODE_ERROR
        });
        if (!isNetworkAvailable()) {
          error = new FetchError({
            message: "network not avaliable",
            code: NETWORK_CODE_UNAVAILABLE
          });
        } else if (e && e.code === NETWORK_CODE_TIMEOUT) {
          error = e;
        }

        return Promise.reject(error);
      }
    )
    .finally(() => {
      timeOutId = 0;
    });
  // todo
  // abortablePromise.abort = abortFn;

  return abortablePromise;
}

function getUri(url = "", params = {}) {
  let uri = url;

  if (params) {
    if (url.indexOf("?") === -1) {
      uri += "?";
    }

    uri = `${uri}${stringify(params)}`;
  }

  return uri;
}

function getFecthParams(url = "", params = {}) {
  const xua = XUA;
  const uri = getUri(url, params);
  const xparams = encodeURIComponent(
    JSON.stringify({
      pid: PID,
      search_id: uuid(),
      client_time: new Date().getTime()
    })
  );

  return {
    uri,
    xparams,
    xua
  };
}

function post(url = "", { params = {}, data = {}, timeout = 5000 } = {}) {
  const fetchParams = getFecthParams(url, params);
  const fetchPromise = fetch(fetchParams.uri, {
    method: "POST",
    body: JSON.stringify({
      "X-KKBrowser-UA": fetchParams.xua,
      "X-Search-Params": fetchParams.xparams,
      s_iv: SIV,
      s_key: SKEY,
      ...data
    })
  });
  return abortableFetch(fetchPromise, timeout);
}
/* eslint-disable no-console */

function get(url = "", { params = {}, timeout = 5000 } = {}) {
  const fetchParams = getFecthParams(url, params);
  const fetchPromise = fetch(fetchParams.uri, {
    method: "GET",
    headers: {
      "X-KKBrowser-UA": fetchParams.xua,
      "X-Search-Params": fetchParams.xparams,
      s_iv: SIV,
      s_key: SKEY
    }
  });
  return abortableFetch(fetchPromise, timeout);
}

export { post, get };
