var OLDAPI = [
  {
    namespace: "oppoDownload",
    namespaceUnion: "heytapDownload",
    methods: [
      {
        name: "download"
      },
      {
        name: "onSync"
      },
      {
        name: "supportMarkDownload"
      },
      {
        name: "queryDownloadState"
      },
      {
        name: "sync"
      }
    ]
  },
  {
    namespace: "heytapClientCall",
    methods: [
      {
        name: "onLogined"
      },
      {
        name: "sendComment"
      },
      {
        name: "delComment"
      },
      {
        name: "pageAnchor"
      }
    ]
  }
];

const SUCCESS_CODE = 0; // 成功
const FAIL_CODE = -1; // 失败
const noop = function () {};

const DEFAULT_OPTION = {
  //默认配置
  debug: false,
  promise: false, // 是否使用 promise 返回结果
  onError: noop
};

// 保存调用客户端hasApi的结果
let heyTapApiObj = {};
// 保存旧的api list，不暴露出去
let oldApiList = [];
// 保存特殊处理的aip
let specialApiObj = {};

class CoreJsapi {
  get eventListenerHandler() {
    return {
      add: this.eventListenerTarget.add?.bind(window.HeytapApi),
      remove: this.eventListenerTarget.remove?.bind(window.HeytapApi),
      dispatch: this.eventListenerTarget.dispatch?.bind(window.HeytapApi)
    };
  }

  get eventListenerTarget() {
    return {
      add:
        (window.HeytapApi && window.HeytapApi.registOn) ||
        window.HeytapApi.registerEvent,
      remove:
        (window.HeytapApi && window.HeytapApi.removeOn) ||
        window.HeytapApi.removeEvent,
      dispatch:
        (window.HeytapApi && window.HeytapApi.dispatchOn) ||
        window.HeytapApi.dispatchEvent
    };
  }

  get broadcastListenerHandler() {
    return {
      add: this.broadcastListenerTarget.add?.bind(window.HeytapApi),
      remove: this.broadcastListenerTarget.remove?.bind(window.HeytapApi),
      dispatch: this.broadcastListenerTarget.dispatch?.bind(window.HeytapApi)
    };
  }

  get broadcastListenerTarget() {
    return {
      add: window.HeytapApi && window.HeytapApi.registOnBroadcast,
      remove: window.HeytapApi && window.HeytapApi.broadcast,
      dispatch: window.HeytapApi && window.HeytapApi.removeOnBroadcast
    };
  }

  constructor(oldApi = [], specialApi = {}, newApi, clientApi) {
    // 通用处理逻辑api列表, 以空间名区分的对象形式定义,对象中包含空间名、空间别名、挂载在该空间名下的方法名对象列表
    oldApiList = oldApi;

    // 特殊处理逻辑api列表
    specialApiObj = specialApi;
    this.newApiObj = newApi;
    this.callbackMap = {}; // 客户端调用的前端回调map
    this.increment = 0;
    this.apiOption = DEFAULT_OPTION;
    this.supportHeytapApi = window.HeytapApi && window.HeytapApi.invokeApi; // 是否支持 HeytapApi 对象
    this.asyncPromise = false; // 某个 api 是否不受全局config 中的 promise 约束, 采用异步调用
    this.initComplete = false; //是否初始化覆盖默认的apiOption

    if (this.supportHeytapApi) {
      window.HeytapApi = window.HeytapApi || {};
      window.HeytapApi._callback = this.callback.bind(this);
    }

    Object.keys(clientApi).forEach(item => {
      clientApi[item].apply(this);
    });
  }

  /* 初始化配置 */
  config(option) {
    if (this.initComplete) {
      return this.notifyError("请勿重复初始化SDK");
    }
    this.apiOption = Object.assign(DEFAULT_OPTION, option);
    this._initError();
    this.initComplete = true;
    return this;
  }

  /**
   * 客户端调用, 用于调用 API 后客户端调用前端的回调
   * 客户端传入的 params 是 json 字符串,  code 状态码, message 相关信息, data 为传入回调的参数, 由前端定义的回调自行处理
   */
  callback(callId, params) {
    params = this._parseResult(params);
    if (params.data) {
      params.data = this._parseResult(params.data);
    }
    this.callbackMap[callId] && this.callbackMap[callId](params);

    // 如果类型为数字形式的callId, 调用后删除 callbackMap 中定义的对应回调,否则为用户方通过 register定义的客户端主动调用方法, 调用后不删除
    if (typeof callId === "number") {
      delete this.callbackMap[callId];
    }
  }

