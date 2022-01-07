<template>
  <!-- 无网络且搜索完成时 -->
  <div
    :class="
      netErrorType === '2' ? 'medusa-sort-net-work-error--full-screen' : ''
    "
  >
    <!-- 有本地卡 -->
    <MinorNetError
      v-if="netErrorType === '1'"
      data-exp="0"
      :dataLog="
        $utils.inject({
          control_id: 'netWorkError',
          control_position: 1,
        })
      "
      :data-log="
        $utils.inject({
          card_id: 'netWorkError',
        })
      "
    />
    <!-- 搜索完成且无本地卡 -->
    <NetWorkError
      v-else-if="netErrorType === '2'"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: 'netWorkError',
        })
      "
    />
  </div>
</template>

<script>
import { MinorNetError, NetWorkError } from "@components";

export default {
  props: ["netErrorType"],
  components: {
    MinorNetError,
    NetWorkError,
  },
};
</script>

<style scoped lang='scss'>
$namespace: "medusa-sort-"; // 可配置的命名空间
@include b(net-work-error) {
  @include m(full-screen) {
    height: calc(100vh - 52px);
    transform: scale(1);
  }
}
</style>
