<template>
  <transition name="color-area-loading">
    <div v-if="visible" class="color-area-loading" :style="{ background }">
      <div
        ref="area-loading-static-progress"
        class="
          color-area-loading__progress color-area-loading__progress--static
        "
      >
        <svg viewBox="0 0 26 26">
          <circle
            cx="13"
            cy="13"
            r="12"
            class="loading-icon"
            :class="visible ? 'loading-icon--animation' : ''"
          />
        </svg>
      </div>
      <div
        v-if="text"
        class="color-area-loading__description"
        :style="{ color }"
      >
        {{ text }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
$black: #fff;
$font-opacity: 0.85 !default;
$area-loading-background-color: #fafafa !default;
$area-loading-enter-active-transition-duration: 300ms !default;
$area-loading-progress-static-height: 26px !default;
$area-loading-progress-static-width: 26px !default;
$area-loading-enter-opacity: 0 !default;
$area-loading-enter-to-opacity: 1 !default;
$area-loading-description-margin-top: 18px !default;
$area-loading-description-font-size: 14px !default;
$area-loading-description-color: rgba(0, 0, 0, 0.3) !default;
$area-loading-z-index: 300 !default;

$pull-refresh-inner-transitionTimingFunction: cubic-bezier(
  0.33,
  0,
  0,
  1
) !default;
$pull-refresh-height: 74px !default;
$pull-Refresh-loading-length: 3.1415 * 2 * 12;
$pull-Refresh-loading-stoke-width: 2px;

.color-area-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  background-color: $area-loading-background-color;
  z-index: $area-loading-z-index;

  .color-area-loading__progress {
    text-align: center;
    font-size: 0;

    &.color-area-loading__progress--static {
      width: $area-loading-progress-static-height;
      height: $area-loading-progress-static-width;
      margin: 0 auto;
    }
  }

  &.color-area-loading-enter-active {
    transition: opacity $area-loading-enter-active-transition-duration;
  }
  &.color-area-loading-leave-active {
    transition: opacity 0.1s;
  }

  &.color-area-loading-enter,
  &.color-area-loading-leave-to {
    opacity: $area-loading-enter-opacity;
  }

  &.color-area-loading-leave,
  &.color-area-loading-enter-to {
    opacity: $area-loading-enter-to-opacity;
  }
}

.color-area-loading--parent-relative {
  position: relative;
}

.color-area-loading__description {
  margin-top: $area-loading-description-margin-top;
  font-size: $area-loading-description-font-size;
  color: $area-loading-description-color;
}

.loading-icon {
  fill: none;
  stroke-width: $pull-Refresh-loading-stoke-width;
  stroke: $black;
  stroke-opacity: $font-opacity;
  stroke-dasharray: 0, 0, 0.76 * $pull-Refresh-loading-length,
    0.24 * $pull-Refresh-loading-length;
  transform: rotate(90deg);
  transform-origin: center;
}
.loading-icon--animation {
  animation: loadingAnimationLinear 1.25s infinite linear,
    loadingAnimationCubic 1.25s infinite;
}

@keyframes loadingAnimationCubic {
  0% {
    stroke-dasharray: 0, 0, 0.76 * $pull-Refresh-loading-length,
      0.24 * $pull-Refresh-loading-length;
    animation-timing-function: cubic-bezier(0.17, 0.17, 0.83, 1);
  }
  49.36% {
    stroke-dasharray: 0, 0.62 * $pull-Refresh-loading-length,
      0.14 * $pull-Refresh-loading-length, 0.24 * $pull-Refresh-loading-length;
    animation-timing-function: cubic-bezier(0.17, 0, 0.83, 0.83);
  }
  100% {
    stroke-dasharray: 0, 0, 0.76 * $pull-Refresh-loading-length,
      0.24 * $pull-Refresh-loading-length;
  }
}
@keyframes loadingAnimationLinear {
  0% {
    stroke-dashoffset: 0;
    transform: rotate(90deg);
  }
  49.36% {
    stroke-dashoffset: -0.3639 * $pull-Refresh-loading-length;
    transform: rotate(267.696deg);
  }
  100% {
    stroke-dashoffset: -1 * $pull-Refresh-loading-length;
    transform: rotate(450deg);
  }
}
</style>