  /* 注册客户端主动调用的回调 */
  register(actionName, callbackFunction) {
    if (!actionName) {
      this.errorHandler("注册回调的名称不能为空");
      return;
    }

    if (!callbackFunction || typeof callbackFunction !== "function") {
      this.errorHandler("注册回调的函数不能为空");
      return;
    }
    this.callbackMap[actionName] = callbackFunction;
  }

  /* 判断客户端是否支持某个方法调用, 传入字符串形式的方法名，新方法名后续必须带上categroy，目前暂时可以接受不带category */
  isMethodValid(method) {
    if (!method || typeof method !== "string") {
      return false;
    }

    //新api强制要求传入category，如果只传方法名时，当做旧api处理，
    //后续把旧的api也mapping到新的category以后，则判断条件改为先判断是否旧的api，false再判断是否新的api
    // if (method.indexOf('.') < 0) { // method只传入方法名时
    //   return this._isOldApi(method);
    // }

    if (window.HeytapApi && window.HeytapApi.hasApi) {
      //支持 HeytapApi.hasApi 查询
      if (!this._isHeytapApi(method)) {
        return this._isOldApi(method);
      }
      return true;
    } else {
      return this._isOldApi(method);
    }
  }

  _initError() {
    if (typeof this.apiOption.onError !== "function") {
      this.apiOption.onError = noop;
    }
    this.apiOption.onError = (function (context, callback) {
      return function (msg) {
        context.apiOption.debug && context.debugLog(msg);
        callback(msg);
      };
    })(this, this.apiOption.onError);
  }

  //判断是否旧的api
  _isOldApi(method) {
    // 传统 window 下方法的判断
    let isValid = false;
    oldApiList.some(category => {
      let spaceName = category.namespace; // 空间名
      let spaceNameAlias = category.namespaceUnion; // 空间别名
      let methodList = category.methods; // 空间下的方法名列表

      methodList.some(api => {
        let methodname = api.name; // 方法名
        let methodnameAlias = api.nameAlias; // 别名
        if (method === methodname || method === methodnameAlias) {
          if (
            (window[spaceName] && window[spaceName][methodname]) ||
            (window[spaceNameAlias] && window[spaceNameAlias][methodname]) ||
            (window[spaceName] && window[spaceName][methodnameAlias]) ||
            (window[spaceNameAlias] && window[spaceNameAlias][methodnameAlias])
          ) {
            isValid = true;
            return true;
          }
        }
      });
      if (isValid) {
        return true;
      }
    });
    return isValid;
  }

  //获取调用客户端hasApi的结果，目前支持method不带category，后续method必须带上category
  _isHeytapApi(method) {
    if (!method || typeof method !== "string") {
      return false;
    }

    //method只传入方法名时
    // if (method.indexOf('.') < 0) {
    //   return false;
    // }

    // 判断method是否包含category
    if (method.indexOf(".") < 0) {
      let category = this.newApiObj && this.newApiObj[method];
      if (!category) {
        return false;
      } else {
        method = `${category["newspace"]}.${category["originalname"]}`;
      }
    }

    // 缓存不存在
    if (!heyTapApiObj[method]) {
      //返回值为：{code: 0, data: true/false}
      let res = this._parseResult(window.HeytapApi.hasApi(method));
      heyTapApiObj[method] = res;
    }

    if (heyTapApiObj[method]["code"] === 0) {
      return heyTapApiObj[method]["data"];
    } else {
      return false;
    }
  }

  /* 前端调用核心逻辑 */
  invoke() {
    let args = [].slice.call(arguments);
    if (this.supportHeytapApi) {
      let isHeytapApi = this._isHeytapApi(args[0]);
      if (isHeytapApi) {
        return this._invokeApi(args);
      } else {
        return this._invokeOldVersion(args);
      }
    } else {
      return this._invokeOldVersion(args);
    }
  }

