<template>
  <div>
    <front />
    <sug />
    <results />
  </div>
</template>

<script>
import { post, APP_SEARCH_API } from "../../../../lego/lib/";
import front from "./pages/front";
import sug from "./pages/sug";
import results from "./pages/results";

export default {
  components: {
    front,
    sug,
    results,
  },
  mounted() {},
  methods: {
    // 获取精选应用
    getFeaturedApps() {
      post(APP_SEARCH_API, {
        params: {
          f: "json",
        },
      }).then();
    },
    getDownloadMenu() {},
  },
};
</script>

<style>
</style>