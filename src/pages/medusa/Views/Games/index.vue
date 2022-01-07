<template>
  <div class="medusa-games-page">
    <div v-if="isLoading">
      <div v-loading="true" loading-background="transparent" />
    </div>
    <template v-else>
      <net-work-error :netErrorType="netErrorType" />
      <template v-if="medusa.isInitHasNetwork">
        <no-results v-if="hasNoResults" />
        <div
          v-else
          class="card_box"
          data-exp="0"
          :data-log="
            $utils.inject({
              card_id: '170004',
              card_position: 1,
            })
          "
        >
          <list-item
            v-for="(item, index) in result"
            :key="`${item.id}-${index}`"
            :item="item"
            :keyword="query"
            :index="index"
          />
        </div>
        <div
          v-if="recommend.length > 0"
          class="card_box"
          data-exp="0"
          :data-log="
            $utils.inject({
              card_id: '170005',
              card_position: 1,
            })
          "
        >
          <div class="medusa-games-page__title">
            {{ title }}
          </div>
          <list-item
            v-for="(item, index) in recommend"
            :key="`${item.id}-${index}`"
            :item="item"
            :keyword="query"
            :index="index"
          />
        </div>
        <anchor-to-web-page
          v-if="isClientSupportWebResults"
          :webGuider="webGuider"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { post, oreport } from "@lego";
import { GAME_S_R_API } from "@lego";
import NoResults from "@gs/noResults";
import NetWorkError from "@gs/netWorkError";
import AnchorToWebPage from "@gs/anchorToWebPage";
import ListItem from "./components/ListItem.vue";
import format from "./format";

export default {
  props: ["query", "isClientSupportWebResults"],
  data() {
    return {
      hasNoResults: false,
      isLoading: true,
      result: [],
      recommend: [],
    };
  },
  provide: {
    onlineApps: this,
  },
  inject: ["medusa"],
  computed: {
    netErrorType({ medusa }) {
      if (!medusa.isInitHasNetwork) {
        return "2";
      } else if (!medusa.hasNetwork) {
        return "1";
      }
      return "";
    },
  },
  components: {
    NoResults,
    NetWorkError,
    AnchorToWebPage,
    ListItem,
  },
  created() {
    this.webGuider = "SearchGamesPage";
    this.viewMoreText = "展开更多";
    this.title = "为你推荐优选手游";
  },
  mounted() {
    this.fetchData(this.query);
  },
  methods: {
    fetchData(query) {
      post(GAME_S_R_API, {
        params: {
          f: "json",
          keyword: query,
        },
      })
        .then((res) => {
          const { cards } = res;
          if (Array.isArray(cards) && cards.length) {
            const { result, recommend } = format(cards);
            this.hasNoResults = result.length === 0;
            this.result = result;
            this.recommend = recommend;
            this.isLoading = false;
          } else {
            this.hasNoResults = true;
            this.isLoading = false;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.hasNoResults = true;
          console.error(`getGameSR---query:, ${this.query}, "---", ${err}`);
          oreport.reportError(
            new Error(`getGameSR---query:, ${this.query}, "---", ${err}`)
          );
        });
    },
    format,
  },
};
</script>

<style scoped lang="scss">
$namespace: "medusa-"; // 可配置的命名空间
@include b(games-page) {
  position: relative;
  min-height: calc(100vh - 52px);
  @include e(title) {
    height: 28px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 28px;
    font-weight: 500;
  }
}
</style>
