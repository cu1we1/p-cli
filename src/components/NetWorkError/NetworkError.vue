<template>
  <div class="gs-components-net-work-error">
    <div class="gs-components-net-work-error__content">
      <svg
        v-if="!$utils.isDark"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.8142 49.0933C23.3857 43.5217 30 39.1022 37.2796 36.0869C44.5591 33.0716 52.3613 31.5197 60.2406 31.5197C68.1199 31.5197 75.9221 33.0716 83.2016 36.0869C90.4811 39.1022 97.0955 43.5217 102.667 49.0933L60.2406 91.5197L17.8142 49.0933Z"
          fill="#C4C4C4"
          fill-opacity="0.4"
        />
        <path
          d="M17.5596 66.8867C20.8277 63.6185 24.7076 61.0261 28.9777 59.2574C33.2478 57.4887 37.8244 56.5783 42.4463 56.5783C47.0682 56.5783 51.6448 57.4886 55.9149 59.2574C60.185 61.0261 64.0648 63.6185 67.333 66.8867L42.4463 91.7734L17.5596 66.8867Z"
          fill="#A8A8A8"
          fill-opacity="0.75"
        />
      </svg>
      <svg
        v-else
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M17.8142 49.0933C23.3857 43.5217 30 39.1022 37.2796 36.0869C44.5591 33.0716 52.3613 31.5197 60.2406 31.5197C68.1199 31.5197 75.9221 33.0716 83.2016 36.0869C90.4811 39.1022 97.0955 43.5217 102.667 49.0933L60.2406 91.5197L17.8142 49.0933Z"
            fill="#C4C4C4"
            fill-opacity="0.4"
          />
          <path
            d="M17.5596 66.8867C20.8277 63.6185 24.7076 61.0261 28.9777 59.2574C33.2478 57.4887 37.8244 56.5783 42.4463 56.5783C47.0682 56.5783 51.6448 57.4886 55.9149 59.2574C60.185 61.0261 64.0648 63.6185 67.333 66.8867L42.4463 91.7734L17.5596 66.8867Z"
            fill="#A8A8A8"
            fill-opacity="0.75"
          />
        </g>
      </svg>
      <div class="gs-components-net-work-error__content--title">
        {{ title }}
      </div>
      <div class="gs-components-net-work-error__content--sub-title">
        {{ subTitle }}
      </div>
      <div
        v-feedback
        class="gs-components-net-work-error__button fw_medium"
        v-if="code !== 3000"
        @click="goSetting"
        data-href=""
        :data-log="
          $utils.inject({
            control_id: 'netWorkError',
            control_position: 1,
          })
        "
      >
        设置
      </div>
    </div>
  </div>
</template>

<script>
import { launchSettings } from "@lego";

export default {
  name: "NetworkError",
  props: {
    title: {
      type: String,
      default: "无网络连接",
    },
    code: {
      type: Number,
      default: 1000,
    },
    subTitle: {
      type: String,
      default: "请检查你的网络设置",
    },
    reload: Function,
    showSub: {
      type: Boolean,
      default: true,
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
    type: {
      validator: (val) =>
        ["noContent", "noConnection", "noSearchResults", "noLoading"].includes(
          val
        ),
      default: "noConnection",
    },
  },
  methods: {
    goSetting() {
      launchSettings();
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "gs-components-"; // 可配置的命名空间
@mixin text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.3);
  line-height: 18px;
}
@include b(net-work-error) {
  position: relative;
  height: 100%;
  @include e(content) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @include m(title) {
      @include text;
    }
    @include m(sub-title) {
      @include text;
    }
  }

  @include e(button) {
    font-size: 14px;
    line-height: 20px;
    color: #2660f5;
    margin-top: 10px;
  }
}
</style>
