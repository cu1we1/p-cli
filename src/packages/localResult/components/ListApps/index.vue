<template>
  <div>
    <SingleApp
      v-for="(item, index) in list"
      :index="index + 1"
      :key="index"
      :rKey="rKey"
      :item="item"
      :q="q"
      :icon="icon"
      :keys="keys"
      :class="`${len !== index + 1 ? ' local_list' : ''}`"
      :directionIndex="directionIndex + 1"
    />
  </div>
</template>

<script>
import SingleApp from "./SingleApp";

export default {
  props: ["list", "keys", "icon", "q", "rKey"],
  computed: {
    len() {
      return Array.isArray(this.list) ? this.list.length : 0;
    },
    directionIndex() {
      return this.list.findIndex(
        (item) =>
          Array.isArray(item.shortCurtList) && item.shortCurtList.length > 0
      );
    },
  },
  components: {
    SingleApp,
  },
};
</script>

<style scoped>
.local_list {
  margin-bottom: 24px;
}

.mw248 {
  max-width: 248px;
}
</style>
