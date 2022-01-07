<template>
  <div :class="`gs-components-panel ${panelCls}`" ref="panel">
    <div :class="`gs-components-panel__bg ${panelBgCls}`" @click="hidePanel" />
    <div
      :class="`gs-components-panel__content ${panelContentCls}`"
      :style="`height: ${content};`"
    >
      <slot name="header" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ["visible", "content"],
  data() {
    return {
      // 初始化状态是否是展示。
      hadAppendPanel: this.visible,
      panelShowState: this.visible,
      otherShowState: this.visible,
      timeTag: false,
    };
  },
  computed: {
    panelBgCls() {
      return this.otherShowState ? "" : "gs-components-panel__bg--hide";
    },
    panelCls() {
      return this.panelShowState ? "" : "gs-components-panel--hide";
    },
    panelContentCls() {
      return this.otherShowState ? "" : "gs-components-panel__content--hide";
    },
  },
  mounted() {
    if (this.visible) {
      this.appendPanel();
    }
  },
  watch: {
    visible(newV) {
      if (this.timeTag) return;
      this.timeTag = true;
      if (newV && !this.hadAppendPanel) {
        this.appendPanel();
      }
      if (!newV) {
        // 隐藏的时候，先做动画再display:none;
        this.otherShowState = false;
        setTimeout(() => {
          this.panelShowState = false;
          this.timeTag = false;
        }, 400);
      } else {
        // 展示的时候，先display:none;再做动画。
        setTimeout(() => {
          this.otherShowState = true;
          this.timeTag = false;
        }, 100);
        this.panelShowState = true;
      }
    },
  },
  methods: {
    clickPanel() {
      this.panelShowState = "0";
    },
    appendPanel() {
      document.body.appendChild(this.$refs.panel);
      this.hadAppendPanel = true;
    },
    hidePanel() {
      this.$parent.visible = false;
    },
  },
};
</script>

<style scoped lang='scss'>
$namespace: "gs-components-"; // 可配置的命名空间
$namespace: "gs-components-"; // 可配置的命名空间
@include b(panel) {
  @include m(hide) {
    display: none;
  }
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
  @include e(bg) {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #000;
    transition: opacity 400ms;
    opacity: 0.4;
    @include m(hide) {
      opacity: 0;
    }
  }
  @include e(content) {
    border-radius: 18px 18px 0 0;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    z-index: 1;
    background-color: #fff;
    transition: margin-bottom 400ms;
    margin-bottom: 0;
    @include m(hide) {
      margin-bottom: -200%;
    }
  }
}
</style>