<template>
  <!-- 顶部tips卡，支持简单交互 -->
  <div
    class="medusa-sort-tips gs_card_bg_color"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: cardId,
        card_position: index,
      })
    "
  >
    <div class="medusa-sort-tips__info">
      <svg
        class="medusa-sort-tips__info--icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.9993 4.41699C7.81119 4.41699 4.41602 7.81217 4.41602 12.0003C4.41602 16.1885 7.81119 19.5837 11.9993 19.5837C16.1875 19.5837 19.5827 16.1885 19.5827 12.0003C19.5827 7.81217 16.1875 4.41699 11.9993 4.41699ZM2.91602 12.0003C2.91602 6.98374 6.98276 2.91699 11.9993 2.91699C17.0159 2.91699 21.0827 6.98374 21.0827 12.0003C21.0827 17.0169 17.0159 21.0837 11.9993 21.0837C6.98276 21.0837 2.91602 17.0169 2.91602 12.0003Z"
          :fill="$utils.isDark ? 'white' : 'black'"
          fill-opacity="0.55"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2493 12.917V7.91699H12.7494V12.917H11.2493Z"
          :fill="$utils.isDark ? 'white' : 'black'"
          fill-opacity="0.55"
        />
        <path
          d="M11.9993 16.042C12.5746 16.042 13.0409 15.5756 13.0409 15.0003C13.0409 14.425 12.5746 13.9587 11.9993 13.9587C11.424 13.9587 10.9576 14.425 10.9576 15.0003C10.9576 15.5756 11.424 16.042 11.9993 16.042Z"
          :fill="$utils.isDark ? 'white' : 'black'"
          fill-opacity="0.55"
        />
      </svg>
      <div class="medusa-sort-tips__info--text lc1">
        {{ info }}
      </div>
    </div>
    <div class="medusa-sort-tips__buttons">
      <div
        data-href=""
        :data-log="
          $utils.inject({
            control_name: action,
            control_position: 2,
            control_type: 'button',
          })
        "
        class="medusa-sort-tips__buttons--btn"
        @click.stop="actionFunc"
        v-feedback
      >
        {{ action }}
      </div>
      <div
        data-href=""
        :data-log="
          $utils.inject({
            control_name: dismiss,
            control_position: 1,
            control_type: 'button',
          })
        "
        class="medusa-sort-tips__buttons--btn"
        @click.stop="dismissFunc"
        v-feedback
      >
        {{ dismiss }}
      </div>
    </div>
  </div>
</template>

<script>
import { trackClickBaseEle } from "@lego";
export default {
  props: {
    //用于埋点使用card_position
    index: {
      type: Number,
      required: true,
    },
    // 卡片主要信息。
    cardId: {
      type: String,
      required: true,
    },
    // 交互文案。
    info: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      default: "刷新",
    },
    dismiss: {
      type: String,
      default: "取消",
    },
    clickAction: {
      type: Function,
      default: () => {},
    },
    clickDismiss: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    actionFunc(e) {
      e.target && trackClickBaseEle(e.target);
      this.clickAction && this.clickAction();
    },
    dismissFunc(e) {
      e.target && trackClickBaseEle(e.target);
      this.clickDismiss && this.clickDismiss();
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-sort-"; // 可配置的命名空间
@include b(tips) {
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 8px 4px 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include e(info) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    @include m(text) {
      margin-left: 12px;
      font-size: 12px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.55);
    }
    @include m(icon) {
      flex-shrink: 0;
    }
  }
  @include e(buttons) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 12px;
    @include m(btn) {
      font-size: 12px;
      line-height: 24px;
      color: #2660f5;
      font-weight: 500;
      padding: 0 12px;
      flex-shrink: 0;
    }
  }
}
</style>
