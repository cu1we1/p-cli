<template>
  <div
    :id="`${item.k ? item.k : keys}_item_${index}`"
    class="medusa-sort-local-result-single-file"
    data-href=""
    data-exp="0"
    :data-log="
      $utils.inject({
        resource_type: item.k ? item.k : keys,
        resource_position: index + 1,
        resource_name: item.title,
        resource_source: -1,
        resource_id: item.intentPackage ? item.intentPackage : '',
      })
    "
    ref="color_popper"
    @click="() => openSearchApp(keys, item)"
  >
    <color-popper
      :offset="popperOffset"
      trigger="long-press"
      show-arrow
      placement="bottom-start"
      slot="reference"
      @show="clickPattern()"
    >
      <div
        slot="reference"
        :class="`df aic${
          len !== index + 1 ? ' medusa-sort-local-result-single-file__list' : ''
        }`"
      >
        <Pic perfType="local" :src="item.url || icon || item.icon" />
        <div
          class="
            f1
            mi_left-l
            medusa-sort-local-result-single-file__list--mw-248
          "
        >
          <div
            :id="`${item.k ? item.k : keys}_title`"
            class="fs_l fw_normal cl_darkest"
          >
            <clip-and-high-light
              :str="item.title"
              :q="q"
              count="30"
            ></clip-and-high-light>
          </div>
          <div
            v-if="item.subTitle"
            class="fs_s fw_normal cl_normal mi_top-xxxxs"
          >
            <clip-and-high-light
              :str="item.subTitle"
              q=""
              count="39"
            ></clip-and-high-light>
          </div>
        </div>
      </div>
      <div
        :data-log="
          $utils.inject({
            control_name: '发送',
            click_pattern: 'click',
          })
        "
        @click.stop="
          (e) => {
            clickPopper(e);
            sendTo(item.intentAction);
          }
        "
      >
        发送
      </div>
    </color-popper>
  </div>
</template>

<script>
import { openSearchApp, sendTo, trackClickBaseEle } from "@lego";
import ClipAndHighLight from "../ClipAndHighLight";
import { Pic } from "@components";
export default {
  props: ["item", "index", "q", "icon", "keys"],
  data() {
    return {
      popperOffset: null,
    };
  },
  components: {
    ClipAndHighLight,
    Pic,
  },
  computed: {
    len() {
      return Array.isArray(this.list) ? this.list.length : 0;
    },
  },
  mounted() {
    const el = this.$refs.color_popper;
    if (el) {
      el.addEventListener("touchstart", this.touchStartFunc);
    }
  },
  beforeDestroy() {
    const el = this.$refs.color_popper;
    if (el) {
      el.removeEventListener("touchstart", this.touchStartFunc);
    }
  },
  methods: {
    openSearchApp,
    sendTo,
    clickPopper(e) {
      if (e.target) {
        trackClickBaseEle(e.target);
      }
    },
    clickPattern() {
      let el = this.$refs;
      trackClickBaseEle(el, {
        click_pattern: "long_press",
      });
    },
    touchStartFunc(e) {
      const el = this.$refs.color_popper;
      const [touchList] = e.targetTouches;
      const { pageX, pageY } = touchList;
      const touchInfo = [pageX, pageY];
      if (el) {
        const itemRect = el.getBoundingClientRect();
        const [touchX, touchY] = touchInfo;
        const { x, y, height } = itemRect;
        const offsetX = touchX - x - 23;
        const offsetY = touchY - y - height;
        setTimeout(() => {
          this.popperOffset = [offsetX, offsetY];
        }, 50);
      }
    },
  },
};
</script>

<style lang="scss">
$namespace: "medusa-sort-local-result-"; // 可配置的命名空间
@include b(single-file) {
  &:last-of-type &__list {
    margin-bottom: 6px;
  }
  @include e(list) {
    margin-bottom: 24px;
    @include m(mw-248) {
      max-width: 248px;
    }
  }
}
</style>