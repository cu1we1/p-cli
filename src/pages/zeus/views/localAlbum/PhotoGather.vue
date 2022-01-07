<template>
  <div class="gather">
    <div v-if="listKeys.length === 0">
      <div
        v-if="isLoading"
        class="gather_loading"
        v-loading="true"
        loading-background="rgba(255,255,255,1)"
      />
      <net-work-error
        v-else-if="!hasMore"
        type="noSearchResults"
        title="暂无相册数据"
      />
    </div>
    <color-load-more
      v-else
      class="gather_list-box"
      data-exp="0"
      :data-log="
        $utils.inject({
          module_id: 'GlobalLocal',
          page_id: 'AlbumPhotosPage',
          fe_version: FE_VERSION,
        })
      "
      :offset="Number(1)"
      v-model="pullUpLoading"
      :finished="hadMore ? !hasMore && pageNo > 2 : true"
      finished-text=""
      @load="loadMore"
    >
      <div v-for="(date, idx) in listKeys" class="mb15" :key="idx">
        <List :date="date" @getMore="getMore" :list="list" :ids="ids" />
      </div>
    </color-load-more>
  </div>
</template>

<script>
import { queryAlbumSnapshotInfo, localStorage, FE_VERSION } from "@lego";
import List from "./List";

export default {
  components: {
    List,
  },
  data() {
    const tag = localStorage.getItem("albumTag");
    return {
      pageNo: 0,
      pageSize: 40,
      hasMore: true,
      updateTime: 0,
      list: {},
      ids: [],
      isLoading: true,
      tag: decodeURIComponent(tag),
      hadMore: false,
      FE_VERSION,
    };
  },
  computed: {
    listKeys: function () {
      return Object.keys(this.list);
    },
  },
  mounted() {
    this.loadMore();
  },
  methods: {
    getMore(more) {
      this.hadMore = more;
    },
    getResourceId: function (item) {
      const { uri = "" } = item;
      let resourceId = uri.split("/");
      resourceId = resourceId[resourceId.length - 1];
      return resourceId;
    },
    loadMore: function () {
      const { tag, list, ids, pageNo, pageSize, updateTime } = this;
      const tmpList = JSON.parse(JSON.stringify(list));

      queryAlbumSnapshotInfo(
        tag,
        pageNo,
        pageSize,
        updateTime,
        "",
        "",
        (data) => {
          const { hasMore, photoItems } = data;
          const tmpIds = [];
          let lastTime = 0;
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
          this.pageNo = pageNo === 0 ? pageNo + 2 : pageNo + 1;
          this.updateTime = lastTime;
          this.ids = ids.concat(tmpIds);
          this.isLoading = false;
          this.pageSize = 20;
          this.pullUpLoading = false;
        }
      );
    },
  },
};
</script>

<style scoped>
.gather_list-box {
  min-height: 100vh;
}
.gather_loading {
  min-height: 100vh;
}

.mb15 {
  margin-bottom: 15px;
}
</style>
