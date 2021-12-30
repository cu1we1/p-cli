<template>
  <div>
    Home
    <img :src="imgURL" alt="homeImg" />
  </div>
</template>

<script>
import img from "@/assets/img.png";
export default {
  data() {
    return {
      imgURL: img,
    };
  },
};
</script>     

<style>
</style>