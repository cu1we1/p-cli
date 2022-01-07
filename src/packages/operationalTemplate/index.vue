<template>
  <div
    class="medusa-sort-operational-template card_box"
    id="OperationalTemplate"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: formatPayload.id,
        card_position: 1,
      })
    "
  >
    <component
      v-for="(item, idx) in formatPayload.hits"
      :key="item.type"
      :index="idx + 1"
      :headClass="headClass"
      :resourceId="`${formatPayload.resourceId}_${idx}`"
      :is="componentMap[item.type]"
      :pageData="item.pageData"
      :id="item.id"
      :tname="tname"
    />
  </div>
</template>

<script>
import format from "./format";
import headImg from "./components/headImg";
import entry from "./components/entry";
import textInfo from "./components/textInfo";
export default {
  name: "OperationalTemplate",
  props: ["payload", "tname"],
  data() {
    return {
      componentMap: { headImg, entry, textInfo },
    };
  },
  computed: {
    formatPayload() {
      return this.format(this.payload);
    },
    headClass() {
      let _headClass = "";
      const { hits } = this.format(this.payload);
      // 仅有一个模块的时候,card_box的padding都为14px;
      // 只有在文案有副标题时,距离底部为16px
      if (hits.length === 2) {
        if (hits[0].id === "headImg" && hits[1].id === "entry") {
          _headClass = "medusa-sort-operational-template-img--mb8";
        }
      }
      // 当只有图片和按钮时,两者相距18px
      return _headClass;
    },
  },
  methods: {
    format,
  },
};
</script>

<style lang="scss">
$namespace: "medusa-sort-";
@include b("operational-template") {
  &.card_box {
    padding: 14px;
  }
  // &.card_box {
  //   padding: 14px 14px 18px 14px;
  // }
}
</style>