  /* 存在 HeytapApi 调用 */
  _invokeApi(args) {
    let method = args.shift(); // 获取第一个参数, String, 有可能是 [新标准空间名.方法名] 或 [方法名]的形式
    let specInfo = {}; // 方法相关信息, newspace, originalname 等

    // 目前默认为 [新标准空间名.方法名] 调用, 也支持 [方法名] 形式调用，
    // 后续改为只支持 [新标准空间名.方法名] 调用, 不支持 [方法名] 形式调用
    if (method.indexOf(".") < 0) {
      specInfo = (this.newApiObj && this.newApiObj[method]) || "";
      if (!!specInfo) {
        method = `${specInfo.newspace}.${specInfo.originalname}`; // 支持方法别名, 传入原始方法名
      } else {
        this.errorHandler("不支持的方法名");
      }
    }

    if (typeof args[args.length - 1] === "function") {
      /* 最后一个参数是函数，客户端需回调前端定义的回调 */
      let callback = args.pop();
      try {
        // this.callbackMap[this.increment++] = callback
        this.increment++;
        this.callbackMap[(specInfo && specInfo.callId) || this.increment] =
          resultObj => {
            resultObj = this._parseResult(resultObj);
            callback(resultObj);
          };
        window.HeytapApi.invokeApi(
          method,
          JSON.stringify(args),
          this.increment
        );
      } catch (error) {
        this.errorHandler("方法调用出错");
      }
    } else if (this.asyncPromise || this.apiOption.promise) {
      /* 异步调用逻辑 */
      this.asyncPromise = false;
      return new Promise((resolve, reject) => {
        this.increment++;
        this.callbackMap[(specInfo && specInfo.callId) || this.increment] =
          resultObj => {
            resultObj = this._parseResult(resultObj);
            if (resultObj.code === 0) {
              resolve(resultObj);
            } else {
              reject(resultObj);
            }
          };
        window.HeytapApi.invokeApi(
          method,
          JSON.stringify(args),
          this.increment
        );
      });
    } else {
      // 最后一个参数不是函数, 表示为同步调用
      let resultObj = window.HeytapApi.callApi(method, JSON.stringify(args));
      return this._parseResult(resultObj); // 客户端返回的数组以 { code: 0; data: ''} 形式返回
    }
  }

  /* 旧版本 window.空间名.方法名 形式调用 */
  _invokeOldVersion(params) {
    let firstParam = params.shift();
    let apiName; // 方法名
    let spaceName; // 空间名
    if (firstParam.indexOf(".") < 0) {
      // 第一个参数只传入方法名时
      apiName = firstParam;
    } else {
      apiName = firstParam.split(".")[1];
    }

    let hasFound = false;
    oldApiList.some(category => {
      let methodList = category.methods;
      methodList.some(api => {
        let method = api.name;

        // 为了兼容旧方法多端 API 名称的别名
        let methodAlias = api.nameAlias;

        // 确定方法挂载的命名空间，两个命名空间不会同时存在
        if (method === apiName || methodAlias === apiName) {
          spaceName = window[category.namespaceUnion]
            ? category.namespaceUnion
            : category.namespace;
          apiName = window[spaceName][methodAlias] ? methodAlias : method;
          hasFound = true;
          return true;
        }
      });
      if (hasFound) {
        return true;
      }
    });

    // 如果传入回调函数
    let callback;
    if (params.length > 0 && typeof params[params.length - 1] === "function") {
      callback = params.pop();
    }

    let resultObj = {};
    if (specialApiObj[apiName]) {
      let callMethod = specialApiObj[apiName].bind(this);
      if (typeof callback === "function") {
        //指定回调函数
        return callMethod(spaceName, params, callback);
      } else if (this.asyncPromise || this.apiOption.promise) {
        this.asyncPromise = false;
        return new Promise((resolve, reject) => {
          callMethod(spaceName, params, res => {
            res = this._parseResult(res);
            if (res.code === SUCCESS_CODE) {
              resolve(res);
            } else {
              reject(res.msg);
            }
          });
        });
      } else {
        //没有指定回调函数
        return callMethod(spaceName, params);
      }
    } else {
      try {
        // 通用api处理逻辑
        let result;
        if (params && params.length > 0) {
          params.forEach((item, index) => {
            if (Object.prototype.toString.call(item) === "[object Object]") {
              params[index] = JSON.stringify(item);
            }
          });
          result = window[spaceName][apiName](...params);
        } else {
          result = window[spaceName][apiName]();
        }

        resultObj = {
          code: SUCCESS_CODE,
          data: this._parseResult(result)
        };

        if (typeof callback === "function") {
          // 指定了回调函数，优先
          return callback(resultObj);
        } else if (this.asyncPromise || this.apiOption.promise) {
          this.asyncPromise = false;
          return new Promise(function (resolve, reject) {
            resolve(resultObj);
          });
        } else {
          return resultObj;
        }
      } catch (e) {
        resultObj = {
          code: FAIL_CODE,
          data: ""
        };
        console.log(e);
      } finally {
        return resultObj;
      }
    }
  }

