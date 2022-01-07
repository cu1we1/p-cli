<template>
  <!-- 可预约游戏 -->
  <div class="gs-components-app-item">
    <div
      class="gs-components-app-item__wrapper"
      data-exp="0"
      :data-log="dataLog"
      @click="interact"
    >
      <div class="gs-components-app-item__content" :data-href="dataHref">
        <Pic
          class="gs-components-app-item__content-pic"
          :perfType="perfType || ''"
          :size="'xsss1-1'"
          :src="icon"
          :radius="9"
        />
        <div class="gs-components-app-item__content-info">
          <div
            class="gs-components-app-item__content-info--name lc1"
            v-html="highLightApp(name, keyword, 1)"
          ></div>
          <div class="gs-components-app-item__content-info--other lc1">
            {{ getItemDesc() }}
          </div>
        </div>
      </div>
      <Reservation
        :reservationState="reservationState"
        :gameId="id"
        :keyword="keyword"
        :appName="name"
        :pkg="pkg"
      />
    </div>
    <Recommend
      v-if="showOthers"
      :index="index"
      :name="name"
      :keyword="keyword"
    ></Recommend>
  </div>
</template>

<script>
import { Pic, Reservation } from "@components";
import { highLightApp } from "@lego";
import Recommend from "./Recommend";

export default {
  props: [
    // 当前item位于第几个，用于埋点position。
    "index",
    // 当前用户query。
    "keyword",
    // 服务端返回rId，用于埋点。
    "rId",
    "cpId",
    "id",
    // 结果类型，store || game
    "type",
    // app名字
    "name",
    // icon链接。
    "icon",
    // 包名
    "pkg",
    // 跳转url
    "url",
    // 已预约人数
    "reservation",
    // 游戏上线时间
    "timeOnline",
    "perfType",
    "reservationState",
    "showRecommend",
  ],
  inject: ["medusa", "onlineApps"],
  computed: {
    dataLog() {
      const newStatus =
        this.medusa.gamesPKGNeedUpdateStatus[this.pkg] || this.reservationState;
      return this.$utils.inject({
        resource_id: this.rId || this.id,
        resource_name: this.name,
        resource_type: "store",
        resource_source: 1,
        resource_position: this.index + 1,
        resource_provider: this.cpId,
        resource_status: newStatus === "0" ? "未预约" : "已预约",
        ad_src: "",
      });
    },
    // 是否展示推荐结果。
    showOthers() {
      return (
        this.showRecommend && this.onlineApps?.showRecommendAppPkg === this.pkg
      );
    },
  },
  created() {
    const dataHref = this.$utils.inject({
      native: {
        pkg: this.pkg,
        url: this.url,
      },
    });
    this.dataHref = dataHref;
  },
  components: {
    Pic,
    Reservation,
    Recommend,
  },
  methods: {
    highLightApp,
    getItemDesc() {
      if (this.timeOnline && this.reservation) {
        return `${this.timeOnline}  |  ${this.reservation}`;
      } else {
        return this.timeOnline || this.reservation || "";
      }
    },
    // 监听用户和此结果是否有点击交互，有交互则展示推荐应用
    interact() {
      this.onlineApps?.changeShowRecommendAppPkg(this.pkg);
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-components-"; // 可配置的命名空间
@mixin flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
@include b(app-item) {
  @include e(wrapper) {
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    @include e(content) {
      @include flex;
      @include e(content-pic) {
        flex-shrink: 0;
        margin-right: 16px;
        background-color: rgba(0, 0, 0, 0.04);
      }
      @include e(content-info) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-right: 16px;
        @include m(name) {
          font-size: 16px;
          line-height: 21px;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 3px;
        }
        @include m(other) {
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.55);
        }
      }
    }
  }
}
</style>
