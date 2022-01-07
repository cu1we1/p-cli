/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable no-empty */
import { debounce } from "../utils/limit";
import { addTask, RAF } from "../utils/scheduler";
import inView from "../utils/inView";
import { jsonParse } from "../utils/queryString";
import {
  generalStat,
  adReport,
  showLocationPermissionDialog
} from "../sdk/sync";
import { pageVisibilityChange } from "../sdk/async";

import jump from "./jump";
type kvType = { [k: string]: any };
const DOCUMENT_NODE_TYPE = 9;
const CLICK_ID = 1002;
const EXP_ID = 1001;
const SEARCH_ID = 1003;
const PERFORMANCE_ID = 1010;
const APP_ID = 1005;

const EXPORT = "[data-exp='0']";
const EXPORT_DONE = "[data-exp='1']";
const EXPORT_DONE_REVIEW = "[data-review='1']";
const EXPORT_ATTR = "data-exp";
const LAZYLOAD_ATTR = "[data-imgsrc]";
const LAZYLOAD_TYPE = "data-imgsrc";
const LAZYLOAD_STATUS = "data-loading";
const LAZYLOAD_ALL_ATTR = "[data-imgsrcall]";
const LAZYLOAD_ALL_TYPE = "data-imgsrcall";

const CLICK_TRACK_ATTR = "data-href";

const CLICK_TRACK_ATTR_LOCATION = "data-href-location";

const CLICK_STOP_PROP = "data-sprop";

const objectString = "[object Object]";

const STEP = 6;

let LASTHREF = "";
let TIMER;
// 是否上报过resource_in，作为首屏（非图片）加载完成的时间点。
let isReportedResourceIn = false;

const VISIBILITY_CALLBACK_LIST = [];

const { toString } = Object.prototype;

let exposure_id = Date.now();
// 初始值改为true，页面加载完成就执行曝光等操作。
let visibility = false;
const { MutationObserver, WebKitMutationObserver } = (<kvType>window) as kvType;

const lazyLoadAllImage = () => {
  const nodelist = document.querySelectorAll(LAZYLOAD_ALL_ATTR);
  if (!nodelist.length) {
    return;
  }
  nodelist.forEach((eleNode: Element) => {
    const src = (eleNode as HTMLElement).dataset.imgsrcall;
    const inLoading = (eleNode as HTMLElement).getAttribute(LAZYLOAD_STATUS);
    if (!inLoading && src) {
      (eleNode as HTMLElement).setAttribute(LAZYLOAD_STATUS, "1");
      let img: any = new Image();
      img.src = src;
      img.onload = () => {
        img = null;
        (eleNode as HTMLElement).style.backgroundImage = `url(${src})`;
        (eleNode as HTMLElement).style.backgroundColor = "transparent";
        eleNode.removeAttribute(LAZYLOAD_ALL_TYPE);
        eleNode.removeAttribute(LAZYLOAD_STATUS);
      };
      img.onerror = () => {
        img = null;
        eleNode.removeAttribute(LAZYLOAD_STATUS);
      };
    }
  });
};

// const SMALLURL = "https://imgconvert-search.nearme.com.cn/osearch-local/";
const lazyLoadImage = (ele?: HTMLElement) => {
  if (
    ele &&
    ele.getBoundingClientRect &&
    !inView(ele.getBoundingClientRect() as DOMRect, -1).in
  ) {
    return;
  }
  const nodelist = (ele || document).querySelectorAll(LAZYLOAD_ATTR);
  if (!nodelist.length) {
    return;
  }
  nodelist.forEach(eleNode => {
    const src = (eleNode as HTMLElement).dataset.imgsrc;
    const inLoading = (eleNode as HTMLElement).getAttribute(LAZYLOAD_STATUS);
    // if (src && inView(ele1.getBoundingClientRect() as DOMRect, 0).tb >= "10") {
    if (
      !inLoading &&
      src &&
      inView(eleNode.getBoundingClientRect() as DOMRect, -1).in
    ) {
      // if (weakNetWork && src.indexOf(SMALLURL) === 0) {
      //   const index = src.lastIndexOf(".");
      //   src = `${src.slice(0, index)}_small${src.slice(index)}`;
      // }
      (eleNode as HTMLElement).setAttribute(LAZYLOAD_STATUS, "1");
      let isFirst = true;
      let img: any = new Image();
      img.src = src;
      img.onload = () => {
        img = null;
        (eleNode as HTMLElement).style.backgroundImage = `url(${src})`;
        (eleNode as HTMLElement).style.backgroundColor = "transparent";
        eleNode.removeAttribute(LAZYLOAD_TYPE);
        eleNode.removeAttribute(LAZYLOAD_STATUS);
      };
      img.onerror = () => {
        if (isFirst) {
          isFirst = false;
          img.src = src;
        } else {
          img = null;
          eleNode.removeAttribute(LAZYLOAD_STATUS);
        }
      };
    }
  });
};

