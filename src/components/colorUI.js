import Vue from "vue";
import LoadingDirective from "./Loading/directive";
import {
  Button,
  More,
  Cell,
  Scroll,
  Tabs,
  TabItem,
  LoadMore,
  Popper,
  Swipe,
  SwipeItem,
  Toast,
  Tag,
  Feedback
} from "@oppo/colorui";
import Icon from "@oppo/colorui-icon";
// css样式单独引入。
import "@oppo/colorui/lib/packages/button/button.css";
import "@oppo/colorui/lib/packages/more/more.css";
import "@oppo/colorui/lib/packages/cell/cell.css";
import "@oppo/colorui/lib/packages/scroll/scroll.css";
import "@oppo/colorui/lib/packages/tabs/tabs.css";
import "@oppo/colorui/lib/packages/loadmore/loadmore.css";
import "@oppo/colorui/lib/packages/popper/popper.css";
import "@oppo/colorui/lib/packages/swipe/swipe.css";
import "@oppo/colorui/lib/packages/swipeitem/swipeitem.css";
import "@oppo/colorui/lib/packages/toast/toast.css";
import "@oppo/colorui/lib/packages/tag/tag.css";

const COLORUI = [
  Button,
  // Loading,
  More,
  Cell,
  Scroll,
  Tabs,
  TabItem,
  LoadMore,
  Popper,
  Swipe,
  SwipeItem,
  Toast,
  Icon,
  Tag,
  Feedback
];
Vue.directive("loading", LoadingDirective);
export default [...COLORUI];
