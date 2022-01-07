<template>
  <div
    class="zeus-sugs-app-suggestion-single-local-app"
    data-exp="0"
    :data-log="
      $utils.inject({
        resource_type: isRestore ? rKeys : keys,
        resource_position: index,
        resource_name: data.title,
        resource_source: -1,
        resource_id: data.intentPackage ? data.intentPackage : '',
      })
    "
  >
    <div @click="() => openApp(isRestore ? rKeys : keys, data)" data-href="">
      <div
        :class="`zeus-sugs-app-suggestion-single-local-app__content ${
          localButtonState
            ? 'zeus-sugs-app-suggestion-single-local-app__content--has-bottom'
            : ''
        }`"
      >
        <div class="zeus-sugs-app-suggestion-single-local-app__image">
          <Pic :size="'xss1-1'" :src="getImageSrc()" :radius="12" />
          <div
            v-if="isRestore"
            class="zeus-sugs-app-suggestion-single-local-app__image--restore"
          >
            <i
              class="
                zeus-sugs-app-suggestion-single-local-app__image--restore-i
              "
              :style="`backgroundImage: url(${iconRestore})`"
            ></i>
          </div>
        </div>
        <div
          id="automated_sugLocalApps_name"
          v-html="
            highLightApp(data.title, data.hitKey ? data.hitKey : query, 1)
          "
          class="zeus-sugs-app-suggestion-single-local-app__name lc1"
        ></div>
      </div>
      <div
        v-if="localButtonState"
        id="automated_sugLocalApps_button"
        v-feedback
        :class="`gs_button_normal
          zeus-sugs-app-suggestion-single-local-app__button--${
            isRestore ? 'install' : 'open'
          }`"
        :data-log="
          $utils.inject({
            control_name: '打开',
          })
        "
      >
        {{ btnText }}
      </div>
    </div>
  </div>
</template>

<script>
import { highLightApp, mThemes } from "@lego";
import { openSearchApp } from "@lego";
import { Pic } from "@components";
const { iconRestore } = mThemes;

export default {
  props: [
    "data",
    "type",
    "index",
    "restoreIcon",
    "appsIcon",
    "query",
    /**
     * 是否展示本地app的打开按钮。(是否展示由服务端控制，前端不可单纯的按照此次搜索有无本地和在线来判断)
     * 1、如果同时有本地和在线app，那么需要展示’打开‘按钮。
     * 2、如果只有本地app，那么不展示打开按钮。
     */
    "localButtonState",
  ],
  data() {
    return {
      defaultIcon: this.type === "restore" ? this.restoreIcon : this.appsIcon,
      keys: "apps",
      rKeys: "restore",
      isRestore: this.type === "restore",
      iconRestore,
      btnText: this.type === "restore" ? "安装" : "打开",
    };
  },
  components: {
    Pic,
  },
  methods: {
    highLightApp,
    openApp(k, item) {
      const isSuccess = openSearchApp(k, item);
      if (this.isRestore && isSuccess) {
        this.isRestore = false;
        this.btnText = "打开";
      }
    },
    getImageSrc() {
      return this.data.url || this.data.icon || this.defaultIcon;
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "zeus-sugs-app-suggestion-";
@mixin flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
@include b(single-local-app) {
  @include flex;
  width: 16.666667vw;
  flex-shrink: 0;
  @include e(content) {
    @include flex;
    @include m(has-bottom) {
      margin-bottom: 10px;
    }
    @include e(image) {
      margin-bottom: 8px;
      margin-top: 5px;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      height: 50px;
      @include m(restore) {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 12px;
        background-color: rgba(0, 0, 0, 0.6);
      }
      @include m(restore-i) {
        width: 100%;
        height: 100%;
        display: inline-block;
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50% 20%;
        transform-origin: top left;
      }
    }
    @include e(name) {
      height: 16px;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  @include e(button) {
    @include m(open) {
      background-color: rgba(38, 96, 245, 1);
      color: rgba(255, 255, 255, 0.85);
    }
    @include m(install) {
      color: #2660f5;
      background-color: rgba(38, 96, 245, 0.1);
    }
  }
}
</style>
