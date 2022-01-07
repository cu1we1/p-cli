import { browserInfo } from "../sdk/sync";
import iconLine from "../../../img/icon_info_line.png";
import iconTravelLine from "../../../img/icon_travel_line.png";
import exchange from "../../../img/icon_exchange.png";
import otherWayRight from "../../../img/icon_ticket_right.png";
import dIconLine from "../../../img/d_icon_line@3x.png";
import dIconTravelLine from "../../../img/d_icon_travelLine@3x.png";
import hotelDetailsPriceInfo from "../../../img/hotelDetails_price_info.png";
import hotelPlaceIcon from "../../../img/hotel_hotelHeader_place.png";
import hotelPlaceIconDark from "../../../img/hotel_hotelHeader_place_dark.png";
import weiboIconLike from "../../../img/icon_like@3x.png";
import weiboIconReports from "../../../img/icon_reports@3x.png";
import weiboIconComment from "../../../img/icon_comments@3x.png";
import dWeiboIconComment from "../../../img/d_icon_weiboTemcomments@3x.png";
import dWeiboIconLike from "../../../img/d_icon_weiboTemlike@3x.png";
import dWeiboIconReports from "../../../img/d_icon_weiboTemreports@3x.png";
import dIconTicketsExchange from "../../../img/d_icon_exchange@3x.png";
import iconRestore from "../../../img/icon_restore@3x.png";
import dIconRestore from "../../../img/d_icon_restore@3x.png";
import zeusSugSearchIcon from "../../../img/zeus/sugs/search.png";
import zeusSugSearchIconDark from "../../../img/zeus/sugs/searchDark.png";
import zeusSugArrowIcon from "../../../img/zeus/sugs/arrow.png";
import zeusSugArrowIconDark from "../../../img/zeus/sugs/arrowDark.png";
import componentsAngelRight from "../../../img/angleRight.png";
import componentsAngelRightDark from "../../../img/angleRightDark.png";
import novelFooterIcon from "../../../img/icon_kelelogo2.png";
const hotelDetailsNavigation =
  "https://prod-search.nearme.com.cn/search/uploads/hotelDetails/hotelDetails_navigation_bg.png.webp";
const hotelDetailsNavigationDark =
  "https://prod-search.nearme.com.cn/search/uploads/hotelDetails/hotelDetails_navigation_bg_dark.png.webp";
const operationCloseIcon =
  "https://prod-search.nearme.com.cn/search/uploads/static/hotel_operation_close.png.webp";
const operationCloseIconDark =
  "https://prod-search.nearme.com.cn/search/uploads/static/hotel_operation_close_dark.png.webp";
const hotelDetailsNoSale =
  "https://prod-search.nearme.com.cn/search/uploads/static/hotel_noSale.36bc546d.png.webp";

const oppo = {
  hotelHeadClearBg: "#f2f2f2",
  hotelPlaceIcon,
  hotelDetailsNavigation,
  hotelDetailsPriceInfo,
  hotelDetailsNoSale,
  alertBg: "#fff",
  nearbyBorder: "rgba(0, 0, 0, 0.1)",
  introductionBg:
    "linear-gradient(to right,transparent,rgba(255, 255, 255, 1))",
  pocketBg: "#F2F2F2",
  iconLine,
  iconTravelLine,
  exchange,
  otherWayRight,
  operationBgColor: "rgba(0,122,255, 0.1)",
  operationCloseIcon,
  weiboIconLike,
  weiboIconReports,
  weiboIconComment,
  iconRestore,
  zeusSugSearchIcon,
  zeusSugArrowIcon,
  componentsAngelRight,
  novelFooterIcon
};
const oppoDark = {
  hotelPlaceIcon: hotelPlaceIconDark,
  hotelHeadClearBg: "rgba(255, 255, 255, 0.2)",

  hotelDetailsNavigationDark,
  hotelDetailsPriceInfo,
  hotelDetailsNoSale,
  alertBg: "#333333",
  nearbyBorder: "rgba(51, 51, 51)",
  operationBgColor: "rgba(0,122,255, 0.3)",
  operationCloseIcon: operationCloseIconDark,
  introductionBg: "linear-gradient(to right,transparent,rgba(51, 51, 51, 1))",
  exchange: dIconTicketsExchange,
  otherWayRight,
  iconLine: dIconLine,
  iconTravelLine: dIconTravelLine,
  pocketBg: "rgba(255, 255, 255, 0.2)",
  weiboIconLike: dWeiboIconLike,
  weiboIconReports: dWeiboIconReports,
  weiboIconComment: dWeiboIconComment,
  iconRestore: dIconRestore,
  zeusSugSearchIcon: zeusSugSearchIconDark,
  zeusSugArrowIcon: zeusSugArrowIconDark,
  componentsAngelRight: componentsAngelRightDark,
  novelFooterIcon
};
const result = {
  0: oppo,
  1: oppoDark
};
export default result[browserInfo.theme] || oppo;
