<template>
  <div
    class="medusa-sort-no-results card_box"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'no-results',
        card_position: 1,
      })
    "
  >
    <div class="medusa-sort-no-results__content">
      <svg
        v-if="!$utils.isDark"
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32.5 11.5C27.5935 11.5 22.8879 13.4491 19.4185 16.9185C15.9491 20.3879 14 25.0935 14 30C14 34.9065 15.9491 39.6121 19.4185 43.0815C22.8879 46.5509 27.5935 48.5 32.5 48.5L32.5 11.5Z"
          fill="#C4C4C4"
          fill-opacity="0.4"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M42.1133 36.6838C43.6124 34.681 44.5002 32.1942 44.5002 29.5C44.5002 22.8726 39.1277 17.5 32.5002 17.5C25.8728 17.5 20.5002 22.8726 20.5002 29.5C20.5002 36.1274 25.8728 41.5 32.5002 41.5C34.6212 41.5 36.6137 40.9497 38.3426 39.9842L43.7377 45.3793L47.2732 41.8438L42.1133 36.6838Z"
          fill="#A8A8A8"
          fill-opacity="0.75"
        />
      </svg>
      <svg
        v-else
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M32.5 11.5C27.5935 11.5 22.8879 13.4491 19.4185 16.9185C15.9491 20.3879 14 25.0935 14 30C14 34.9065 15.9491 39.6121 19.4185 43.0815C22.8879 46.5509 27.5935 48.5 32.5 48.5L32.5 11.5Z"
            fill="#C4C4C4"
            fill-opacity="0.4"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M42.1132 36.6838C43.6124 34.681 44.5002 32.1942 44.5002 29.5C44.5002 22.8726 39.1277 17.5 32.5002 17.5C25.8728 17.5 20.5002 22.8726 20.5002 29.5C20.5002 36.1274 25.8728 41.5 32.5002 41.5C34.6212 41.5 36.6136 40.9498 38.3426 39.9842L43.7376 45.3793L47.2732 41.8438L42.1132 36.6838Z"
            fill="#A8A8A8"
            fill-opacity="0.75"
          />
        </g>
      </svg>
      <div class="medusa-sort-no-results__content--text">
        {{ defaultText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultText: "暂无结果",
    };
  },
};
</script>

<style scoped lang='scss'>
$namespace: "medusa-sort-"; // 可配置的命名空间
@mixin flex-basic {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
@include b(no-results) {
  height: 114px;
  @include flex-basic;
  @include e(content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 12px;
    @include m(text) {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>