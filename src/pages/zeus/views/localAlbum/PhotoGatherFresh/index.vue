<template>
  <div class="zeus-local-album-list-photo-gather-fresh">
    <div v-if="listKeys.length === 0">
      <div
        v-if="isLoading"
        class="zeus-local-album-list-photo-gather-fresh__loading"
        v-loading="true"
        loading-background="rgba(255,255,255,1)"
      />
      <net-work-error
        v-else-if="!hasMore"
        type="noSearchResults"
        :showSub="false"
        :showBtn="false"
        title="暂无相册数据"
      />
    </div>
    <color-load-more
      v-else
      class="zeus-local-album-list-photo-gather-fresh__list-box"
      data-exp="0"
      :data-log="
        $utils.inject({
          module_id: 'GlobalLocal',
          page_id: 'AlbumPhotosFreshPage',
          fe_version: FE_VERSION,
        })
      "
      :offset="Number(1)"
      v-model="pullUpLoading"
      :finished="!hasMore"
      finished-text=""
      loading-text="loading..."
      @load="loadMore"
    >
      <div
        v-if="tags && tags.length > 2"
        class="
          zeus-local-album-list-photo-gather-fresh__tags-box
          df
          jcfs
          aic
          fww
        "
      >
        <div
          :class="`zeus-local-album-list-photo-gather-fresh__tag-item ${getTagCls(
            tag.id
          )}`"
          data-dark-exclude
          v-for="(tag, tagIdx) in tags"
          v-feedback
          :key="tagIdx"
          @click="(e) => clickTag(e, tag)"
          :data-log="
            $utils.inject({
              control_id: tag.id,
              control_name: `${tag.name}`,
              control_type: 'button',
              tab_name: `${tag.name}`,
            })
          "
          data-href=""
        >
          {{ tag.name }}
        </div>
      </div>
      <List
        v-for="(date, idx) in listKeys"
        :key="idx"
        :date="date"
        :list="list"
        :ids="ids"
      />
    </color-load-more>
  </div>
</template>

<script>
import { queryAlbumSnapshotInfo, throttle } from "@lego";
import { NetWorkError } from "@components";
import { FE_VERSION } from "@lego";
import List from "./List";

export default {
  props: ["query", "tagId"],
  components: {
    List,
    NetWorkError,
  },
  data() {
    return {
      pageNo: 0,
      pageSize: 28,
      hasMore: true,
      updateTime: 0,
      list: {},
      ids: [],
      isLoading: true,
      tags: [{ id: -1, name: "全部结果" }],
      defaultTagId: +this.tagId,
      FE_VERSION,
    };
  },
  computed: {
    listKeys: function () {
      return Object.keys(this.list);
    },
  },
  created() {
    this.loadMore();
  },
  methods: {
    clickTag(e, tag) {
      if (!tag || this.defaultTagId === tag.id) return;
      this.defaultTagId = tag.id;
      this.pageNo = 0;
      this.pageSize = 40;
      this.list = {};
      this.hasMore = true;
      this.updateTime = 0;
      this.ids = [];
      this.isLoading = true;
      this.loadMore("clickTag");
    },
    getTagCls(tagId) {
      if (tagId === this.defaultTagId) {
        return "zeus-local-album-list-photo-gather-fresh__tag-item--selected";
      }
      return "bg_button cl_darkest";
    },
    loadMore: throttle(function (type = "") {
      const { defaultTagId, list, ids, pageNo, pageSize, updateTime, query } =
        this;
      const tmpList = JSON.parse(JSON.stringify(list));

      queryAlbumSnapshotInfo(
        "",
        pageNo,
        pageSize,
        updateTime,
        query,
        defaultTagId,
        (data) => {
          const { hasMore, photoItems } = data;
          const tmpIds = [];
          let lastTime = 0;
          if (pageNo === 0 && type !== "clickTag") {
            const [firstItem] = photoItems;
            const { highlight } = firstItem;
            const newTags = JSON.parse(highlight || null);
            if (newTags && newTags.length) {
              this.tags = this.tags.concat(newTags);
            }
          }
          photoItems.forEach((item) => {
            tmpIds.push(item.id);
            lastTime = item.time;
            if (!tmpList[item.date]) {
              tmpList[item.date] = [];
            }
            tmpList[item.date].push(item);
          });
          this.list = tmpList;
          this.hasMore = photoItems.length >= pageSize ? hasMore : false;
          this.pageNo = pageNo + 1;
          this.updateTime = lastTime;
          this.ids = ids.concat(tmpIds);
          this.isLoading = false;
          this.pullUpLoading = false;
        }
      );
    }, 500),
  },
};
</script>

<style scoped lang='scss'>
$namespace: "zeus-local-album-list-";
@include b(photo-gather-fresh) {
  min-height: 100vh;
  @include e(loading) {
    height: 100vh;
  }
  @include e(list-box) {
    min-height: 100vh;
    @include e(tags-box) {
      padding: 10px 24px 2px 24px;
      @include e(tag-item) {
        margin-right: 8px;
        margin-bottom: 8px;
        max-width: 200px;
        min-width: 60px;
        height: 32px;
        line-height: 16px;
        padding: 8px 16px;
        font-size: 12px;
        border-radius: 30px;
        text-align: center;
        box-sizing: border-box;
        @include m(selected) {
          background-color: #2660f5;
          color: #fff;
        }
      }
    }
  }
}
/deep/ .color-load-more-finished {
  display: none;
}
</style>
