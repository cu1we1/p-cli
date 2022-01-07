<template>
  <div>
    <div v-for="(item, i) in resultLocals" :key="item.key">
      <local-album
        v-if="item.key === 'album'"
        :list="item.list"
        :title="item.title"
        :index="i"
        :q="q"
      />
      <local-album-fresh
        v-else-if="item.key === 'albumsearch'"
        :list="item.list"
        :title="item.title"
        :index="i"
        :q="q"
      />
      <local-other v-else :item="item" :index="i" :q="q" :isLess="isLess" />
    </div>
  </div>
</template>

<script>
import { performanceTrack } from "@lego";
import LocalAlbum from "./LocalAlbum";
import LocalOther from "./LocalOther";
import LocalAlbumFresh from "./LocalAlbumFresh";

export default {
  inheritAttrs: false,
  props: ["locals", "order", "q", "from"],
  components: {
    LocalAlbum,
    LocalOther,
    LocalAlbumFresh,
  },
  data() {
    let result = this.locals;
    if (this.order && this.order.length) {
      result = this.getOrderLocal(this.locals, this.order);
    }
    const noLocalResult = !result || !result.length;
    return {
      resultLocals: result,
      noLocalResult,
      // 是否缩减卡片内容条数。
      isLess: this.from === "tabComplex",
    };
  },
  mounted() {
    !performanceTrack.trackData.localResultMounted &&
      performanceTrack.track("localResultMounted");
  },
  watch: {
    locals: {
      deep: true,
      handler: function (value) {
        this.resultLocals = this.locals;
        if (this.order && this.order.length) {
          this.resultLocals = this.getOrderLocal(value, this.order);
        }
      },
    },
    resultLocals(value) {
      if (!value || !value.length) {
        this.noLocalResult = true;
      }
    },
  },
  methods: {
    getOrderLocal: function (locals, order) {
      const orderHits = [];
      if (Array.isArray(order) && Array.isArray(locals) && locals.length)
        order.forEach((orderKey) => {
          const hit = locals.find(({ key, list, rList }) => {
            if (key === "apps" && orderKey === key) {
              return (list && list.length) || (rList && rList.length);
            }
            if (key === "albumsearch" && orderKey === "album") {
              return list && list.length;
            }
            return orderKey === key && list && list.length;
          });
          if (hit) {
            orderHits.push(hit);
          }
        });
      return orderHits;
    },
  },
};
</script>

<style></style>
