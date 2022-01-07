<template>
  <div class="list">
    <div v-if="list.length === 0">
      <div
        v-if="isLoading"
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
      class="list-box"
      data-exp="0"
      :data-log="
        $utils.inject({
          module_id: 'GlobalLocal',
          page_id: 'AlbumListPage',
          fe_version: FE_VERSION,
        })
      "
      :offset="Number(1)"
      v-model="pullUpLoading"
      :finished="!hasMore"
      finished-text=""
      @load="loadMore"
    >
      <div
        v-for="(item, idx) in list"
        role="presentation"
        class="df aic album_item"
        :key="idx"
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_id: item.url,
            resource_name: item.url,
            resource_position: idx + 1,
            resource_type: 'album',
            resource_num: item.subFileCount,
            resource_source: -1,
          })
        "
        :data-href="
          $utils.inject({
            h5: {
              url: `${ZEUS_URL}#/album?type=photo&q=${q}`,
              title: item.title,
              mode: 'page',
              judgeNet: false,
            },
          })
        "
        @click="() => setTag(encodeURIComponent(item.tag))"
      >
        <img
          :src="item.url"
          width="50px"
          height="50px"
          class="album_list_img"
        />
        <div
          class="lc1 fs_l fw_medium cl_darkest f1 wklc"
          v-html="clipAndHighLight(item.title, q, 30)"
        />
        <div class="fs_s cl_dark aic df">
          <span class="mr6">
            {{ +item.subFileCount > 9999 ? "9999+" : item.subFileCount }}
          </span>
          <AngleRight />
        </div>
      </div>
    </color-load-more>
  </div>
</template>

<script>
import {
  ZEUS_URL,
  FE_VERSION,
  clipAndHighLight,
  queryAlbumInfo,
  localStorage,
} from "@lego";
import { NetWorkError, AngleRight } from "@components";

const moreIcon =
  "M19.2586 21.7413C19.697 21.3443 19.697 20.6557 19.2586 20.2587L0.637827 3.39934C-0.212609 2.62169 -0.212609 1.36088 0.637827 0.583235C1.48826 -0.194412 2.86709 -0.194412 3.71753 0.583235L22.704 18.0567C24.4257 19.6412 24.4257 22.3588 22.704 23.9433L3.71753 41.4168C2.86709 42.1944 1.48826 42.1944 0.637827 41.4168C-0.212609 40.6391 -0.212609 39.3783 0.637827 38.6007L19.2586 21.7413Z";
export default {
  props: ["q"],
  components: {
    NetWorkError,
    AngleRight,
  },
  data() {
    return {
      pageNo: 0,
      pageSize: 20,
      hasMore: true,
      list: [],
      isLoading: true,
      ZEUS_URL,
      moreIcon,
      FE_VERSION,
    };
  },
  mounted() {
    this.loadMore();
  },
  methods: {
    clipAndHighLight,
    loadMore: function () {
      queryAlbumInfo(this.q, this.pageNo, this.pageSize, "", (data) => {
        const { hasMore, albums } = data;
        this.list = this.list.concat(...albums);
        this.hasMore = albums.length >= this.pageSize ? hasMore : false;
        this.pageNo = this.pageNo + 1;
        this.isLoading = false;
        this.pullUpLoading = false;
      });
    },
    setTag: function (tag) {
      localStorage.setItem("albumTag", tag);
    },
  },
};
</script>

<style scoped lang="scss">
.color-area-loading--parent-relative {
  height: 100vh;
}
.color-area-loading
  .color-area-loading__progress.color-area-loading__progress--static
  path[stroke-linecap="round"] {
  stroke: rgba(0, 124, 255, 1);
}
.color-area-loading
  .color-area-loading__progress.color-area-loading__progress--static
  path[stroke-linecap="butt"] {
  stroke: rgba(0, 124, 255, 0.15);
}
.color-area-loading {
  transform: none;
}
.list {
  padding: 0px 10px;
  .album_item {
    height: 78px;
    padding: 0px 14px;
    .album_list_img {
      border-radius: 6px;
      margin-right: 16px;
    }
  }
}
.mr6 {
  margin-right: 6px;
}
.color-load-more-finished {
  display: none;
}
</style>
