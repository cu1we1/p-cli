<template>
  <div
    class="localResult"
    :class="{ loading: isLoading }"
    data-exp="0"
    :data-log="$utils.inject(this.pageInfo)"
    v-loading="isLoading"
    loading-text="正在加载..."
    :loading-background="
      $utils.isDark ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)'
    "
    :loading-color="$utils.isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'"
  >
    <div class="bsbb card_box local_box" v-show="datelocals.length">
      <div
        v-for="(item, idx) in datelocals"
        :key="item.key"
        class="af aic L_list-itemxxxl"
        :class="{
          'pd_top-0': !idx,
          'pd_bottom-0': idx === datelocals.length - 1,
        }"
        data-exp="0"
        :data-log="
          $utils.inject({
            card_id: item.key,
            card_position: idx + 1,
          })
        "
      >
        <div class="bsbb f1 w100 fs_m cl_normal">
          <div class="bsbb" v-if="item.key === 'apps'">
            <LocalApps
              v-for="(subItem, subIdx) in item.list"
              :key="subItem.title"
              :idx="subIdx"
              :itemData="subItem"
              :parentKey="item.key"
              :parentIcon="item.icon"
              :parentQ="item.q"
              :bgFill="bgFill"
              :total="item.list.length"
            />
          </div>
          <div class="bsbb" v-else>
            <Local
              v-for="(subItem, subIdx) in item.list"
              :key="subItem.title"
              :idx="subIdx"
              :itemData="subItem"
              :parentKey="item.key"
              :parentIcon="item.icon"
              :parentQ="item.q"
              :bgFill="bgFill"
              :total="item.list.length"
            />
          </div>
        </div>
        <i />
      </div>
    </div>
  </div>
</template>

<script>
import { getLocalResult, parse, init, browserInfo, FE_VERSION } from "@lego";
import Local from "./components/Local";
import LocalApps from "./components/LocalApps";

export default {
  name: "LocalResult",
  props: {
    locals: {
      type: Array,
      default() {
        return [];
      },
    },
    q: {
      type: String,
      default: "",
    },
    // key: {
    //   type: String,
    //   default: '',
    // },
    location: {
      type: Object,
      default() {
        return {
          search: "",
        };
      },
    },
  },
  components: { Local, LocalApps },
  computed: {
    pageInfo() {
      const { q, ...rest } = parse(window.location.hash);
      return {
        module_id: "GlobalLocal",
        // 这个rId没有来源
        // 未验证
        search_id: this.rId,
        page_id: "LocalResultPage",
        keyword: q || this.q,
        fe_version: FE_VERSION,
        ...rest,
      };
    },
    localsLen() {
      return this.datelocals.length - 1;
    },
  },
  data() {
    const { q, key } = parse(window.location.hash);
    return {
      datelocals: this.locals,
      dataQ: q || this.q,
      dataKey: key,
      isLoading: true,
      bgFill: true,
    };
  },
  methods: {
    getPageData() {
      const { dataQ, dataKey } = this;
      this.fetchLocalResult(dataQ, dataKey);
    },
    fetchLocalResult(q, curKey) {
      if (!q) {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        return;
      }
      const searchLocalResultCallback = (result = {}) => {
        const { source, items: list, from, isRefresh = false } = result;
        if (!source) {
          this.isLoading = false;
          return;
        }
        if (!(Array.isArray(list) && list.length)) {
          return;
        }

        const { key, icon, label: title } = source,
          { datelocals } = this;

        if (curKey && curKey !== key) {
          return;
        }

        if (curKey === "settings") {
          const settingsInfo = datelocals.find(
            (item) => item.key === "settings"
          );
          if (settingsInfo && from !== "db" && isRefresh) {
            settingsInfo.list = list;
            this.$forceUpdate();
            return;
          }
          if (settingsInfo) {
            return;
          }
        }
        this.datelocals = [
          ...this.datelocals,
          { key: curKey, icon, title, list, q },
        ];
        this.isLoading = false;
      };
      getLocalResult(q, searchLocalResultCallback, curKey);
    },
    ChangeBgFill(childIdx) {
      this.localsLen === childIdx && (this.bgFill = false);
    },
  },
  mounted() {
    this.getPageData();
    init();
  },
  created() {
    if (browserInfo.theme === 1) document.body.classList.add("body_bc");
  },
};
</script>

<style scoped>
.localResult {
  box-sizing: border-box;
  min-height: 100vh;
}
.local_box {
  padding: 10px 6px 16px 6px;
}
</style>
