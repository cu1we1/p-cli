<template>
  <div class="gs-hotel-list">
    <hotel-item
      v-for="(item, index) in renderList"
      :data-href="$utils.inject(item.href)"
      :content="item.content"
      :pic="item.pic"
      :type="type"
      :index="index + 1"
      :key="item.resourceId"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: item.resourceId,
          resource_name: item.content[0],
          resource_position: `${index + 1}`,
          resource_source: type === 'foreign' ? 1 : 0,
          resource_url: item.url,
          resource_provider: item.cpId || 0,
        })
      "
    />
  </div>
</template>

<script>
import { browserInfo } from "@lego";
import { genHref } from "@lego";
import HotelItem from "./HotelItem";
const { source = "" } = browserInfo || {};
export default {
  name: "HotelList",
  components: { HotelItem },
  props: ["pageData", "type"],
  computed: {
    renderList() {
      return this.pageData.map((item) => {
        const { jumpActions } = item;
        let [, , { url, cpId }] = jumpActions,
          _item = {};
        if (this.type === "foreign") {
          [{ url, cpId }] = jumpActions;
        } else if (source) {
          url += `&oparams=${source}&from=search`;
        }
        _item.url = url;
        _item.cpId = cpId;
        _item.href = genHref({ fastappUrl: url });
        return Object.assign({}, item, _item);
      });
    },
  },
  methods: {
    genHref,
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-"; // 可配置的命名空间
@include b(hotel-list) {
  padding: 0 14px;
  @include e(bottom-info) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    @include e(left-info) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include m(text) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        margin-left: 8px;
      }
    }
  }
}
</style>