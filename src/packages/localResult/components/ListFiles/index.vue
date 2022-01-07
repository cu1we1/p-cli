<template>
  <div>
    <SingleFile
      v-for="(item, index) in list"
      :item="item"
      :index="index"
      :q="q"
      :icon="icon"
      :key="index"
      :keys="keys"
    />
  </div>
</template>

<script>
import SingleFile from "./SingleFile";
export default {
  props: ["list", "keys", "icon", "q"],
  components: {
    SingleFile,
  },
};
</script>

<style>
</style>