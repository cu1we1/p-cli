# 同步接口

### 1. getBrowserInfo

> 获取设备信息。

- 参数：无
- 返回值

```
 {
  complexUrl: "https://m.baidu.com/s?from=1023341c&tn=ins&wd=",
  engineName: "百度搜索",
  engineUrl: "https://m.baidu.com/s?from=1023341c&tn=ins&wd=",
  webUrl: "https://m.baidu.com/s?from=1020681r&tn=ins&wd=",
  webview: "1",
  urlMapping:
    '{"ouis_search":"https://ouis.search.heytapmobi.com","config_server":"https://config.search.heytapmobi.com","global_index":"https://i.search.heytapmobi.com","medusa_search":"https://ms.search.heytapmobi.com"}',
  appVersion: "10.14.0",
  brand: "oppo",
  language: "zh-CN",
  searchRecordSwitch: "",
  theme: 0,
  encryptResult: "",
  sIv: "",
  sKey: "",
  mobileName: "OPPO R11s",
  colorOsVersion: "",
  androidReleaseVersion: "",
  networkType: "wifi",
  O_OUIS: "https://ouis.search.heytapmobi.com",
  O_URL: "https://i.search.heytapmobi.com",
  O_MEDUSA_URL: "https://ms.search.heytapmobi.com",
  O_CURL: "https://config.search.heytapmobi.com",
  urlCdn: "https://prod-search.nearme.com.cn"
};
```

- 调用示例

```
wv.invoke("Common.getBrowserInfo");
```

### 2. adReport

> 广告 SDK 埋点上报。

- 参数：{ str }
- 返回值：'0'-失败，'1'-成功
- 调用示例

```
wv.invoke("Stat.adReport", { str: data });
```

### 3. isApkInstalled

> 判断应用是否安装

- 参数：{ pkg }
- 返回值：'0'-未安装，'1'-已安装
- 调用示例

```
wv.invoke("Common.isApkInstalled", {
    pkg
});
```

### 4. isAppHided

> 判断应用是否隐藏

- 参数：{ pkg }
- 返回值：'0'-未隐藏，'1'-已隐藏
- 调用示例

```
wv.invoke("Common.isAppHided", {
    pkg
});
```

### 5. isNetworkAvailable

> 判断是否有网络

- 参数：无
- 返回值：''-无网络，'1'-有网络
- 调用示例

```
wv.invoke("Common.isNetworkAvailable");
```

### 6. launchCallByContactID

> 调起电话

- 参数：contactId,phoneNumber
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.launchCallByContactID", {
  contactId,
  phoneNumber,
})
```

### 7. launchMessageByContactID

> 调起信息

- 参数：contactId,phoneNumber
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.launchMessageByContactID", {
  contactId,
  phoneNumber,
})
```

### 8. launchPhotoEditPage

> 调起相册大图编辑页

- 参数：id: string, ids: Array<String>, type: string
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.launchPhotoEditPage", { id, ids, type })
```

### 9. launchSettings

> 调起系统设置页

- 参数：无
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.launchSettings");
```

### 9. openSearchApp

> 打开本地应用（来自于本地搜索结果）

- 参数：
  source: string-本地搜索结果来源
  dataEntity: string-搜索结果实体
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.openSearchApp", {
  source,
  dataEntity
});
```

### 10. showToast

> 调用客户端方法弹出 toast

- 参数： text: string
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.showToast", text);
```

### 11. readyToJSBridge

> 同步接口，前端初始化完毕，JSBridge 已经建立，可以接收客户端回调

- 参数：session string
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Common.readyToJSBridge", session);
```

### 12. requestSearch

> 前端请求发起搜索

- 参数：
  query: string - 查询关键词,
  source: string - 来源
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.requestSearch", {
  query,
  source,
});
```

### 13. sendTo

> 调用系统接口“发送到”

- 参数：pkg：文件路径（搜索文件结果里面的 action 项数据）（文件 type+完整路径+文件名+后缀）
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.requestSearch", {
  pkg
});
```

### 14.setInputTextSelected

> 设置输入框状态：选中 or 不选中

- 参数：'1'-设置选中，'0'-设置不选中
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.setInputTextSelected", '1');
```

### 15. setKeyboardVisible

> 设置键盘状态

- 参数：'1'-设置选中，'0'-设置不选中
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.setKeyboardVisible", '1');
```

### 16. showLocationPermissionDialog

> 弹出获取位置信息确认框

- 参数：无
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Action.showLocationPermissionDialog");
```

### 17. generalStat

> 埋点上报

- 参数：
  str: {
  id: string | number,
  log: object | string,
  }
  trigger: boolean = false（没有作用）

- 返回值：''-失败，'1'-成功
- 调用示例

```
 wv.invoke("Stat.generalStat", {
   str,
   trigger: false
 })
```

### 18. verifyDeepLink

> 校验 deeplink 是否可以打开。

- 参数
  url-dp 链接,
  pkg-包名，可不传,
- 返回值：''-不可打开，'1'-可以打开
- 调用示例

```
wv.invoke("Common.verifyDeepLink", {
  url,
  pkg,
})
```

### 19. kvPut

> 前端存储数据到客户端（用于存储数据量较大，且不会频繁读取的数据）

