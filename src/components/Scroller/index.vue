<template>
  <color-scroll
    @scroll="scrollFunc"
    @scroll-end="scrollEnd"
    @transition-end="transitionEndFunc"
    v-bind="$attrs"
    ref="scroller"
  >
    <slot />
  </color-scroll>
</template>

<script>
import {
  debounceExport,
  debounceLazyLoadImage,
  setKeyboardVisible,
  setInputTextSelected,
} from "@lego";
export default {
  name: "Scroller",
  props: {
    scroll: {
      type: Function,
    },
    scrollEnd: {
      type: Function,
      default: () => {},
    },
    addKeybordAction: {
      type: Boolean,
      default: false,
    },
    transitionEnd: {
      type: Function,
    },
    lazyLoad: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      transitionDirection: "0",
    };
  },
  mounted() {
    if (this.addKeybordAction) {
      document.addEventListener("touchend", this.keybordAction);
    }
  },
  beforeDestroy() {
    if (this.addKeybordAction) {
      document.removeEventListener("touchend", this.keybordAction);
    }
  },
  methods: {
    transitionEndFunc() {
      if (this.addKeybordAction && this.transitionDirection === "1") {
        setKeyboardVisible(1);
        setInputTextSelected(1);
        this.transitionDirection = "0";
      }
      if (this.transitionEnd) {
        this.transitionEnd();
      }
    },
    keybordAction() {
      const currentPosition =
        this.$refs.scroller && this.$refs.scroller.currentPosition;
      if (currentPosition > 50) {
        this.transitionDirection = "1";
      }
    },
    scrollFunc: function (e) {
      if (this.lazyLoad) {
        debounceLazyLoadImage();
        debounceExport();
      }
      if (this.scroll) {
        this.scroll(e);
      }
    },
  },
};
</script>

<style></style>
