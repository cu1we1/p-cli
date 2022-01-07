<template>
  <div class="active_pic" v-if="pageData.list.length > 0">
    <color-swipe @change="setPv" :auto-duration="3000" :prevent-default="false">
      <color-swipe-item
        v-for="(item, idx) in pageData.list"
        :key="item.resourceId"
      >
        <div
          @click="clickLink(item.clicklink)"
          data-exp="0"
          :data-log="
            $utils.inject({
              resource_name: item.resourceName,
              resource_id: item.resourceId,
              resource_position: idx + 1,
              resource_provider: item.resourceProvider,
              resource_source: item.resourceSource,
              resource_url: JSON.stringify(item.hrefObj),
            })
          "
          :data-href="$utils.inject(item.hrefObj)"
        >
          <Pic :src="item.img" :radius="12" :size="size" class="br_0 picBox" />
        </div>
      </color-swipe-item>
    </color-swipe>
    <div
      class="active_pic_iconClose"
      @click.stop="clickClose"
      data-href=""
      :data-log="
        $utils.inject({
          control_name: 'close',
        })
      "
    >
      <!-- 关闭图片 -->
      <svg
        class="iconSvg"
        width="24"
        height="24"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M54 21.0028L50.9972 18L43.4986 25.4998L36 32.9996L21.0027 18L18 21.0028L32.9996 36L18 50.9972L21.0027 54L36 39.0004L50.9972 54L54 50.9972L39.0004 36L54 21.0028Z"
          fill="white"
          fill-opacity="0.85"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
import { debounceLazyLoadImage, debounceExport } from "@lego";
export default {
  name: "PicTemplate",
  components: { Pic },
  props: {
    pageData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    size() {
      return this.pageData.picStyle === 1 ? "r16-9" : "r4-1";
    },
  },
  methods: {
    clickClose() {
      this.$emit("clickClose");
    },
    clickLink(clicklink) {
      if (clicklink) {
        const trackImg = new Image();
        trackImg.src = clicklink;
      }
    },
    setPv(idx) {
      debounceLazyLoadImage();
      debounceExport();
      if (idx || idx === 0) {
        const pvlink = this.pageData.list[idx]?.pvlink;
        if (pvlink) {
          const trackImg = new Image();
          trackImg.src = pvlink;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.active_pic {
  position: relative;
  overflow: auto;
  margin: 0px 10px 10px 10px;

  background: transparent;
  ::v-deep .color-swipe {
    height: auto;
  }
  ::v-deep .img-box {
    position: absolute;
  }
}
.active_pic_iconClose {
  position: absolute;
  right: 15px;
  top: 9px;
  width: 24px;
  height: 24px;
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
