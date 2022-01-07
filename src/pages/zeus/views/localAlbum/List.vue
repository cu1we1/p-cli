<template>
  <div class="zeus-local-album-list">
    <MultiTitle
      cardKey="zeus-local-album"
      class="zeus-local-album-list__title"
      :title="date"
      iconCls="jcc"
      :direction="direction"
      :showMore="list[date].length > 8"
      :click="viewMore"
      :data-log="
        $utils.inject({
          control_id: `${date}_album_more`,
          control_name: '更多',
          control_type: 'button',
        })
      "
    />
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
import { MultiTitle } from "@components";
import { launchPhotoEditPage, debounce } from "@lego";
export default {
  props: ["list", "date", "ids"],
  data() {
    return {
      direction: "down",
    };
  },
  components: {
    MultiTitle,
  },
  computed: {
    listData() {
      if (this.direction === "down") {
        return this.list[this.date].slice(0, 8);
      }
      return this.list[this.date];
    },
    placeHolder() {
      const len = this.listData && this.listData.length;
      if (len) {
        const parInt = parseInt(len / 4);
        if (parInt === 0) {
          return new Array(4 - len);
        }
        const addNum = len - parInt * 4;
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
      let resourceId = uri.split("/");
      resourceId = resourceId[resourceId.length - 1];
      return resourceId;
    },
    viewMore() {
      if (this.direction === "up") {
        this.direction = "down";
        this.$emit("getMore", false);
      } else {
        this.$emit("getMore", true);
        this.direction = "up";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-local-album-";
@include b(list) {
  @include e(title) {
    padding: 5px 24px;
    margin: 10px 0;
    /deep/.title {
      color: rgba(0, 0, 0, 0.55);
      font-weight: 400;
      line-height: 21px;
      height: 21px;
    }
    /deep/.multi_title_click_more {
      height: 24px;
    }
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
        width: 24.7vw;
        height: 24.7vw;
      }
      @include e(content-video-time) {
        width: 43px;
        height: 16px;
        bottom: 4px;
        left: 4px;
        position: absolute;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 10px;
        color: #fff;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    @include m(place-holder) {
      width: 24.7vw;
      height: 24.7vw;
    }
  }
}
</style>
