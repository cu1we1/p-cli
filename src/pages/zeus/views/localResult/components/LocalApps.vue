<template>
  <div>
    <div
      :class="rootClass"
      :data-log="
        $utils.inject({
          resource_name: itemData.title,
          resource_type: itemData.key,
          resource_source: -1,
          resource_position: idx + 1,
        })
      "
      :data-monitor-exp="
        itemData.intentExtra && itemData.intentExtra.appMonitorUrl
          ? itemData.intentExtra.appMonitorUrl
          : ''
      "
      data-exp="0"
      @click="openApp(parentKey, itemData)"
    >
      <div class="bsbb f1 w100 fs_m cl_normal">
        <div data-href="" class="df aic">
          <Pic :src="itemIcon" />
          <div class="f1 mi_left-l mw248">
            <div
              class="fs_l cl_darker"
              v-html="matchCharacters(itemData.title, searchQ, null, 1)"
            />
            <div
              ref="cvs"
              :data-log="
                $utils.inject({
                  control_name: 'viewMore',
                  control_position: idx,
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
              v-if="itemData.subTitle"
              v-html="matchCharacters(itemData.subTitle, searchQ, null, 1)"
              class="fs_s fw_normal cl_normal mi_top-xxxxs"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCuts" class="df fww jcsb">
      <div
        v-for="(shortcut, idxs) in shortCurts"
        data-href=""
        data-exp="0"
        :data-monitor-exp="
          shortcut.intentExtra && shortcut.intentExtra.shortcutMonitorUrl
            ? shortcut.intentExtra.shortcutMonitorUrl
            : ''
        "
        :data-log="
          $utils.inject({
            resource_type: `${parentKey}-shortcuts`,
            resource_position: idxs,
            resource_name: shortcut.title,
            resource_source: -1,
            resource_id: itemData.intentPackage ? itemData.intentPackage : '',
          })
        "
        class="df aic jcc f1 shortcut_item cl_darker"
        :key="shortcut.title + idxs"
        @click="() => openApp('shortcuts', shortcut)"
      >
        <div class="lc1">
          <div v-html="highLightApp(shortcut.title, searchQ, 1)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { openSearchApp, trackClickBaseEle, oreport } from "@lego";
import { matchCharacters, highLightApp } from "@lego";
import { AngleRight, Pic } from "@components";
export default {
  name: "Local",
  components: {
    AngleRight,
    Pic,
  },
  props: {
    itemData: {
      type: Object,
    },
    parentKey: {
      type: String,
    },
    parentIcon: {
      type: String,
    },
    idx: {
      type: Number,
    },
    parentQ: {
      type: String,
    },
    log: {
      type: Object,
      default() {
        return {};
      },
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      direction: "down",
    };
  },
  computed: {
    rootClass() {
      let className = "df aic pd-tb12 Local";
      !this.idx && (className += " pd_top-0");
      this.idx === Number(this.total) - 1 && (className += " pd_bottom-0");
      return className;
    },
    shortCurts() {
      return this.isArr(this.itemData.shortCurtList)
        ? this.itemData.shortCurtList.slice(0, 4)
        : [];
    },
    itemIcon() {
      const { itemData } = this;
      return itemData.url || itemData.icon || this.parentIcon;
    },
    iconCls() {
      return `icon_${this.direction}`;
    },
    showCuts() {
      return this.direction === "up";
    },
    searchQ() {
      if (this.parentKey === "apps" && this.itemData.hitKey) {
        return this.itemData.hitKey;
      }

      return this.parentQ;
    },
  },
  methods: {
    matchCharacters,
    highLightApp,
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
    openApp(k, item) {
      openSearchApp(k, item);
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
          `query: ${this.searchQ}, ---Monitoring link error---, ${error}`
        );
        oreport.reportError(
          new Error(
            `query: ${this.searchQ}, ---Monitoring link error---, ${error}`
          )
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pd-tb12 {
  padding: 12px 0;
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
.shortcut_item {
  max-width: 48.9%;
  min-width: 48.9%;
  height: 36px;
  border-radius: 18px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: rgba(0, 0, 0, 0.03);
  font-size: 12px;
  margin: 8px 0 0 0;
}
</style>