- 参数：key:`h5-${key}`,value
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Common.kvPut", {
  key: `h5-${key}`,
  value,
})
```

### 20. kvGet

> 前端获取保存到客户端本地的数据（对应 kvPut）

- 参数：key:`h5-${key}`,defValue:''
- 返回值：string
- 调用示例

```
wv.invoke("Common.kvGet", {
  key: `h5-${key}`,
  defValue: '',
})
```

### 21. cachePut

> 前端存储数据到客户端（用于存储数据量较小，需要频繁读取的数据）

- 参数：key:`h5-cache-${key}`,value
- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Common.cachePut", {
  key: `h5-cache-${key}`,
  value,
})
```

### 22. cacheGet

> 前端获取保存到客户端本地的数据（对应 kvPut）

- 参数：key:`h5-cache-${key}`,defValue:''
- 返回值：string
- 调用示例

```
wv.invoke("Common.cacheGet", {
  key: `h5-cache-${key}`,
  defValue: '',
})
```

### 23. sugSearchCof

> 传 sug 页 searchKeys 到客户端，Action.getSugSearchResults配置

- 参数

```
searchKeys: string
```

- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Common.sugSearchKeys", {
  searchKeys
});
```

### 24. resultsSearchCof

> 传结果页 searchKeys 到客户端，Action.getSearchResults配置

- 参数

```
searchKeys: string
searchNums: number
```

- 返回值：''-失败，'1'-成功
- 调用示例

```
wv.invoke("Common.resultsSearchKeys", {
  searchKeys,
  searchNums
});
```
### 25. getRefreshSessionId

> 获取刷新后的搜索 session

- 参数

```
{ query }
```

- 返回值：''

- 调用示例

```
wv.invoke("Common.getRefreshSessionId", { query });
```

### 26. pushAppDownload

> 开始应用下载

- 参数

```
服务端下发的data数据。
data: {
  pkg: string;
  autoDownload: Boolean;
  url: string;
  transparent: string;
  adpos: Number;
  token: string;
}
```
- 返回值 "" | "1"

- 调用示例

```
wv.invoke("Download.download", data);
```

### 27. pauseDownloadByPkg

> 暂停应用下载

- 参数

```
pkg 包名
state 固定传2 标识暂停应用
```

- 返回值 "" | "1"

- 调用示例

```
wv.invoke("Download.onSync", pkg, 2);
```

---

# 异步接口

### 1. reserveGame

> 前端调用预约/取消预约接口。

- 参数

```
type 接口类型
appID 游戏ID。
keyWord 搜索query
appName 游戏名字
callBack 回调，用于异步获取结果。
```

- 调用示例

```
wv.invoke(
  "Action.reserveGame",
  {
    type,
    appID,
    keyWord,
    appName,
  },
  callBack
);
```

### 2. keyboardVisibleChange

> 监听键盘弹起 or 收起

- 参数

```
cb 回调
```

- 调用示例

```
wv.on("Common.keyboardVisibleChange", cb);
```

### 3. historySwitchChange

> 监听历史记录开关状态

- 参数

```
cb 回调
```

- 调用示例

```
wv.on("Common.historySwitchChange", cb);
```

### 4. queryAlbumSnapshotInfo

> 获取相册缩略图

- 参数

```
tag 文件夹的唯一标识
pageNo 页码  int，从0开始
pageSize 每页请求数量  最大值100
updateTime 上次查询的最后一条的时间（首次查询0）（long数据类型，首次加载使用0L）
query query词
tagId tagID
cb 获取结果后的回调
```

- 调用示例

```
wv.invoke(
  "Common.queryAlbumSnapshotInfo",
  {
    tag,
    pageNo,
    pageSize,
    updateTime,
    query,
    tagId,
  },
  cb
);
```

### 5. getSugSearchResults

> 监听 sug 页搜索结果

- 参数

```
cb 回调
```

- 调用示例

```
wv.on("Action.getSugSearchResults", cb);
```

### 6. getSugSearchSession

> 监听 sug 页搜索 session

- 参数

```
cb 回调
```

- 调用示例

```
wv.on("Action.getSugSearchSession", cb);
```

### 7. getSearchResults

> 监听结果页搜索结果

- 参数

```
cb 回调
```

- 调用示例

```
wv.on("Action.getSearchResults", cb);
```

### 8. getLocalResult

> 获取本地搜索结果

- 参数

```
cb 搜索结果的回调方法名
```

- 调用示例

```
wv.on("Action.getLocalResult", cb);
```

### 9. getTagOfSearch

> 结果页发起搜索，通过此方法通知前端。

- 参数
```
cb 回调
```
- 调用示例
```
wv.on("Action.getTagOfSearch", cb);
```

### 10. startLocalSearch

> 发起本地相关搜索

- 参数
```
query 搜索词
verticalKey 搜索源
filterBlack: true 默认参数
checkSynonym: true 默认参数
isSecondPage: true 默认参数
```
- 调用示例
```
wv.on("Action.startLocalSearch", {
  query,
  verticalKey,
  filterBlack: true,
  checkSynonym: true,
  isSecondPage: true
});
```

### 11. registerAppDownloadProgress

> 获取应用下载进度，需要先注册"Download.sync"，然后立即调用一次。

- 参数
```
scb 回调函数
```
- 调用示例

```
wv.on("Download.sync", scb);
wv.invoke("Download.sync");
```