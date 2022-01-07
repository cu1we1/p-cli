<template>
  <div class="zeus-local-album-list">
    <div class="zeus-local-album-list__title cl_normal">
      {{ date }}
    </div>
    <div class="zeus-local-album-list__content df jcsb">
      <div
        v-for="(item, index) in listData"
        :key="index"
        class="zeus-local-album-list__content-cell"
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_id: getResourceId(item),
            resource_name: getResourceId(item),
            resource_position: index + 1,
            resource_type: 'album',
            resource_source: -1,
          })
        "
        data-href=""
        @click="
          () => {
            debounce(launchPhotoEditPage(item.id, ids, item.type), 500);
          }
        "
      >
        <div class="pos_relative">
          <img :src="item.uri" class="zeus-local-album-list__content-img" />
          <div
            class="zeus-local-album-list__content-video-time"
            v-if="item.type === 'type_video'"
          >
            {{ item.duration }}
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in placeHolder"
        :key="`${index}-placeHolder`"
        class="zeus-local-album-list__content--place-holder"
      ></div>
    </div>
  </div>
</template>

<script>
import { launchPhotoEditPage, debounce, parse } from "@lego";
export default {
  props: ["list", "date", "ids"],
  computed: {
    listData() {
      return this.list[this.date];
    },
    placeHolder() {
      const len = this.listData && this.listData.length;
      if (len) {
        const parInt = Math.ceil(len / 4);
        if (parInt === 0) {
          return new Array(4 - len);
        }
        const addNum = Math.abs(len - parInt * 4);
        return new Array(addNum);
      }
      return [];
    },
  },
  methods: {
    debounce,
    launchPhotoEditPage,
    getResourceId: function (item) {
      const { uri = "" } = item;
      const { path } = parse(uri);
      if (path) {
        let resourceId = path.split("/");
        resourceId = resourceId[resourceId.length - 1];
        return resourceId;
      }
      return uri;
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-local-album-";
@include b(list) {
  margin-bottom: 20px;
  @include e(title) {
    padding: 9px 24px;
    margin: 10px 0;
    font-weight: 400;
    line-height: 16px;
    height: 16px;
    font-size: 12px;
  }
  @include e(content) {
    margin: 0;
    flex-flow: row wrap;
    box-sizing: border-box;
    @include e(content-cell) {
      padding: 0;
      box-sizing: border-box;
      margin-bottom: 0.4vw;
      @include e(content-img) {
        display: block;
        width: 24.6vw;
        height: 24.6vw;
      }
      @include e(content-video-time) {
        height: 16px;
        bottom: 4px;
        left: 4px;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.55);
        font-size: 10px;
        color: #fff;
        border-radius: 2px;
        line-height: 14px;
        padding: 1px 7px;
        box-sizing: border-box;
      }
    }
    @include m(place-holder) {
      width: 24.6vw;
      height: 24.6vw;
    }
  }
}
</style>