  /* 全局 config.promise 设置为 true 情况下, 某个 api 以异步方式调用时使用  */
  asyncInvoke() {
    this.asyncPromise = true;
    return this.invoke(...arguments);
  }

  // 增加事件监听
  on(eventName, callback = noop) {
    if (!eventName) {
      return;
    }
    this.callbackMap[eventName] = callback;
    this.eventListenerHandler.add(eventName, eventName);
  }

  // 取消事件监听
  removeOn(eventName) {
    if (!eventName) {
      return;
    }
    this.eventListenerHandler.remove(eventName);
    delete this.callbackMap[eventName];
  }

  // 监听页面广播
  onBroadcast(broadcast, callback = noop) {
    if (!broadcast) {
      return;
    }
    this.callbackMap[broadcast] = callback;
    // 向webview注册一个广播事件
    this.broadcastListenerHandler.add(broadcast, broadcast);
  }

  // 发送页面广播
  broadcast(broadcast, args) {
    if (!broadcast || !this.callbackMap[broadcast]) {
      return;
    }
    this.broadcastListenerHandler.dispatch(broadcast, JSON.stringify(args));
  }

  // 取消页面广播监听
  removeOnBroadcast(broadcastName) {
    if (!broadcastName) {
      return;
    }
    this.broadcastListenerHandler.remove(broadcastName);
    delete this.callbackMap[broadcastName];
  }

  errorHandler(msg) {
    console.warn(msg);
  }

  notifyError(error) {
    return this.apiOption.onError(error);
  }

  _parseResult(str) {
    if (typeof str !== "string") {
      return str;
    }
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return str;
    }
  }

  /**
   * debug状态下，alert提示信息
   */
  debugLog(msg) {
    try {
      msg = JSON.stringify(msg);
      alert(msg);
    } catch (e) {}
  }
}

// 特殊处理逻辑的api列表
var SEPCIALAPI = {
  startCommentLoginAndVerify: function (namespace, params, callback) {
    window.heytapClientCall = window.heytapClientCall || {};
    window.heytapClientCall.onLogined = function (data) {
      if (data.status === "success") {
        callback &&
          callback({
            code: SUCCESS_CODE,
            data
          });
      } else {
        callback &&
          callback({
            code: FAIL_CODE,
            msg: "LOGIN_ERROR"
          });
      }
    };

    window[namespace].startCommentLoginAndVerify(
      params.length > 0 ? String(params[0]) : "onLogined"
    );
  }
};

