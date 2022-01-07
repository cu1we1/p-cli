<template>
  <div>
    <div
      v-for="(hit, idx) in hits"
      :key="`${medusa.sessionIDData}-${hit.tname}-${idx}`"
      :id="hit.tname"
      :data-log="
        $utils.inject({
          big_card_id: hit.tname,
          big_card_position: idx + 1,
        })
      "
    >
      <component
        :key="`${medusa.sessionIDData}-${hit.tname}-${idx}`"
        :is="CMAP[hit.tname]"
        :payload="hit.payload"
        :index="idx + 1"
        :tname="hit.tname"
        :apps="medusa.appsData"
        :order="medusa.order"
        :locals="searchLocalsData"
        :q="medusa.query"
        :webGuider="webGuider"
        :from="from"
        :netErrorType="netErrorType"
      ></component>
    </div>
  </div>
</template>

<script>
import { CMAP, components } from "./shortcut";

export default {
  name: "entry",
  props: [
    // 卡片数据list
    "hits",
    // 300ms前返回的本地卡list
    "searchLocalsData",
    // anchorToWebPage卡使用，标识锚点到网页的来源。
    "webGuider",
    // 标识父组件（综合or本地），控制本地卡item的数量。
    "from",
    // 无网络提示样式
    "netErrorType",
    // 是否有网络
    "hasNetwork",
  ],
  inject: ["medusa"],
  components: {
    ...components,
  },
  created() {
    this.CMAP = CMAP;
  },
};
</script>