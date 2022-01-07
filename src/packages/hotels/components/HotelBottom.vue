<template>
  <div class="gs-hotel-bottom">
    <div class="gs-hotel-bottom__left-info">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="16" height="16" rx="4" fill="#2660F5" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.66672 3.55554C4.1758 3.55554 3.77783 3.95351 3.77783 4.44443V12C3.77783 12.2454 3.97682 12.4444 4.22228 12.4444H9.55561V4.44443C9.55561 3.95351 9.15764 3.55554 8.66672 3.55554H4.66672ZM10.3048 6.344C10.1588 6.28561 10 6.39312 10 6.55033V12.4443H11.7778C12.0232 12.4443 12.2222 12.2453 12.2222 11.9999V7.41189C12.2222 7.23016 12.1116 7.06673 11.9428 6.99924L10.3048 6.344Z"
          fill="white"
        />
        <rect
          x="5.11108"
          y="5.33319"
          width="3.11111"
          height="0.591111"
          fill="#2660F5"
        />
        <rect
          x="5.11108"
          y="6.81317"
          width="3.11111"
          height="0.591111"
          fill="#2660F5"
        />
      </svg>
      <div class="gs-hotel-bottom__left-info--text">
        {{ `酒店` }}
      </div>
    </div>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 16.6667L14.431 12.2358C14.5611 12.1056 14.5611 11.8946 14.431 11.7644L10 7.33342"
        :stroke="$utils.isDark ? 'white' : 'black'"
        stroke-opacity="0.55"
        stroke-width="1.33333"
      />
    </svg>
  </div>
</template>

<script>
export default {};
</script>


<style scoped lang="scss">
$namespace: "gs-"; // 可配置的命名空间
@include b(hotel-bottom) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 5px 8px 14px;
  margin-top: 4px;
  @include e(left-info) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    @include m(text) {
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.55);
      margin-left: 8px;
    }
  }
}
</style>