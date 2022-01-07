<template>
  <div
    :data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'localMoreContent',
        card_position: 1,
      })
    "
  >
    <div
      class="medusa-sort-more-local-content-box gs_card_bg_color"
      @click="openMore"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_name: moreText,
          resource_id: 'localMoreContent',
          resource_position: 1,
          resource_source: 0,
        })
      "
      data-href=""
    >
      <div class="medusa-sort-more-local-content-box__text lc1">
        {{ moreText }}
      </div>
      <div class="medusa-sort-more-local-content-box__more-info">
        <Pic
          v-for="(item, index) in localIcons"
          :key="`${item.key}-${index}`"
          :src="item.icon"
          :size="'xssss1-1'"
          :radius="3.7"
          class="medusa-sort-more-local-content-box__more-info--icon"
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.8149 7.55667L8.95383 2.69556L8.06995 3.57944L12.4891 7.99861L8.06995 12.4178L8.95383 13.3017L13.8149 8.44055C14.059 8.19647 14.059 7.80075 13.8149 7.55667Z"
            :fill="$utils.isDark ? 'white' : 'black'"
            fill-opacity="0.55"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
export default {
  inject: ["medusa", "changeToLocalTab"],
  components: {
    Pic,
  },
  computed: {
    localIcons() {
      const data = this.medusa.searchLocalsData.slice(2);
      const order = this.medusa.order;
      const iconList = data.map((item) => {
        const { icon, key } = item;
        return { icon, key };
      });
      let map = [];
      // 对图标进行排序
      order.forEach((item) => {
        const list = iconList.find((ele) => ele && ele.key === item);
        if (list) {
          map.push(list);
        }
      });
      return map.slice(0, 3);
    },
  },
  data() {
    return {
      moreText: "查看更多本机内容",
    };
  },
  methods: {
    openMore() {
      this.changeToLocalTab();
    },
  },
};
</script>

<style scoped lang='scss'>
$namespace: "medusa-sort-more-local-content-"; // 可配置的命名空间
@include b(box) {
  padding: 12px 14px;
  margin: 0 10px 10px 10px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include e(text) {
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    line-height: 28px;
  }
  @include e(more-info) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: -2px;
    @include m(icon) {
      margin-left: 4px;
      &::after {
        border-radius: 11.1px;
      }
    }
  }
}
</style>