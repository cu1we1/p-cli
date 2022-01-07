<template>
  <!-- 商店app组件（有商业化埋点，支持下载进度）-->
  <div class="gs-components-app-item">
    <div
      class="gs-components-app-item__wrapper"
      data-exp="0"
      :data-log="dataLog"
      :data-adlog="dataAdLogExp"
      @click="interact"
    >
      <div
        class="gs-components-app-item__content"
        :data-href="dataHref"
        :data-adlog="dataAdLogDown"
      >
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
          <div class="gs-components-app-item__content-info--other">
            <svg
              v-if="isShowRgqc"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 2.9629C8 2.45178 7.66132 2.00252 7.16994 1.86182L4.31528 1.04443C4.10923 0.985434 3.89077 0.985434 3.68472 1.04443L0.830056 1.86182C0.338677 2.00252 0 2.45178 0 2.9629V7.81016C0 8.17964 0.178235 8.52642 0.478668 8.74148L3.33333 10.7849C3.73197 11.0703 4.26803 11.0703 4.66667 10.7849L7.52133 8.74148C7.82176 8.52642 8 8.17964 8 7.81016V2.9629ZM6.57635 4.05915C6.70981 3.89865 6.68789 3.66035 6.52739 3.52688C6.36688 3.39342 6.12858 3.41534 5.99512 3.57584L3.40317 6.69293L1.98185 5.26853C1.83441 5.12077 1.5951 5.12051 1.44733 5.26795C1.29957 5.41539 1.29931 5.65471 1.44676 5.80247L3.07226 7.4315C3.27712 7.6368 3.61413 7.62151 3.79956 7.39851L6.57635 4.05915Z"
                fill="#2DC84E"
              />
            </svg>
            <div class="lc1">
              {{ getItemDesc(rateText, installNum) }}
            </div>
          </div>
        </div>
      </div>
      <Button
        :pkg="pkg"
        :url="url"
        :transparent="transparent"
        :index="index"
        :optId="id"
        :name="name"
        :token="token"
        :type="type"
        :tkRef="tk_ref"
        :tkCon="tk_con"
      />
    </div>
    <Recommend
      v-if="showOthers"
      :index="index"
      :keyword="keyword"
      :name="name"
    ></Recommend>
  </div>
</template>

<script>
import { Pic, Button } from "@components";
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
    // 结果类型，store
    "type",
    // app名字
    "name",
    // app包大小。
    "rateText",
    // 商店埋点字段。
    "transparent",
    // 商店埋点字段。
    "tk_con",
    // 商店埋点字段。
    "tk_ref",
    // icon链接。
    "icon",
    // 包名
    "pkg",
    // 跳转url
    "url",
    // 安装次数
    "installNum",
    // 埋点字段，区分是否是广告。
    "isAd",
    // 是否展示人工亲测标识。
    "isShowRgqc",
    // 客户端用于下载。
    "token",
    // 父组件类型
    "perfType",
    "desc",
    "rate",
    "pic",
    "showRecommend",
    /**
     * 应用tab下，推荐App来源
     * rec：推荐app
     * nointention：无意图App（综合应用推荐卡100105）
     */
    "resourceTag",
  ],
  inject: ["onlineApps"],
  computed: {
    // 是否展示推荐结果。
    showOthers() {
      return (
        this.showRecommend && this.onlineApps?.showRecommendAppPkg === this.pkg
      );
    },
  },
  created() {
    const dataLog = this.$utils.inject({
        resource_id: this.rId || this.id,
        resource_name: this.name,
        resource_type: this.type || "store",
        resource_source: 1,
        resource_position: this.index + 1,
        resource_provider: this.cpId,
        ad_src: this.isAd,
        resource_tag: this.resourceTag || "",
      }),
      dataAdLogExp = this.$utils.inject({
        adPosId: this.index + 1,
        transparent: this.transparent,
        kw: this.keyword,
      }),
      dataAdLogDown = this.$utils.inject({
        optValue: this.id || this.name,
        optKey: "1/2/0/4/1",
      }),
      dataHref = this.$utils.inject({
        native: {
          pkg: this.pkg,
          url: this.url,
          transparent: this.transparent,
          adpos: this.index + 1,
          tk_con: this.tk_con,
          tk_ref: this.tk_ref,
        },
      });
    this.dataLog = dataLog;
    this.dataAdLogExp = dataAdLogExp;
    this.dataAdLogDown = dataAdLogDown;
    this.dataHref = dataHref;
  },
  components: {
    Button,
    Pic,
    Recommend,
  },
  methods: {
    highLightApp,
    getItemDesc(rate, installNum) {
      if (rate && installNum) {
        return `${rate}  |  ${installNum}`;
      } else {
        return rate || installNum || "";
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
          @include flex;
        }
      }
    }
  }
}
</style>
