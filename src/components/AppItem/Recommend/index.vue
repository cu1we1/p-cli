<template>
  <!-- 在线应用推荐 -->
  <div
    class="gs-components-recommend"
    v-if="list.length > 3"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'recommend',
      })
    "
  >
    <div class="gs-components-recommend__title">
      {{ title }}
    </div>
    <div class="gs-components-recommend__item-box">
      <Item
        v-for="(item, idx) in list"
        :key="item.id"
        class="gs-components-recommend__item"
        v-bind="item"
        :keyword="keyword"
        :index="`${index + 1}_${idx + 1}`"
      />
      <div
        class="gs-components-recommend__item-place-holder"
        v-for="item in holderList"
        :key="item.id"
      />
    </div>
  </div>
</template>

<script>
import { post, oreport } from "@lego";
import Item from "./Item.vue";
import { APP_API } from "@lego";
import format from "./format";
export default {
  props: ["name", "keyword", "index"],
  components: {
    Item,
  },
  inject: ["onlineApps"],
  data() {
    return {
      list: [],
      holderList: [],
    };
  },
  created() {
    this.title = "大家还安装了";
  },
  mounted() {
    this.fetchApps();
  },
  methods: {
    fetchApps() {
      post(APP_API, {
        params: {
          kw: this.name,
          f: "json",
          offset: 0,
          size: 20,
          v: "3.0",
          scene: "1",
        },
      }).then(
        ({ app }) => {
          const { online } = format(app) || {};
          const injectAppsPkg = this.onlineApps.injectAppsPkg;
          if (Array.isArray(online) && online.length >= 3) {
            this.list = online
              .filter((item) => {
                return injectAppsPkg?.indexOf(item.pkg) < 0;
              })
              .slice(0, 5);
            switch (this.list.length) {
              case 3:
                this.holderList = [
                  { id: Math.floor(Math.random() * 100000) },
                  { id: Math.floor(Math.random() * 100000) },
                ];
                break;
              case 4:
                this.holderList = [{ id: Math.floor(Math.random() * 100000) }];
                break;
            }
          }
        },
        (err) => {
          console.error(err);
          oreport.reportError(new Error(`query:`));
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-components-"; // 可配置的命名空间
@include b(recommend) {
  padding-bottom: 10px;
  padding-top: 4px;
  @include e(gap) {
    padding: 10px 0;
    @include e(gap-line) {
      height: 1px;
      transform: scaleY(0.3);
      background-color: rgba(0, 0, 0, 0.12);
    }
  }
  @include e(title) {
    height: 28px;
    font-size: 12px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.55);
    font-weight: 700;
  }
  @include e(item-box) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 9px;
    @include e(item) {
      width: 16.444vw;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      @include m(pic) {
        width: 50px;
        height: 50px;
        margin-top: 5px;
        border-radius: 12px;
      }
      @include m(text) {
        margin-bottom: 10px;
        margin-top: 8px;
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    @include e(item-place-holder) {
      width: 16.444vw;
      height: 113px;
    }
  }
}
</style>
