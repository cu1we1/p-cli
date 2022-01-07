<template>
  <div class="gs-components-medusa-index">{{ title }}123</div>
</template>

<script>
import { name } from "./index";
console.log(name);
export default {
  data() {
    return {
      title: "medusa",
    };
  },
  mounted() {
    console.log(name);
  },
};
</script>

<style scoped lang='scss'>
$namespace: "gs-components-"; // 可配置的命名空间

@include b(medusa-index) {
  background: rgba(0, 0, 0, 0.3);
}
</style>