<template>
  <div
    :class="`${size} pic gs_icon_border pic-border`"
    :style="picStyle"
    ref="pic"
  >
    <img :src="src" class="img-box" ref="img" />
    <p v-if="text" class="text">{{ text }}</p>
    <span>
      <slot class="corner"></slot>
    </span>
    <i class="play-btn br_xxs pa_center" v-if="isVideo">
      <svg class="p-btn ics_s iccf_normal" viewBox="0, 0, 24, 24" title="">
        <g transform="">
          <path
            d="M5.14132462,0.373248346 L21.6970162,9.82908413 C22.9797517,10.5617226 23.3841428,12.1275139 22.6002488,13.3263769 C22.3750786,13.6707453 22.0654766,13.9601037 21.6970162,14.170551 L5.14132462,23.6263868 C3.85858905,24.3590253 2.1832548,23.9810757 1.39936084,22.7822127 C1.13819083,22.3827874 1,21.9237581 1,21.4556534 L1,2.54398181 C1,1.13897945 2.21866258,-4.0602442e-15 3.72195905,-4.0602442e-15 C4.22281245,-4.0602442e-15 4.71395551,0.129155121 5.14132462,0.373248346 Z"
          ></path>
        </g>
      </svg>
    </i>
  </div>
</template>
<script>
import { performanceTrack } from "@lego";
export default {
  name: "Pic",
  props: {
    src: {
      required: true,
      type: String,
    },
    size: {
      default: "xsss1-1",
      validator(value) {
        return [
          "xssss1-1",
          "xsss1-1",
          "xss1-1",
          "xs1-1",
          "s1-1",
          "m1-1",
          "l1-1",
          "xl1-1",
          "r1-1",
          "r13-5",
          "m3-4",
          "l3-4",
          "r3-4",
          "a1-1",
          "r3-2",
          "s3-2",
          "m3-2",
          "l3-2",
          "r4-1",
          "l4-3",
          "r7-3",
          "r16-9",
        ].includes(value);
      },
    },
    text: {
      default: "",
      type: String,
    },
    center: {
      default: true,
      type: Boolean,
    },
    radius: {
      default: 9,
      type: Number,
    },
    position: {
      type: String,
    },
    lazyLoadAll: {
      type: Boolean,
      default: false,
    },
    isVideo: {
      type: Boolean,
    },
    perfType: {
      type: String,
    },
  },
  mounted() {
    if (this.perfType === "appStore") {
      this.$refs.img.onload = () => {
        !performanceTrack.trackData.appStoreImgLoaded &&
          performanceTrack.track("appStoreImgLoaded");
      };
    } else if (this.perfType === "local") {
      this.$refs.img.onload = () => {
        !performanceTrack.trackData.localResultImgLoaded &&
          performanceTrack.track("localResultImgLoaded");
      };
    }
  },
  data() {
    return {
      picStyle: {
        "border-radius": `${this.radius}px`,
        "--pseudo-ele-fillet-value": ` ${this.radius * 3}px`,
      },
      loaded: false,
    };
  },
};
</script>
<style>
.gs_icon_border::after {
  border-radius: var(--pseudo-ele-fillet-value) !important;
}
</style>
<style lang="scss" scoped>
.pic {
  font-size: 12px;
  color: #000;
  flex-shrink: 0;
  overflow: hidden;
}
.img-box {
  width: 100%;
  height: 100%;
}
.text {
  box-sizing: border-box;
  color: #fff;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 20px;
  padding: 0 5px;
  font-size: 12px;
  line-height: 20px;
  background-color: rgba(0, 0, 0, 0.3);
}
.corner {
  position: absolute;
  font-size: 10px;
  border-radius: 2px;
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
  box-sizing: border-box;
  padding: 0 2px;
  color: #fff;
  line-height: 14px !important;
}
.play-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.5);
  width: 29px;
  height: 24px;
}
.p-btn {
  fill: #fff !important;
  width: 8px;
  height: 8px;
  stroke: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.xssss1-1 {
  width: 24px;
  height: 24px;
}
.xsss1-1 {
  width: 36px;
  height: 36px;
}
.xss1-1 {
  width: 50px;
  height: 50px;
}
.xs1-1 {
  width: 52px;
  height: 52px;
}
.s1-1 {
  width: 60px;
  height: 60px;
}
.m1-1 {
  width: 70px;
  height: 70px;
}
.l1-1 {
  width: 90px;
  height: 90px;
}
.xl1-1 {
  width: 100px;
  height: 100px;
}
.m3-4 {
  width: 90px;
  height: 120px;
}
.l3-4 {
  width: 100px;
  height: 133px;
}
.m3-2 {
  width: 100px;
  height: 67px;
}
.l3-2 {
  width: 130px;
  height: 87px;
}
.r13-5 {
  width: 100%;
  padding-bottom: 38.5%;
}
.l4-3 {
  width: 120px;
  height: 90px;
}
.r1-1 {
  width: 100%;
  padding-bottom: 100%;
}
.r3-2 {
  width: 100%;
  padding-bottom: 66.66667%;
}
.r3-4 {
  width: 100%;
  padding-bottom: 133.33333%;
}
.a1-1 {
  width: 100%;
  height: 100%;
}
.r4-1 {
  width: 100%;
  padding-bottom: 27.77778%;
}
.r7-3 {
  width: 100%;
  padding-bottom: 42.86%;
}
.r16-9 {
  width: 100%;
  padding-bottom: 56.25%;
}
.test {
  width: 100%;
}
.r7-3 .img-box,
.r1-1 .img-box,
.r3-2 .img-box,
.r13-5 .img-box,
.r3-4 .img-box,
.a1-1 .img-box,
.r4-1 .img-box,
.r16-9 .img-box {
  position: absolute;
}
</style>