const debounceLazyLoadImage: any = debounce(() => lazyLoadImage(), 50);
const debounceLazyLoadAllImage: any = debounce(() => lazyLoadAllImage(), 50);

const objectExtends = (baseObj: kvType, extendObj?: kvType | null): kvType => {
  const extendIsObj = toString.call(extendObj) === objectString;
  const result = { ...baseObj };
  if (extendIsObj && extendObj) {
    Object.keys(extendObj).forEach(item => {
      if (result[item] !== undefined) {
        result[item] += `_${extendObj[item]}`;
      } else {
        result[item] = extendObj[item];
      }
    });
  }

  return result;
};

const toTrackData = (ID: number, data: kvType | null): void => {
  if (ID && data) {
    generalStat(
      ID,
      objectExtends(data, {
        exposure_id
      })
    );
  }
};

const getTrackData = (
  element: HTMLElement,
  rootElement?: HTMLElement // 根结点元素
): kvType | null => {
  let trackData: kvType | null = null;
  const rootEle = rootElement || document;
  let ele = element;
  while (ele && ele !== (rootEle as HTMLElement)) {
    const logData = ele.dataset.log;
    if (logData) {
      try {
        trackData = objectExtends(jsonParse(logData) || {}, trackData);
      } catch (e) {}
    }
    ele = ele.parentElement as HTMLElement;
  }

  return trackData;
};

const getMonitorExpData = (element: HTMLElement): string => {
  const logData = element.dataset.monitorExp;
  if (logData) {
    return logData;
  }
  return "";
};

const getAdTrackData = (element?: HTMLElement | null): kvType | null => {
  let trackData: kvType | null = null;
  let ele = element;
  while (ele && ele.nodeType !== DOCUMENT_NODE_TYPE) {
    const logData = ele.dataset.adlog;
    if (logData) {
      try {
        trackData = objectExtends(jsonParse(logData) || {}, trackData);
      } catch (e) {}
    }

    ele = ele.parentElement;
  }

  return trackData;
};

const expTrackData = (item: HTMLElement, ext: Object) => {
  item.setAttribute(EXPORT_ATTR, "1");
  const logData = getTrackData(item as HTMLElement);
  const adlog = getAdTrackData(item as HTMLElement);
  const monitorExpData = getMonitorExpData(item as HTMLElement);
  if (logData) {
    const idResource =
      logData.resource_id ||
      logData.resource_name ||
      logData.tab_id ||
      logData.tab_name;
    const idCard = logData.card_id || logData.card_name;
    if (idResource && logData.resource_source === undefined) {
      logData.resource_source = 1;
    }
    logData.exposure_type = idResource
      ? "resource_in"
      : idCard
      ? "card_in"
      : "page_in";
    if (!isReportedResourceIn && logData.exposure_type === "resource_in") {
      (<kvType>window).firstResourceExp = performance.now();
      isReportedResourceIn = true;
    }
    toTrackData(EXP_ID, objectExtends(logData, ext));
  }
  if (adlog) {
    adReport({
      penetrator: adlog.transparent,
      map: {
        dataType: "qs-js-exp",
        kw: adlog.kw
      }
    });
  }
  // 曝光监测链接
  if (monitorExpData) {
    const trackImg = new Image();
    trackImg.src = monitorExpData;
  }
};

