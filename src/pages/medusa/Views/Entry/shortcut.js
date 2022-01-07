import LocalResult from "@gs/localResult";
import AppStore from "@gs/appStore";
import QuickApp from "@gs/quickApp";
import NetWorkError from "@gs/netWorkError";
import MoreLocalContent from "@gs/moreLocalContent";
import AnchorToWebPage from "@gs/anchorToWebPage";
import NoResults from "@gs/noResults";
import Refresh from "@gs/refresh";
const ActivityTemplate = () =>
  import(
    /* webpackChunkName: "packages-activityTemplates" */ "@gs/activityTemplates"
  );
const PlayPhone = () =>
  import(/* webpackChunkName: "packages-playPhone" */ "@gs/playPhone");
const OperationalTemplate = () =>
  import(
    /* webpackChunkName: "packages-operationalTemplate" */ "@gs/operationalTemplate"
  );
const MoviesFuzzy = () =>
  import(/* webpackChunkName: "packages-moviesFuzzy" */ "@gs/moviesFuzzy");
const Movie = () =>
  import(/* webpackChunkName: "packages-movie" */ "@gs/movie");

const Novel = () =>
  import(
    /* webpackChunkName: "packages-novel" */
    "@gs/novel"
  );

const Hotels = () =>
  import(
    /* webpackChunkName: "packages-hotel", webpackPrefetch: true */
    "@gs/hotels"
  );

const HotelDetails = () =>
  import(
    /* webpackChunkName: "packages-hotelDetails", webpackPrefetch: true */
    "@gs/hotelDetailes"
  );

const components = {
  Movie,
  MoviesFuzzy,
  LocalResult,
  ActivityTemplate,
  AppStore,
  PlayPhone,
  NetWorkError,
  OperationalTemplate,
  Hotels,
  HotelDetails,
  AnchorToWebPage,
  NoResults,
  Refresh,
};
// 此处添加在线卡ID，utils/constant.js里面的ENTRY_MAP也需要同步添加。
const CMAP = {
  100101: AppStore,
  100105: AppStore,
  100102: QuickApp,
  100299: LocalResult,
  100401: ActivityTemplate,
  280101: PlayPhone,
  netWorkError: NetWorkError,
  100403: OperationalTemplate,
  130101: Novel,
  130103: Novel,
  130104: Novel,
  130105: Novel,
  130106: Novel,
  130201: Novel,
  movie: Movie,
  moviesFuzzy: MoviesFuzzy,
  moreLocalContent: MoreLocalContent,
  100610: Hotels,
  100611: Hotels,
  100608: HotelDetails,
  100609: HotelDetails,
  anchorToWebPage: AnchorToWebPage,
  noResults: NoResults,
  update_tips: Refresh,
};

export { components, CMAP };
