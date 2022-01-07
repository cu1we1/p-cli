<template>
  <div v-html="highLightApp(str, q, 1, count)"></div>
</template>

<script>
import { highLightApp } from "@lego";
export default {
  props: ["str", "q", "count"],
  methods: {
    highLightApp
    // highLight
  }
  // computed:{
  //   resultHtml(){
  //     const strHtml =highLight(this.q,this.count)
  //   }
  // }
};
</script>

<style></style>
