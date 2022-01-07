<template>
  <div class="card_box">
    <component
      :tname="tname"
      :is="componentMap[tname]"
      :data="asyncPayload"
      :q="q"
    ></component>
  </div>
</template>
<script>
import SingleNovel from "./components/SingleNovel";
import WidelyList from "./components/WidelyList";
import Author from "./components/Author";
import Voice from "./components/Voice";
import format from "./format";
const componentMap = {
  130101: SingleNovel,
  130106: SingleNovel,
  130103: Author,
  130104: WidelyList,
  130105: WidelyList,
  130201: Voice,
};
export default {
  displayName: "novel",
  props: ["hitPayload", "payload", "q", "tname"],
  data() {
    return {
      componentMap,
    };
  },
  methods: {
    format,
  },
  computed: {
    // 根据entry统一传入的数据进行数据处理
    asyncPayload() {
      return format(this.payload, this);
    },
  },
};
</script>
<style lang="scss"></style>
