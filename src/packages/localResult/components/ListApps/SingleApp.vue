<template>
  <div>
    <div
      :id="`${item.k ? item.k : keys}_item_${index}`"
      data-href=""
      data-exp="0"
      :data-monitor-exp="
        item.intentExtra && item.intentExtra.appMonitorUrl
          ? item.intentExtra.appMonitorUrl
          : ''
      "
      :data-log="
        $utils.inject({
          resource_type: item.k ? item.k : keys,
          resource_position: index,
          resource_name: item.title,
          resource_source: -1,
          resource_id: item.intentPackage ? item.intentPackage : '',
        })
      "
      @click="() => openApp(isRestore ? rKey : keys, item)"
    >
      <div class="df aic mi_bottom-xxxs">
        <div class="single-app_img-box fs0">
          <Pic :src="item.url || icon || item.icon" perfType="local" />
          <div
            v-if="item.isRestore && !appRestored"
            class="single-app_img-box_capp-cover bg_mwlabg"
          >
            <i
              class="single-app_img-box_capp-cover-icon"
              :style="{ backgroundImage: `url(${iconRestore})` }"
            />
          </div>
        </div>

        <div class="f1 single-app_cell-text mw248">
          <div
            :id="`${item.k ? item.k : keys}_title`"
            class="fs_l fw_normal cl_darker df aic"
          >
            <clip-and-high-light
              :str="item.title"
              :q="item.hitKey ? item.hitKey : q"
              count="33"
            ></clip-and-high-light>
          </div>
          <div
            ref="cvs"
            :data-log="
              $utils.inject({
                control_name: 'viewMore',
                control_position: this.index,
                control_type: 'button',
                control_id: 'shortcut-viewMore',
              })
            "
            v-if="isArr(shortCurts)"
            @click.stop="setState"
            class="df jcfs aic shortcut_subTitle_box"
          >
            <div class="shortcut_subTitle">快捷功能</div>
            <AngleRight :class="iconCls" />
          </div>
          <div
            v-else-if="item.subTitle"
            v-html="highLightApp(item.subTitle, q, 1)"
            class="dib mi_top-xxxs"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="showCuts" class="df fww jcsb">
      <div
        v-for="(shortcut, idx) in shortCurts"
        data-href=""
        data-exp="0"
        :data-monitor-exp="
          shortcut.intentExtra && shortcut.intentExtra.shortcutMonitorUrl
            ? shortcut.intentExtra.shortcutMonitorUrl
            : ''
        "
        :data-log="
          $utils.inject({
            resource_type: `${keys}-shortcuts`,
            resource_position: idx,
            resource_name: shortcut.title,
            resource_source: -1,
            resource_id: item.intentPackage ? item.intentPackage : '',
          })
        "
        class="df aic jcc f1 shortcut_item"
        :key="shortcut.title + idx"
        @click="() => openApp('shortcuts', shortcut)"
      >
        <div v-html="highLightApp(shortcut.title, q, 1)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  openSearchApp,
  sendTo,
  trackSearch,
  trackClickBaseEle,
  oreport,
} from "@lego";
import { highLightApp, mThemes } from "@lego";
import { AngleRight, Pic } from "@components";
import ClipAndHighLight from "../ClipAndHighLight";

const { iconRestore } = mThemes;

export default {
  props: [
    "item",
    "keys",
    "icon",
    "q",
    "index",
    "directionIndex",
    "len",
    "rKey",
  ],
  computed: {
    iconCls() {
      return `icon_${this.direction}`;
    },
    showCuts() {
      return this.isArr(this.item.shortCurtList) && this.direction === "up";
    },
    shortCurts() {
      return this.isArr(this.item.shortCurtList)
        ? this.item.shortCurtList.slice(0, 4)
        : [];
    },
  },
  data() {
    const direc = this.index === this.directionIndex ? "up" : "down";
    return {
      direction: direc,
      iconRestore,
      appRestored: false,
      isRestore: this.item ? this.item.isRestore : false,
    };
  },
  components: {
    AngleRight,
    ClipAndHighLight,
    Pic,
  },
  methods: {
    openApp(k, item) {
      const isSuccess = openSearchApp(k, item);
      if (this.isRestore && isSuccess && !this.appRestored) {
        this.appRestored = true;
        this.isRestore = false;
      }
      // 如果存在监测链接，需要上报。
      try {
        const { intentExtra } = item;
        if (intentExtra && Object.keys(intentExtra).length > 0) {
          if (k === "apps") {
            const { appClickUrl } = intentExtra;
            const trackImg = new Image();
            trackImg.src = appClickUrl;
          } else if (k === "shortcuts") {
            const { shortcutClickUrl } = intentExtra;
            const trackImg = new Image();
            trackImg.src = shortcutClickUrl;
          }
        }
      } catch (error) {
        console.error(
          `query: ${this.q}, ---Monitoring link error---, ${error}`
        );
        oreport.reportError(
          new Error(`query: ${this.q}, ---Monitoring link error---, ${error}`)
        );
      }
    },
    sendTo,
    highLightApp,
    showPopper: (log) => {
      trackSearch(log);
    },
    isArr(arr) {
      return Array.isArray(arr) && arr.length > 0;
    },
    setState() {
      if (this.direction === "up") {
        this.direction = "down";
      } else {
        this.direction = "up";
      }
      if (this.$refs.cvs) {
        trackClickBaseEle(this.$refs.cvs);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.shortcut_subTitle {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 400;
}
.icon_up {
  transform: rotate(-90deg);
}
.icon_down {
  transform: rotate(90deg);
}
.shortcut_subTitle_box {
  max-width: 100px;
}
.gs_dark {
  .shortcut_item {
    background-color: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.85);
  }
}
.shortcut_item {
  max-width: 48.4%;
  min-width: 48.4%;
  height: 36px;
  border-radius: 18px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: rgba(0, 0, 0, 0.03);
  font-size: 12px;
  color: rgba(0, 0, 0, 1);
  margin: 10px 0 0 0;
}
.single-app_img-box {
  position: relative;
  border-radius: 0;
  overflow: hidden;
  width: 36px;
  height: 36px;
}

.single-app_cell-text {
  margin-left: 16px;
}

.single-app_img-box_capp-cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 12px;
}
.single-app_img-box_capp-cover-icon {
  display: inline-block;
  position: absolute;
  width: 24px;
  height: 24px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-size: 24px 24px;
}
</style>
