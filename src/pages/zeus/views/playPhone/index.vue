<template>
  <div
    v-loading="loading"
    class="play-phone-box"
    loading-background="transparent"
  >
    <div
      class="play-phone"
      data-exp="0"
      :data-log="
        $utils.inject({ page_id: 'PlayPhoneListPage', fe_version: FE_VERSION })
      "
    >
      <div
        class=""
        v-for="(tab, index) in tabList"
        :key="index"
        data-exp="0"
        :data-log="
          $utils.inject({
            card_id: cardInfo && cardInfo.cardId,
            card_name: `play-phone`,
            card_position: 1,
          })
        "
      >
        <div v-for="(item, i) in tab.tabItem" :key="i">
          <div
            class="sub-title"
            v-if="!item.pic"
            :data-href="
              item.jumpActions && item.jumpActions[0] && item.jumpActions[0].url
            "
            data-exp="0"
            :data-log="
              $utils.inject({
                resource_id: item.resourceId,
                resouece_name: item.content && item.content[0],
                resource_position: i + 1,
                resource_provider: item.cpId,
                resource_source: '1',
              })
            "
          >
            <div
              class="question cl_darkest fs_l"
              v-html="
                clipAndHighLight(item.content[0], q, 50, 'play-phone-light')
              "
            ></div>
            <div class="content fs_s" v-html="item.content[1]"></div>
          </div>

          <div
            class="item-box df jcsb"
            v-if="item.pic && item.pic.length >= 1"
            :data-href="
              item.jumpActions && item.jumpActions[0] && item.jumpActions[0].url
            "
            data-exp="0"
            :data-log="
              $utils.inject({
                resource_id: item.resourceId,
                resouece_name: item.content && item.content[0],
                resource_position: i + 1,
                resource_provider: item.cpId,
                resource_source: '1',
              })
            "
          >
            <div class="sub-title">
              <div
                class="cl_darkest fs_l"
                v-html="
                  clipAndHighLight(item.content[0], q, 50, 'play-phone-light')
                "
              ></div>
              <div class="content fs_s lc2" v-html="item.content[1]"></div>
            </div>
            <div v-if="item.pic && item.pic.length === 1" class="pic">
              <Pic :src="item.pic[0]" size="m3-2" :radius="8"></Pic>
            </div>

            <div
              class="df jcsb pd_top-xxs"
              v-if="item.pic && item.pic.length > 1"
            >
              <Pic
                v-for="(pic, i) in item.pic"
                :key="i"
                :src="pic"
                size="m3-2"
                :radius="8"
              ></Pic>
            </div>
          </div>
        </div>
      </div>

      <NetWorkError
        class="zeus-views-play-phone__net-work-error"
        v-if="isNetworkError"
        :reload="reload"
        data-exp="0"
        :data-log="
          $utils.inject({
            page_id: 'PlayPhoneListPage',
          })
        "
      />
    </div>
  </div>
</template>

<script>
import { Pic, NetWorkError } from "@components";
import format from "./format";
import { clipAndHighLight, post, init, changeBodyBgWithTheme } from "@lego";
import { MEDUSA_API as API, FE_VERSION } from "@lego";
export default {
  name: "PlayPhone",
  components: {
    Pic,
    NetWorkError,
  },
  props: {},
  data() {
    const { q } = this.$route.query;
    return {
      q,
      loading: false,
      payload: [],
      tabList: [{ tabItem: [] }],
      isNetworkError: false,
      cardInfo: {},
      FE_VERSION,
    };
  },
  beforeCreate() {
    init();
    changeBodyBgWithTheme();
  },
  created() {},
  mounted() {
    this.loadData();
  },
  methods: {
    showMoreItem() {
      this.showMore = true;
    },
    clipAndHighLight,
    loadData() {
      if (this.loading) return;
      this.loading = true;
      post(API, {
        params: {
          keyword: this.q,
          f: "json",
          v: "2.0",
          ms_parameter: "",
        },
      }).then(
        (res) => {
          const result = res && format(res);
          if (result) {
            this.payload = result;
            const list = this.payload.find((item) => item.type === "tab");
            this.tabList = list && list.data;
            const card = this.payload.find((item) => item.type === "card");
            this.cardInfo = card && card.cardInfo;
            this.loading = false;
            this.isNetworkError = false;
          } else {
            this.loading = false;
            this.isNetworkError = false;
          }
        },
        () => {
          this.loading = false;
          this.isNetworkError = true;
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.play-phone-box {
  min-height: 100vh;
}
.play-phone {
  margin: 0 24px;
  background-color: inherit;
}
.pic {
  margin-left: 10px;
}
.title-box {
  align-items: center;
  justify-content: space-between;
}
.item-box {
  align-items: flex-end;
  margin-bottom: 12px;
}
.content.fs_s {
  line-height: 20px;
  color: rgba(0, 0, 0, 0.55);
  padding-top: 4px;
}
.sub-title {
  padding-top: 14px;
}
.question {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.zeus-views-play-phone__net-work-error {
  height: 100vh;
}
/deep/.pic {
  margin-left: 10px;
  height: 64px;
}
/deep/ .img-box {
  background-position: 50% 50%;
}
/deep/.color-loading
  .color-loading__progress.color-loading__progress--static
  path[stroke-linecap="butt"] {
  stroke: #2660f5;
}
/deep/.color-loading
  .color-loading__progress.color-loading__progress--static
  path[stroke-linecap="round"] {
  stroke: #84baf5;
}
/deep/.color-scroll__inner {
  min-height: 500px;
}
</style>
<style>
.play-phone-light {
  color: #ea3447;
}
html.color-dark-mode {
  background: rgb(48, 48, 48) !important;
}
</style>
