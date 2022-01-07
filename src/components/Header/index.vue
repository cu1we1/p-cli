<template>
  <div :class="rootClass">
    <template v-if="isNotSlot">
      <slot />
    </template>
    <template v-else-if="!$slots.actionEle">
      <slot name="prefixEle" class="df aic mi_left-xs" />
      <p :class="cnText">
        <slot />
      </p>
      <slot name="suffixEle" class="dib fs0 mi_left-xxxxs" />
    </template>
    <template v-else>
      <div class="df f1 aic">
        <slot name="prefixEle" class="df aic mi_left-xs" />
        <p :class="cnText">
          <slot />
        </p>
        <slot name="suffixEle" class="dib fs0 mi_left-xxxxs" />
      </div>
      <slot name="actionEle" />
    </template>
  </div>
</template>

<script>
import { isFontColor, isFontSize, isWeight } from "@lego";

export default {
  name: "Header",
  props: {
    maxLines: {
      validator: value => [1, 2, 3].includes(value),
      default: 1
    },
    color: {
      validator: value => isFontColor(value),
      default: "darkest"
    },
    size: {
      validator: value => isFontSize(value),
      default: "l"
    },
    weight: {
      validator: value => isWeight(value),
      default: "normal"
    },
    inverse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    rootClass() {
      if (this.isNotSlot) {
        return this.cnText;
      } else if (!this.$slots.actionEle) {
        return "df aic";
      }
      return "df";
    },
    isNotSlot() {
      let { prefixEle, suffixEle, actionEle } = this.$slots;
      return !prefixEle && !suffixEle && !actionEle;
    },
    cnText() {
      const { maxLines, size, color, weight, inverse } = this;
      let cnText = {
        [`lc${maxLines}`]: maxLines,
        [`fs_${size}`]: size,
        [`cl${inverse ? "i" : ""}_${color}`]: color,
        [`fw_${weight}`]: weight
      };
      return cnText;
    }
  }
};
</script>

<style></style>
