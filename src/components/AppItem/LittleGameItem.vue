<template>
  <!-- 快应用类游戏 -->
  <div
    class="gs-components-little-game-item"
    data-exp="0"
    :data-log="dataLog"
    :data-href="dataHref"
  >
    <div class="gs-components-little-game-item__content">
      <Pic
        class="gs-components-little-game-item__content-pic"
        :perfType="''"
        :size="'xsss1-1'"
        :src="icon"
        :radius="9"
      />
      <div class="gs-components-little-game-item__content-info">
        <div
          class="gs-components-little-game-item__content-info--name lc1"
          v-html="highLightApp(name, keyword, 1)"
        ></div>
        <div class="gs-components-little-game-item__content-info--other lc1">
          {{ desc }}
        </div>
      </div>
    </div>
    <div
      class="gs_button_normal"
      v-feedback
      :data-log="
        $utils.inject({
          control_name: '秒开',
          control_position: 1,
          control_type: 'button',
        })
      "
    >
      {{ buttonText }}
    </div>
  </div>
</template>

<script>
import { highLightApp } from "@lego";
import { Pic } from "@components";

export default {
  props: [
    "channelId",
    "cpId",
    "desc",
    "icon",
    "id",
    "index",
    "keyword",
    "name",
    "rId",
    "type",
    "url",
  ],
  components: {
    Pic,
  },
  created() {
    this.dataHref = this.$utils.inject({
      hap: this.url,
    });
    this.dataLog = this.$utils.inject({
      resource_id: this.rId || this.id,
      resource_name: this.name,
      resource_type: "hap",
      resource_source: 1,
      resource_position: this.index,
      resource_provider: this.cpId,
    });
    this.buttonText = "秒开";
  },
  methods: {
    highLightApp,
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
@include b(little-game-item) {
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
  }
}
</style>
