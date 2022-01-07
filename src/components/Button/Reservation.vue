<template>
  <div
    v-feedback
    :class="`gs-components-reservation__style--${
      state === '0' ? 'reservation' : 'cancel-reservation'
    }`"
    @click="changeState"
    data-href=""
    :data-log="log"
    ref="gs_reservation_button"
  >
    {{ innerText }}
  </div>
</template>

<script>
import { reserveGame, jsonParse, showToast, trackAppBaseEle } from "@lego";
/**
 * appointment_trigger:触发预约
 * appointment_succ:预约成功
 * appointment_fail:预约失败
 * cancel_appointment:触发取消预约
 * cancel_appointment_suss:取消预约成功
 * cancel_appointment_fail:取消预约失败
 */
const GAME_DOWNLOAD_STATE = {
  1: "appointment_trigger",
  2: "appointment_succ",
  3: "appointment_fail",
  4: "cancel_appointment",
  5: "cancel_appointment_suss",
  6: "cancel_appointment_fail",
};
export default {
  inject: ["medusa"],
  props: ["reservationState", "gameId", "appName", "keyword", "pkg"],
  data() {
    return {
      // 预约状态，0：未预约，1：已预约。
      state: this.reservationState,
    };
  },
  computed: {
    innerText() {
      return this.state === "0" ? "预约" : "已预约";
    },
    log() {
      return this.$utils.inject({
        control_name: this.state === "0" ? "预约" : "已预约",
      });
    },
  },
  watch: {
    // 监听全局游戏预约状态改变。
    "medusa.gamesPKGNeedUpdateStatus"(newV) {
      this.state = newV[this.pkg] || this.reservationState;
    },
  },
  methods: {
    changeState() {
      // 如果当前状态是0：未预约，点击以后调用预约。
      if (this.state === "0") {
        this.trackGameStatus(1);
        if (this.medusa.hasNetwork) {
          reserveGame(
            "reserveapp",
            this.gameId,
            this.keyword,
            this.appName,
            this.reservation
          );
        } else {
          showToast("网络无连接，预约失败");
          this.trackGameStatus(3);
        }
      } else {
        // 如果当前状态是1：已预约，点击以后调用取消预约。
        this.trackGameStatus(4);
        if (this.medusa.hasNetwork) {
          reserveGame(
            "cancelreservea",
            this.gameId,
            this.keyword,
            this.appName,
            this.cancelReservation
          );
        } else {
          showToast("网络无连接，取消预约失败");
          this.trackGameStatus(6);
        }
      }
    },
    // 预约方法
    reservation(res) {
      const { result } = res || {};
      if (!result) return;
      const { code, msg } = jsonParse(result);
      switch (code) {
        case 200:
          this.state = "1";
          showToast("预约成功，游戏上架后将在WLAN网络下自动安装游戏及资源包。");
          this.medusa.gamesUpdateStatus(this.pkg, "1");
          this.trackGameStatus(2);
          break;
        case 402:
        case 403:
        case 406:
        case 500:
          showToast(msg);
          this.trackGameStatus(3);
          break;
        default:
          showToast("预约失败");
          this.trackGameStatus(3);
          break;
      }
    },
    // 取消预约方法
    cancelReservation(res) {
      const { result } = res || {};
      if (!result) return;
      const { msg, code } = jsonParse(result);
      switch (code) {
        case 200:
          this.state = "0";
          showToast("已取消预约");
          this.medusa.gamesUpdateStatus(this.pkg, "0");
          this.trackGameStatus(5);
          break;
        case 402:
        case 403:
        case 406:
        case 500:
          showToast(msg);
          this.trackGameStatus(6);
          break;
        default:
          showToast("取消预约失败");
          this.trackGameStatus(6);
          break;
      }
    },
    trackGameStatus(status) {
      const scenes = GAME_DOWNLOAD_STATE[status];
      if (!scenes) return;
      trackAppBaseEle(this.$refs.gs_reservation_button, {
        scenes: scenes,
      });
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-components-"; // 可配置的命名空间
@mixin button {
  font-weight: 700;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  width: 52px;
  height: 28px;
  border-radius: 14px;
}
@include b(reservation) {
  @include e(style) {
    @include m(reservation) {
      @include button;
      color: #2660f5;
      background-color: rgba(38, 96, 245, 0.1);
    }
    @include m(cancel-reservation) {
      @include button;
      color: #fff;
      background-color: #e5e5e5;
    }
  }
}
</style>
