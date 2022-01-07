<template>
  <div class="gs-components-button" ref="gs_progress_button">
    <div
      v-if="isShowProgress"
      v-feedback
      class="gs-components-button__progress-btn"
      data-href=""
      :data-log="log"
      :data-adlog="adLog"
      @click="changeDownloadState"
    >
      <div
        class="gs-components-button__progress-btn--under-bg"
        :style="`width: ${downloadPercent}`"
      />
      <div class="gs-components-button__progress-btn--middle-text">
        {{ downloadStatus || downloadPercent }}
      </div>
      <div
        class="gs-components-button__progress-btn-mask"
        :style="`width: ${downloadPercent}`"
      >
        <div class="gs-components-button__progress-btn-mask--text">
          {{ downloadStatus || downloadPercent }}
        </div>
      </div>
    </div>
    <div
      v-else
      v-feedback
      class="gs_button_normal gs-components-button__progress-btn"
      :data-href="href"
      :data-log="log"
      :data-adlog="adLog"
    >
      {{ defaultText }}
    </div>
  </div>
</template>

<script>
import {
  pushAppDownload,
  pauseDownloadByPkg,
  trackAppBaseEle,
  jump,
} from "@lego";
import { setRStatusToUp } from "@lego";
const APP_DOWNLOAD_STATE = {
  "-2": "",
  "-1": "download_fail",
  0: "",
  1: "",
  2: "",
  3: "download_succ",
  4: "install_trigger",
  5: "install_succ",
  8: "install_fail",
  11: "",
  12: "",
  13: "open_trigger",
  14: "open_succ",
  15: "open_fail",
  16: "download_trigger",
  17: "download_paused",
};
export default {
  // 正在下载的app信息
  inject: ["medusa"],
  props: [
    "pkg",
    "url",
    "transparent",
    "index",
    "optId",
    "name",
    "token",
    "type",
    // 按钮尺寸，sug页使用大尺寸（52*28），其余结果页使用小尺寸（52*24）。
    "size",
    "tkRef",
    "tkCon",
  ],
  data() {
    // button中的文本
    const defaultText = this.type === "hap" ? "秒开" : "安装";
    // 跳转链接
    const href = this.$utils.inject(
      this.type === "hap"
        ? this.url
        : {
            native: {
              pkg: this.pkg,
              autoDownload: true,
              url: this.url,
              transparent: this.transparent,
              adpos: this.index,
            },
          }
    );
    // 埋点信息
    const log = this.$utils.inject({
      control_name: defaultText,
      control_position: this.index,
      control_type: "button",
    });
    // 广告埋点信息
    const adLog = this.$utils.inject({
      optValue: this.optId || this.name,
      optKey: "1/1/1/0/1",
    });
    const appInfo = {
      pkg: this.pkg,
      autoDownload: true,
      url: this.url,
      transparent: this.transparent,
      adpos: this.index,
      // token: this.token || "4f046f05fd7557f0",
      token: this.token,
      tk_con: this.tkCon,
      tk_ref: this.tkRef,
      name: this.name,
    };
    return {
      defaultText,
      href,
      log,
      adLog,
      // 是否已经开始下载
      startDownload: false,
      // 是否暂停下载
      pausedDownload: false,
      // 是否完成下载
      finishedDownload: false,
      appInfo,
      // 上一时刻下载进度。
      lastPercent: "0%",
    };
  },
  mounted() {
    this.setRStatusToUp(this.$refs.gs_progress_button, this.resourceStatus);
  },
  watch: {
    downloadStatus: function (newValue) {
      if (newValue === "打开") {
        this.finishedDownload = true;
      } else if (newValue === "重新开始") {
        this.startDownload = false;
      } else if (newValue === "继续") {
        // 点击暂停以后锁定状态更新，1s以后开始接收状态更新。
        this.medusa.pauseReceivingDownloadProgressOfApp(this.pkg);
      }
    },
    // resource_status改变的时候
    resourceStatus: function (newValue) {
      if (!newValue) return;
      this.setRStatusToUp(this.$refs.gs_progress_button, this.resourceStatus);
    },
    // 主要是兼容客户端mock的暂停状态：percent为0。
    downloadPercent: function (newValue) {
      this.lastPercent = newValue;
    },
    appStatus: function (newValue) {
      this.trackAppStatus(newValue);
    },
  },
  computed: {
    isShowProgress() {
      return this.medusa.isSupAppDownloadProgress && this.type !== "hap";
    },
    appStatus() {
      return this.progressInfo?.status;
    },
    // 父组件获取的resource_status的取值。
    resourceStatus() {
      const status = this.isShowProgress
        ? this.logDownloadStatus
        : this.defaultText;
      return status;
    },
    progressInfo() {
      if (!this.medusa.isSupAppDownloadProgress) return {};
      return this.medusa.downloadAppsInfo[this.pkg] || {};
    },
    downloadPercent() {
      // 同步下载进度。
      const { percent, status } = this.progressInfo;
      // 如果是暂停，那么返回上一时刻的进度
      if (status === 2 && percent === 0) {
        return this.lastPercent;
      }
      return `${Number(percent).toFixed(1)}%`;
    },
    // 父组件用于取值的computed
    logDownloadStatus() {
      const { status } = this.progressInfo;
      switch (status) {
        case 0:
        case 1:
          return "下载中";
        case 2:
          return "暂停";
        case 3:
        case 4:
          return "安装中";
        case 5:
          return "安装完成";
        case 8:
          return "失败";
        default:
          return "默认";
      }
    },
    downloadStatus() {
      const { status } = this.progressInfo;
      switch (status) {
        case -1:
        case 0:
        case 1:
          return "";
        case 2:
          return "继续";
        case 3:
        case 4:
          return "安装中";
        case 5:
          return "打开";
        case 8:
          return "0.0%";
        default:
          return "安装";
      }
    },
  },
  methods: {
    changeDownloadState() {
      if (this.finishedDownload) {
        this.trackAppStatus(13);
        this.openFinishedApp();
        return;
      }
      const { status } = this.progressInfo;
      if (status == -2) {
        // 开始下载。
        pushAppDownload(this.appInfo);
        this.startDownload = true;
        this.trackAppStatus(16);
        return;
      }
      if (!this.startDownload || (status !== 0 && !status) || status === 2) {
        // 如果没有开始下载，或者下载以后无状态更新，或者暂停中。点击以后调用下载方法。
        pushAppDownload(this.appInfo);
        this.startDownload = true;
        this.pausedDownload = false;
        this.trackAppStatus(16);
      } else if (!this.pausedDownload && status === 0) {
        // 如果正在下载中，点击以后调用暂停下载的方法。
        pauseDownloadByPkg(this.pkg);
        this.pausedDownload = true;
        this.trackAppStatus(17);
      }
    },
    setRStatusToUp,
    trackAppStatus(status) {
      const scenes = APP_DOWNLOAD_STATE[status];
      if (!scenes) return;
      trackAppBaseEle(this.$refs.gs_progress_button, {
        scenes: scenes,
      });
    },
    openFinishedApp() {
      /**
       * '1':打开成功。
       * !'1':打开失败。
       */
      const openAppResults = jump(this.href);
      if (openAppResults === "1") {
        this.trackAppStatus(14);
      } else {
        this.trackAppStatus(15);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
$namespace: "gs-components-"; // 可配置的命名空间
@include b(button) {
  @include e(btn) {
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
  }
  @include e(progress-btn) {
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
    @include e(progress-btn-mask) {
      @include m(text) {
        height: 28px;
        line-height: 28px;
      }
    }
  }
  @include e(progress-btn) {
    position: relative;
    overflow: hidden;
    font-weight: 700;
    font-size: 14px;
    text-align: center;
    color: #2660f5;
    width: 52px;
    background-color: rgba(38, 96, 245, 0.1);
    @include m(under-bg) {
      position: absolute;
      left: 0;
      background-color: #2660f5;
      z-index: 3;
      height: inherit;
    }
    @include m(middle-text) {
      position: absolute;
      width: inherit;
      height: inherit;
      left: 0;
      color: #2660f5;
    }
    @include e(progress-btn-mask) {
      position: absolute;
      left: 0;
      height: inherit;
      z-index: 7;
      overflow: hidden;
      @include m(text) {
        z-index: 7;
        position: absolute;
        left: 0;
        width: 52px;
        color: #fff;
      }
    }
  }
}
</style>