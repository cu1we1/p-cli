<template>
  <div class="gs-components-angle-right" @click="AngleClick">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 16.6599L14.431 12.2289C14.5611 12.0988 14.5611 11.8877 14.431 11.7575L10 7.32658"
        :stroke="$utils.isDark ? 'white' : 'black'"
        stroke-opacity="0.3"
        stroke-width="1.33333"
      />
    </svg>
  </div>
</template>

<script>
export default {
  methods: {
    AngleClick() {
      this.$emit("AngleClick");
    },
  },
};
</script>

<style lang="scss">
$namespace: "gs-components-"; // 可配置的命名空间
@include b(angle-right) {
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
