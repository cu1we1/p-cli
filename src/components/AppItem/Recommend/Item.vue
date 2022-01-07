<template>
  <div data-exp="0" :data-log="dataLog" :data-adlog="dataAdLogExp">
    <div
      class="gs-components-recommend-item"
      :data-href="dataHref"
      :data-adlog="dataAdLogDown"
    >
      <Pic
        :size="'xss1-1'"
        :radius="12"
        :src="icon"
        class="gs-components-recommend-item__pic"
      />
      <div
        class="gs-components-recommend-item__text lc1"
        v-html="highLightApp(name, keyword, 1)"
      ></div>
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
  </div>
</template>

<script>
import { Button, Pic } from "@components";
import { highLightApp } from "@lego";

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
  ],
  components: {
    Button,
    Pic,
  },
  created() {
    const dataLog = this.$utils.inject({
        resource_id: this.rId || this.id,
        resource_name: this.name,
        resource_type: this.type || "store",
        resource_source: 1,
        resource_position: this.index,
        resource_provider: this.cpId,
        ad_src: this.isAd,
      }),
      dataAdLogExp = this.$utils.inject({
        adPosId: this.index,
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
          adpos: this.index,
          tk_con: this.tk_con,
          tk_ref: this.tk_ref,
        },
      });
    this.dataLog = dataLog;
    this.dataAdLogExp = dataAdLogExp;
    this.dataAdLogDown = dataAdLogDown;
    this.dataHref = dataHref;
  },
  methods: {
    highLightApp,
  },
};
</script>

<style scoped lang='scss'>
$namespace: "gs-components-"; // 可配置的命名空间
@include b(recommend-item) {
  width: 16.444vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @include e(pic) {
    margin-top: 5px;
  }
  @include e(text) {
    margin-bottom: 10px;
    margin-top: 8px;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
  }
}
</style>