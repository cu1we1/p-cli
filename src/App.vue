<template>
  <div>
    {{ title }}
    <input type="text" v-model="title" />
    <router-link to="/">home</router-link> |
    <router-link to="/lego">lego</router-link> |
    <router-link to="/test1">test1</router-link> |
    <router-link to="/test2">test2</router-link> |
    <router-link to="/test3">test3</router-link> |
    <br />
    <router-view></router-view>
  </div>
</template>

<script>
import { name } from "./index";
console.log(name);
export default {
  data() {
    return {
      title: "hello ",
    };
  },
};
</script>

<style>
</style>