const expTrack = (ele?: HTMLElement) => {
  const conter = ele || document;
  const nodelist = conter.querySelectorAll(EXPORT);
  let bFlag = false;
  let i = 0;
  const { length } = nodelist;

  while (bFlag && i < length) {
    const clientRect = nodelist[i].getBoundingClientRect();
    const itemPos = inView(clientRect as DOMRect);

    if (itemPos.in || itemPos.tb === "01") {
      i = Math.max(i - STEP + 1, 0);
      bFlag = true;
    } else {
      i = Math.min(length, i + STEP);
    }
  }

  for (; i < length; i += 1) {
    const item = nodelist[i];
    const clientRect = item.getBoundingClientRect();
    const itemPos = inView(clientRect as DOMRect);

    if (itemPos.in) {
      expTrackData(item as HTMLElement, {
        height: clientRect.height,
        top: clientRect.top
      });
    }
    // else if (itemPos.tb === "01") {
    //   return;
    // }
  }
};

const inject = (o: any) => {
  return JSON.stringify(o || "");
};

const scrollOutView = (): void => {
  const exportedList = document.querySelectorAll(EXPORT_DONE_REVIEW);
  Array.prototype.slice.call(exportedList).forEach(epdItem => {
    if (!inView(epdItem.getBoundingClientRect()).in) {
      epdItem.setAttribute(EXPORT_ATTR, "0");
    }
  });
};

const removeExportTag = (): void => {
  const nodelist = document.querySelectorAll(EXPORT_DONE);
  Array.prototype.slice.call(nodelist).forEach(item => {
    item.setAttribute(EXPORT_ATTR, "0");
  });
};

const addVisibilityChangeCallBack = (callback: Function) => {
  if (callback && typeof callback === "function") {
    VISIBILITY_CALLBACK_LIST.push(callback);
  }
};

