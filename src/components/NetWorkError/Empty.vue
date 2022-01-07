<template>
  <div class="gs-components-empty">
    <svg
      width="120"
      height="120"
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M195 69C165.561 69 137.328 80.6946 116.511 101.511C95.6946 122.328 84 150.561 84 180C84 209.439 95.6946 237.672 116.511 258.489C137.328 279.305 165.561 291 195 291L195 69Z"
        fill="#C4C4C4"
        fill-opacity="0.4"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M252.682 220.101C261.676 208.084 267.002 193.164 267.002 177C267.002 137.235 234.767 105 195.002 105C155.238 105 123.002 137.235 123.002 177C123.002 216.764 155.238 249 195.002 249C207.729 249 219.684 245.698 230.059 239.904L262.427 272.272L283.64 251.059L252.682 220.101Z"
        fill="#A8A8A8"
        fill-opacity="0.75"
      />
    </svg>
    <div class="gs-components-empty__text">
      {{ defaultText }}
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.defaultText = "无搜索结果";
  },
};
</script>

<style scoped lang='scss'>
$namespace: "gs-components-"; // 可配置的命名空间
@include b(empty) {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @include e(text) {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.3);
    line-height: 18px;
  }
}
</style>
