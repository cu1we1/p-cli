<template>
  <div
    v-if="
      formatPayload &&
      formatPayload.isNewData &&
      Array.isArray(onlineApps) &&
      onlineApps.length
    "
    key="app_store"
    class="card_box"
    :data-log="
      $utils.inject({ card_id: formatPayload.cardId, card_position: 1 })
    "
    data-exp="0"
  >
    <MultiTitle
      cardKey="online_app"
      :style="'margin-bottom: 0px;'"
      :title="title"
      :showMore="isShowMore"
      :dataHref="
        $utils.inject({
          h5: {
            url: `${ZEUS_URL}#/onlineapp?q=${q}&id=${medusa.sessionIDData}&from=complex`,
            title: '应用',
            mode: 'page',
            judgeNet: false,
          },
        })
      "
      :dataLog="
        $utils.inject({
          control_id: '查看更多',
          resource_source: -2,
          control_position: 2,
        })
      "
    ></MultiTitle>
    <template v-for="(item, index) in onlineApps">
      <game-item
        v-if="item.type === 'game'"
        :key="`${item.id}-${index}`"
        v-bind="item"
        :keyword="q"
        :index="index"
        :perfType="perfType"
        :showRecommend="true"
      />
      <app-item
        v-else
        :key="`${item.id}-${index}`"
        v-bind="item"
        :keyword="q"
        :index="index"
        :perfType="perfType"
        :showRecommend="true"
      />
    </template>
  </div>
</template>

<script>
import { performanceTrack } from "@lego";
import format from "./format";
import { MultiTitle, AppItem, GameItem } from "@components";
import { ZEUS_URL, saveComplexOnlineListToLocal, getPkg } from "@lego";
export default {
  name: "AppStore",
  inheritAttrs: false,
  components: {
    MultiTitle,
    AppItem,
    GameItem,
  },
  inject: ["medusa"],
  provide() {
    // 提供给子孙组件访问此组件实例。（代替props传值）
    return {
      onlineApps: this,
    };
  },
  props: ["q", "payload"],
  data() {
    return {
      // 当前卡内展示应用推荐的应用包名
      showRecommendAppPkg: "",
      saveToLocalPayload: this.payload,
    };
  },
  watch: {
    // 监听全局游戏预约状态改变。
    "medusa.gamesPKGNeedUpdateStatus"(newV) {
      if (this.isShowMore) {
        this.gameStatusChangeFunc(newV);
      }
    },
  },
  created() {
    const formatPayload = this.format(this.payload);
    const onlineApps = formatPayload.online.slice(0, 3);
    const isShowMore = formatPayload.online.length > 3;
    this.formatPayload = formatPayload;
    this.onlineApps = onlineApps;
    this.title = this.formatPayload.cardId === "100101" ? "应用" : "应用推荐";
    this.ZEUS_URL = ZEUS_URL;
    // 展示app的包名列表
    this.injectAppsPkg = onlineApps?.map((item) => item?.pkg || "");
    this.isShowMore = isShowMore;
    this.perfType = "appStore";
  },
  mounted() {
    if (this.isShowMore) {
      this.saveComplexOnlineListToLocal(
        this.medusa.sessionIDData,
        this.saveToLocalPayload
      );
    }
    performanceTrack.track("appStoreMounted");
  },
  methods: {
    format,
    saveComplexOnlineListToLocal,
    changeShowRecommendAppPkg(pkg) {
      if (pkg) {
        this.showRecommendAppPkg = pkg;
      }
    },
    // 可预约游戏状态改变回调
    gameStatusChangeFunc(gameInfo) {
      const gameInfoKeys = Object.keys(gameInfo);
      if (!gameInfoKeys.length) return;
      this.saveToLocalPayload?.tab[0]?.tabItem?.forEach((item) => {
        const isGame = item.content[11];
        const pkg = getPkg(item.jumpActions[1].pkg);
        if (isGame === "1" && gameInfoKeys.indexOf(pkg) > -1) {
          item.content[13] = gameInfo[pkg];
        }
      });
      this.saveComplexOnlineListToLocal(
        this.medusa.sessionIDData,
        this.saveToLocalPayload
      );
    },
  },
};
</script>

<style scoped lang="scss"></style>
