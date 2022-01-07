<template>
  <div
    class="gs-components-multi-title df jcsb aic mi_bottom-xs"
    :id="`automated_${cardKey}_title`"
  >
    <div class="card_title gs-components-multi-title__title">
      {{ title }}
    </div>
    <div
      class="df jcfe aic"
      @click="clickMore"
      :data-log="dataLog"
      :data-href="dataHref"
      :id="`automated_${cardKey}_title_more`"
    >
      <div
        class="gs-components-multi-title__more-text cl_ldark"
        v-if="showMore && moreText"
      >
        {{ moreText }}
      </div>
      <div ref="cvs" v-if="showMore" :class="iconClass">
        <svg
          width="6"
          height="12"
          viewBox="0 0 6 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.81494 5.55667L0.95383 0.695557L0.0699463 1.57944L4.48912 5.99861L0.0699467 10.4178L0.95383 11.3017L5.81494 6.44055C6.05902 6.19647 6.05902 5.80075 5.81494 5.55667Z"
            :fill="$utils.isDark ? 'white' : 'black'"
            fill-opacity="0.3"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiTitle",
  props: {
    dataLog: {
      type: String,
    },
    dataHref: {
      type: String,
    },
    opacity: {
      type: Number,
      default: 0.55,
    },
    title: {
      type: String,
    },
    direction: {
      validator: function (value) {
        return ["up", "down"].indexOf(value) !== -1;
      },
    },
    click: {
      type: Function,
      default: () => {},
    },
    showMore: {
      type: Boolean,
      default: false,
    },
    iconCls: {
      type: String,
      default: "",
    },
    moreText: {
      type: String,
      default: "",
    },
    cardKey: {
      type: String,
      default: "",
    },
  },
  computed: {
    moreCls() {
      return `gs-components-multi-title__view-more--${this.direction}`;
    },
    iconClass() {
      return `${this.iconCls} df aic jcfe gs-components-multi-title__click-more`;
    },
  },
  methods: {
    clickMore() {
      if (this.click) {
        this.click();
      }
    },
  },
};
</script>

<style scoped lang='scss'>
$namespace: "gs-components-"; // 可配置的命名空间
@include b(multi-title) {
  @include e(title) {
    margin: 0 !important;
    padding-top: 1px;
    box-sizing: border-box;
  }
  @include e(click-more) {
    width: 16px;
    height: 28px;
  }
  @include e(more-text) {
    font-size: 12px;
    line-height: 28px;
    font-weight: 500;
  }
  @include e(view-more) {
    @include m(up) {
      transform: rotate(-90deg);
    }
    @include m(down) {
      transform: rotate(90deg);
    }
  }
}
</style>