pageVisibilityChange((data: String) => {
  if (+data === 1) {
    visibility = true;
    LASTHREF = "";
    exposure_id = Date.now();
    removeExportTag();
    addTask(expTrack);
  } else {
    visibility = false;
  }
  try {
    VISIBILITY_CALLBACK_LIST.forEach(callback => {
      if (callback && typeof callback === "function") {
        callback(data);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

const getPageVisibility = (): boolean => {
  return visibility;
};

const debounceExport500: any = debounce(() => {
  if (!visibility) {
    return;
  }
  scrollOutView();
  expTrack();
}, 500);

const debounceExport: any = debounce(() => {
  if (!visibility) {
    return;
  }
  // 曝光
  scrollOutView();
  RAF(() => expTrack());
}, 50);

const trackAdClickBaseEle = (ele: HTMLElement) => {
  if (!ele || !(ele instanceof HTMLElement)) {
    return;
  }
  const trackData = getAdTrackData(ele);
  if (trackData) {
    const { transparent, kw, optValue, optKey } = trackData;
    adReport({
      penetrator: transparent,
      map: {
        dataType: "qs-js-down",
        optValue,
        optKey,
        kw
      }
    });
  }
};

const trackClickBaseEle = (ele: HTMLElement, exdObj?: kvType) => {
  if (!ele || !(ele instanceof Element)) {
    return;
  }
  let trackData = getTrackData(ele);
  const isObject = toString.call(exdObj) === objectString;
  if (trackData) {
    if (isObject) {
      trackData = objectExtends(trackData, exdObj);
    }
    if (
      trackData.resource_source === undefined &&
      (trackData.resource_id !== undefined ||
        trackData.resource_name !== undefined)
    ) {
      trackData.resource_source = 1;
    }

    toTrackData(CLICK_ID, trackData);
  }
};

const trackClick = (ele: HTMLElement, exdObj?: kvType): void => {
  if (!ele) {
    return;
  }

  trackAdClickBaseEle(ele);
  trackClickBaseEle(ele, exdObj);
};

const trackAppBaseEle = (ele: HTMLElement, exdObj?: kvType) => {
  if (!ele || !(ele instanceof Element)) {
    return;
  }
  let trackData = getTrackData(ele);
  const isObject = toString.call(exdObj) === objectString;
  if (trackData) {
    if (isObject) {
      trackData = objectExtends(trackData, exdObj);
    }
    if (
      trackData.resource_source === undefined &&
      (trackData.resource_id !== undefined ||
        trackData.resource_name !== undefined)
    ) {
      trackData.resource_source = 1;
    }

    toTrackData(APP_ID, trackData);
  }
};

const trackSearch = (params: kvType) => {
  addTask(() => toTrackData(SEARCH_ID, params));
};

const trackPerformance = (params: kvType) => {
  toTrackData(PERFORMANCE_ID, params);
};

const getFristParentLog = (ele: HTMLElement): HTMLElement | null => {
  if (!ele) {
    return null;
  }
  let element = ele;
  while (element && element !== ((document as unknown) as HTMLElement)) {
    const logData = element.dataset.log;
    if (logData) {
      break;
    }
    element = element.parentElement as HTMLElement;
  }
  return element;
};

// need：是否需要给window对象绑定scroll事件。
function init(addHistoryCb: Function, need = true) {
  // const rhType =
  //   browserInfo.searchRecordSwitch !== "1" && hType === "search" ? "" : hType;
  const MObserver = MutationObserver || WebKitMutationObserver;
  const element =
    document.getElementById("app") ||
    document.body.firstElementChild ||
    document.body;

  const observer = new MObserver(
    debounce((list: Array<MutationRecord>) => {
      if (
        list &&
        list.length &&
        list[0].target &&
        (list[0].target as HTMLElement).classList.contains("TEXT_SCROLLER")
      ) {
        return;
      }
      // debounceLazyLoadImage();
      debounceExport();
    }, 200)
  );
  observer.observe(element, { childList: true, subtree: true });

  const getElementByAttr = (
    target: HTMLElement,
    attr: string
  ): HTMLElement | null => {
    let result = target;
    const topEle = document.body;
    while (result && result.parentElement) {
      if (result.hasAttribute(attr) || result.hasAttribute(CLICK_STOP_PROP)) {
        return result;
      }
      result = result.parentElement;
      if (result === topEle) {
        return null;
      }
    }
    return null;
  };
  // 系统键盘收缩 导致webview缩放
  (<kvType>window).addEventListener("resize", debounceExport500);
  if (need) {
    (<kvType>window).addEventListener("scroll", debounceExport500);
    // (<kvType>window).addEventListener("scroll", debounceLazyLoadImage);
  }

  document.addEventListener("click", (e: any) => {
    let isPermissioned = true;
    const target = getElementByAttr(e.target, CLICK_TRACK_ATTR);
    const href = target && target.getAttribute(CLICK_TRACK_ATTR);
    const needPermissionLocation =
      target && target.getAttribute(CLICK_TRACK_ATTR_LOCATION);

    if (href === null) {
      return;
    }

    if (href && href !== LASTHREF) {
      LASTHREF = href;
      if (TIMER) {
        clearTimeout(TIMER);
      }
      TIMER = setTimeout(() => {
        LASTHREF = "";
      }, 200);

      if (needPermissionLocation) {
        isPermissioned = !!showLocationPermissionDialog();
      }

      if (isPermissioned) {
        jump(href);
      }
    }

    if (addHistoryCb && typeof addHistoryCb === "function") {
      addHistoryCb();
    }

    trackClick(e.target as HTMLElement);
  });
}

export {
  inject,
  trackClickBaseEle,
  trackPerformance,
  getFristParentLog,
  debounceExport500,
  debounceExport,
  lazyLoadImage,
  trackClick,
  trackSearch,
  removeExportTag,
  getPageVisibility,
  debounceLazyLoadImage,
  init,
  debounceLazyLoadAllImage,
  jump,
  toTrackData,
  addVisibilityChangeCallBack,
  trackAppBaseEle
};
