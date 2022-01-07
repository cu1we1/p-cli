<template>
  <div>
    {{ title }}
  </div>
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
};
</script>

<style>
</style>