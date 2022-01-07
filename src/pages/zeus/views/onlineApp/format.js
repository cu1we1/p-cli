import { oreport, isAppHided, isApkInstalled } from "@lego";
import { getPkg } from "@lego";

function format(payload) {
  if (!payload) return {};
  try {
    const { dataInfo, cardContent, tab, cardInfo } = payload;
    const { cpId } = dataInfo || {};
    const list = tab[0].tabItem
      .filter(item => {
        if (item.jumpActions[1]) {
          const { pkg } = item.jumpActions[1];
          return !isAppHided(pkg) && !isApkInstalled(pkg);
        }
        return "";
      })
      .map(item => {
        const isGame = item.content[11];
        if (isGame === "1") {
          return {
            // 此结果的resource_id
            rId: item.resourceId,
            // 此结果的cp_id
            cpId: item.cpId,
            // 游戏appID
            id: item.content[0],
            type: "game",
            name: item.content[1],
            // 游戏上线时间
            timeOnline: item.content[12],
            // 游戏图标
            icon: item.pic[0],
            // 预约url
            url: item.jumpActions[0].url,
            pkg: getPkg(item.jumpActions[1].pkg),
            // 已预约人数
            reservation: item.content[8],
            // 游戏是否已预约
            reservationState: item.content[13]
          };
        }
        return {
          rId: item.resourceId,
          cpId: item.cpId,
          id: item.content[0],
          type: "store",
          name: item.content[1],
          rate: (item.content[2] * 2) / 10,
          rateText: item.content[3],
          desc: item.content[4],
          transparent:
            item.content[5] ||
            JSON.stringify({
              contentId: item.content[0]
            }),
          tk_con: item.content[6],
          tk_ref: item.content[7],
          icon: item.pic[0],
          pic: item.pic,
          pkg: getPkg(item.jumpActions[1].pkg),
          url: item.jumpActions[0].url,
          installNum: item.content[8],
          isShowRgqc: item.content[10] === "1",
          token: item.downloadToken || ""
        };
      });

    return {
      cardName: cardInfo.title,
      cardId: dataInfo.cardId,
      cardType: cardContent[1],
      list,
      isNewData: cpId == "10008" ? true : false
    };
  } catch (e) {
    oreport.reportError(new Error(`appTab-format--${e}`));
    console.error(e);
    return {};
  }
}

export default format;
