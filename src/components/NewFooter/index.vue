<template>
  <div class="L_nfooter-con df jcsb">
    <div class="df aic jcfs">
      <div
        v-if="iconUrl"
        class="L_nfooter-pic"
        :style="`background-image: url(${iconUrl})`"
      />
      <p :class="['lc1 cl_ldark fw_normal', `fs_${size}`]">{{ text }}</p>
    </div>
    <div class="df aic jcfe" v-if="showRight">
      <p :class="['L_nfooter-p18p cl_ldark fw_normal lc1', `fs_${size}`]">
        {{ moreText }}
      </p>
      <div class="L_nfooter-icon">
        <AngleRight />
      </div>
    </div>
  </div>
</template>

<script>
import AngleRight from "../AngleRight";

export default {
  name: "NewFooter",
  components: {
    AngleRight,
  },
  props: {
    iconUrl: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "新浪微博",
    },
    moreText: {
      type: String,
      default: "查看更多",
    },
    size: {
      validator(value) {
        return ["s", "m"].includes(value);
      },
      default: "s",
    },
    showRight: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.L_footer-con {
  display: flex;
  justify-content: center;
  align-items: center;
}

.L_footer-iconup {
  // position: relative;
  // top: -1;
  animation-name: rotateUp;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  @keyframes rotateUp {
    from {
      transform-origin: center;
    }
    to {
      transform-origin: center;
      transform: rotate3d(0, 0, 1, 180deg);
    }
  }
}

.L_footer-icondn {
  // position: relative;
  // top: -1;
  animation-name: rotateDown;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  @keyframes rotateDown {
    to {
      transform-origin: center;
    }
    from {
      transform-origin: center;
      transform: rotate3d(0, 0, 1, 180deg);
    }
  }
}

.L_nfooter-con {
  padding-top: 16px;
}
.L_nfooter-pic {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-size: cover;
  background-repeat: no-repeat;
}
.L_nfooter-p18p {
  line-height: 18px !important;
}
.L_nfooter-icon {
  height: 18px;
  display: flex;
  align-items: center;
}
.L_nfooter-icon-r {
  display: inline-block;
  width: 6px;
  height: 11px;
  margin-bottom: 1px;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
