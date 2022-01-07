<template>
  <div class="gs-components-minor-net-error df jcsb aic fs_s">
    <div class="gs-components-minor-net-error__border gs_card_bg_color" />
    <div class="gs-components-minor-net-error__icon-box df jcfs aic f1">
      <svg
        width="24"
        height="24"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.55">
          <path
            d="M12.5925 9.40869L9.40752 12.5937L19.4075 22.5937C15.1742 24.5282 11.3184 27.1997 8.02002 30.4837L11.2025 33.6662C14.5106 30.351 18.4523 27.7357 22.7925 25.9762L27.75 30.9237C23.1825 32.2788 19.0264 34.7548 15.66 38.1262L18.845 41.3087C22.2802 37.8646 26.677 35.5403 31.4575 34.6412L37.2325 40.4187C34.6539 40.2355 32.0661 40.608 29.6439 41.5112C27.2217 42.4143 25.0217 43.827 23.1925 45.6537L26.375 48.8387C28.9298 46.2898 32.3912 44.8584 36 44.8584C39.6088 44.8584 43.0703 46.2898 45.625 48.8387L45.6375 48.8237L59.4075 62.5937L62.59 59.4112L12.5925 9.40869Z"
            :fill="$utils.isDark ? 'white' : 'black'"
          />
          <path
            d="M48.091 25.584C43.3176 23.848 38.2226 23.1759 33.1623 23.6145L29.0973 19.547C35.3625 18.4244 41.8061 18.8324 47.8797 20.7363C53.9532 22.6403 59.4767 25.9837 63.9798 30.482L60.7973 33.6645C57.2009 30.0777 52.8644 27.3199 48.091 25.584Z"
            :fill="$utils.isDark ? 'white' : 'black'"
          />
          <path
            d="M53.1545 41.3059C51.053 39.2001 48.5774 37.5045 45.8545 36.3059L39.4995 29.9434C45.8716 30.7033 51.803 33.5845 56.3395 38.1234L53.1545 41.3059Z"
            :fill="$utils.isDark ? 'white' : 'black'"
          />
          <path
            d="M35.9996 58.4641L30.3796 52.8441C31.8704 51.3541 33.8919 50.5171 35.9996 50.5171C38.1074 50.5171 40.1288 51.3541 41.6196 52.8441L35.9996 58.4641Z"
            :fill="$utils.isDark ? 'white' : 'black'"
          />
        </g>
      </svg>
      <div
        class="mi_left-s fw_normal cl_normal lc1"
        :style="`margin-top: 1px;`"
      >
        {{ errorInfo }}
      </div>
    </div>
    <div
      class="gs-components-minor-net-error__handle-text fw_medium"
      :style="`margin-top: 1px;`"
      @click="handleFc"
      :data-log="dataLog"
      data-href=""
    >
      {{ handleInfo }}
    </div>
  </div>
</template>

<script>
import { launchSettings } from "@lego";
export default {
  props: {
    errorInfo: {
      type: String,
      default: "无网络连接，请检查你的网络设置",
    },
    handleInfo: {
      type: String,
      default: "设置",
    },
    handle: {
      type: Function,
      default: () => {},
    },
    dataLog: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      nReload: true,
    };
  },
  methods: {
    handleFc: function () {
      launchSettings();
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-components-"; // 可配置的命名空间
@include b(minor-net-error) {
  position: relative;
  background-color: transparent;
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 10px 14px 10px 14px;
  @include e(border) {
    position: absolute;
    z-index: 0;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    border: 1px solid rgba(0, 0, 0, 0.12);
    transform: scale(0.33333333);
    border-radius: 24px;
    margin-left: -1px;
  }
  @include e(icon-box) {
    z-index: 1;
    width: 24px;
    height: 24px;
  }
  @include e(handle-text) {
    z-index: 1;
    color: #2660f5;
  }
}
</style>