var NEWAPI = {
  startLogin: { newspace: "Login", originalname: "startLogin" },
  isLogin: { newspace: "Login", originalname: "isLogin" },
  startCommentLoginAndVerify: {
    newspace: "Login",
    originalname: "startCommentLoginAndVerify",
    callId: "onLogined"
  },

  getUserInfo: { newspace: "User", originalname: "getUserInfo" },
  getUserInfoImmediately: {
    newspace: "User",
    originalname: "getUserInfoImmediately"
  },
  getSession: { newspace: "User", originalname: "getSession" },
  getFeedsSession: { newspace: "User", originalname: "getFeedsSession" },
  getBuuid: { newspace: "User", originalname: "getBuuid" },

  clickComment: { newspace: "Comment", originalname: "clickComment" },
  showedCommentCount: {
    newspace: "Comment",
    originalname: "showedCommentCount"
  },
  changeCommentCount: {
    newspace: "Comment",
    originalname: "changeCommentCount"
  },
  setCommentIdAndUser: {
    newspace: "Comment",
    originalname: "setCommentIdAndUser"
  },
  hideCommentFrame: { newspace: "Comment", originalname: "hideCommentFrame" },
  hideOperateFrame: { newspace: "Comment", originalname: "hideOperateFrame" },
  showCommentBar: { newspace: "Comment", originalname: "showCommentBar" },
  hideCommentBar: { newspace: "Comment", originalname: "hideCommentBar" },
  showFastComments: { newspace: "Comment", originalname: "showFastComments" },
  isAlreadyCommentVerify: {
    newspace: "Comment",
    originalname: "isAlreadyCommentVerify"
  },
  isAnchorComment: { newspace: "Comment", originalname: "isAnchorComment" },
  showCommentTopLine: {
    newspace: "Comment",
    originalname: "showCommentTopLine"
  },

  updateArticleInfo: { newspace: "Article", originalname: "updateArticleInfo" },

  getABTestConfig: { newspace: "Common", originalname: "getABTestConfig" },
  isDarkMode: { newspace: "Common", originalname: "isDarkMode" },
  getNetworkType: { newspace: "Common", originalname: "getNetworkType" },
  getKKBrowserUA: { newspace: "Common", originalname: "getKKBrowserUA" },
  getMsgPageSource: { newspace: "Common", originalname: "getMsgPageSource" },
  getPictorialShowedNum: {
    newspace: "Common",
    originalname: "getPictorialShowedNum"
  },
  isFirstDecouplingVersion: {
    newspace: "Common",
    originalname: "isFirstDecouplingVersion"
  },
  getBrowserInfo: { newspace: "Common", originalname: "getBrowserInfo" },
  getImageInfo: { newspace: "Common", originalname: "getImageInfo" },
  getHeadPicInfo: { newspace: "Common", originalname: "getHeadPicInfo" },
  getPictorialInfo: { newspace: "Common", originalname: "getPictorialInfo" },
  getH5DebugFlag: { newspace: "Common", originalname: "getH5DebugFlag" },

  launch: { newspace: "Redirection", originalname: "launch" },
  startDeeplink: { newspace: "Redirection", originalname: "startDeeplink" },
  openLocalPage: { newspace: "Redirection", originalname: "openLocalPage" },
  checkQuickOapsOrDeeplinkValid: {
    newspace: "Redirection",
    originalname: "checkQuickOapsOrDeeplinkValid"
  },

  logToXlog: { newspace: "Action", originalname: "logToXlog" },
  showToast: { newspace: "Action", originalname: "showToast" },
  goToWebPageDetail: { newspace: "Action", originalname: "goToWebPageDetail" },

  statShowAndClick: { newspace: "Stat", originalname: "statShowAndClick" },
  clickAd: { newspace: "Stat", originalname: "clickAd" },

  reload: { newspace: "Webview", originalname: "reload" },
  loadUrl: { newspace: "Webview", originalname: "loadUrl" }
};

var CLIENTAPI = {
  onLogined: function () {
    window.heytapClientCall = window.heytapClientCall || {};
    if (!window.heytapClientCall.onLogined) {
      window.heytapClientCall.onLogined = function () {
        this.callbackMap &&
          this.callbackMap.onLogined &&
          this.callbackMap.onLogined(...arguments);
      }.bind(this);
    }
  },

  sendComment: function () {
    window.heytapClientCall = window.heytapClientCall || {};
    if (!window.heytapClientCall.sendComment) {
      window.heytapClientCall.sendComment = function () {
        this.callbackMap &&
          this.callbackMap.sendComment &&
          this.callbackMap.sendComment(...arguments);
      }.bind(this);
    }
  },

  delComment: function () {
    window.heytapClientCall = window.heytapClientCall || {};
    if (!window.heytapClientCall.delComment) {
      window.heytapClientCall.delComment = function () {
        this.callbackMap &&
          this.callbackMap.delComment &&
          this.callbackMap.delComment(...arguments);
      }.bind(this);
    }
  },

  pageAnchor: function () {
    window.heytapClientCall = window.heytapClientCall || {};
    if (!window.heytapClientCall.pageAnchor) {
      window.heytapClientCall.pageAnchor = function () {
        this.callbackMap &&
          this.callbackMap.pageAnchor &&
          this.callbackMap.pageAnchor(...arguments);
      }.bind(this);
    }
  },

  /**
   * 下载逻辑
   * 1. 调用 supportMarkDownload 方法判断商店是否支持同步进度
   * 2. 如果是, 前端定义sync方法，客户端在下载apk的时候调用sync方法同步给前端下载进度
   * 2. 前端调用download方法，传递包名
   * 3. 暂停或者继续的情况下调用 onSync 方法, 传递包名和状态, 传2暂停, 传3继续
   */

  sync: function () {
    const space = window.heytapDownload || window.oppoDownload || {};
    if (!space.sync) {
      space.sync = function () {
        this.callbackMap &&
          this.callbackMap.sync &&
          this.callbackMap.sync(...arguments);
      }.bind(this);
    }
  }
};

const webviewSDK = new CoreJsapi(
  OLDAPI,
  Object.assign({}, SEPCIALAPI),
  NEWAPI,
  CLIENTAPI
);

export { webviewSDK as default };
