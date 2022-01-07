import { openLinkList, verifyDeepLink } from "../sdk/sync";

export type IH5Mode =
  | "third"
  | "project"
  | "browser"
  | "page"
  | "detail"
  | "activity";

export type IH5 =
  | { url: string; mode?: number; title?: string; judgeNet?: boolean }
  | string;

export interface IDeepLink {
  url: string;
  pkg?: string;
}
export type IHap = string;
export interface INative {
  url?: string;
  pkg: string;
  autoDownload?: boolean;
}
export type IHref = {
  deeplink?: IDeepLink;
  hap?: IHap;
  h5?: IH5;
  native?: INative;
};

const H5_MODE = [
  // 第三方页面
  "third",
  // 项目（带搜索框)
  "project",
  // 浏览器
  "browser",
  // 独立页（包含 title)
  "page",
  // 详情页
  "detail"
];
const DEFAULT_H5_MODE = H5_MODE[2];

function isNative(native: INative | undefined) {
  if (!native) {
    return false;
  }

  const { pkg } = native;

  if (pkg) {
    return true;
  }

  return false;
}

function h5Mode2Code(mode: IH5Mode): number {
  switch (mode) {
    case "project":
      return 1;
    case "third":
      return 2;
    case "browser":
      return 3;
    case "page":
      return 4;
    case "detail":
      return 5;
    default:
      return 3;
  }
}

function isH5(h5: IH5 | undefined) {
  if (!h5) {
    return false;
  }
  let url;
  if (typeof h5 === "string") {
    url = h5;
  } else {
    ({ url } = h5);
  }

  return /^(https|http):\/\//.test(url);
}

function isHap(url: string) {
  return /^(hap):\/\//.test(url);
}

function isDeepLink(deeplink: IDeepLink | undefined) {
  if (!deeplink) {
    return false;
  }
  const { url, pkg } = deeplink;

  if (isH5(url)) {
    return false;
  }

  const isDl = verifyDeepLink(url, pkg || "");

  return isDl;
}
function jsonToObj(str: string): string | IHref {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export default (hrefs: string) => {
  const hrefObj = [];
  const href = jsonToObj(hrefs);
  if (typeof href === "string") {
    if (isDeepLink({ url: href })) {
      hrefObj.push({
        type: "deeplink",
        hrefs: {
          pkg: "",
          url: href
        }
      });
    } else if (isHap(href)) {
      hrefObj.push({
        type: "hap",
        hrefs: {
          url: href
        }
      });
    } else if (isH5(href)) {
      hrefObj.push({
        type: "h5",
        hrefs: {
          title: "",
          mode: 3,
          url: href
        }
      });
    }
  } else {
    const { deeplink, hap, h5, native } = href as IHref;

    if (deeplink && isDeepLink(deeplink)) {
      hrefObj.push({
        type: "deeplink",
        hrefs: deeplink
      });
    }

    if (hap && isHap(hap as string)) {
      hrefObj.push({
        type: "hap",
        hrefs: {
          url: hap
        }
      });
    }

    if (h5 && isH5(h5)) {
      let urls: string;
      let modes: any;
      let titles: string | undefined;
      let judgeNets: boolean | undefined = true;

      if (typeof h5 === "string") {
        urls = h5;
        modes = DEFAULT_H5_MODE;
        titles = "";
      } else {
        ({ url: urls, mode: modes, title: titles, judgeNet: judgeNets } = h5);
      }
      hrefObj.push({
        type: "h5",
        hrefs: {
          mode: h5Mode2Code(modes as IH5Mode),
          url: urls,
          title: titles
        },
        judgeNet: judgeNets
      });
    }

    if (native && isNative(native)) {
      hrefObj.push({
        type: "native",
        hrefs: native
      });
    }
  }
  // todo
  return openLinkList(hrefObj);
};
