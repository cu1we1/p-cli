<template>
  <!-- 游戏中心App类游戏组件，但是不支持商业化埋点 -->
  <div class="gs-components-app-game-item">
    <div
      class="gs-components-app-game-item__wrapper"
      data-exp="0"
      :data-log="dataLog"
    >
      <div class="gs-components-app-game-item__content" :data-href="dataHref">
        <Pic
          class="gs-components-app-game-item__content-pic"
          :perfType="perfType || ''"
          :size="'xsss1-1'"
          :src="icon"
          :radius="9"
        />
        <div class="gs-components-app-game-item__content-info">
          <div
            class="gs-components-app-game-item__content-info--name lc1"
            v-html="highLightApp(name, keyword, 1)"
          ></div>
          <div class="gs-components-app-game-item__content-info--other">
            <div class="lc1">
              {{ getItemDesc(rateText, installNum) }}
            </div>
          </div>
        </div>
      </div>
      <Button
        :pkg="pkg"
        :url="url"
        transparent=""
        :index="index"
        :optId="id"
        :name="name"
        :token="token"
        :type="type"
        :tkRef="''"
        :tkCon="''"
      />
    </div>
  </div>
</template>

<script>
import { Pic, Button } from "@components";
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
    // icon链接。
    "icon",
    // 包名
    "pkg",
    // 跳转url
    "url",
    // 安装次数
    "installNum",
    // 父组件类型
    "perfType",
    "token",
  ],
  inject: ["onlineApps"],
  created() {
    this.dataLog = this.$utils.inject({
      resource_id: this.rId || this.id,
      resource_name: this.name,
      resource_type: "store",
      resource_source: 1,
      resource_position: this.index + 1,
      resource_provider: this.cpId,
    });
    this.dataHref = this.$utils.inject({
      native: {
        pkg: this.pkg,
        url: this.url,
        adpos: this.index + 1,
      },
    });
  },
  components: {
    Pic,
    Button,
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
@include b(app-game-item) {
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
    @include e(button) {
      flex-shrink: 0;
    }
  }
}
</style>
