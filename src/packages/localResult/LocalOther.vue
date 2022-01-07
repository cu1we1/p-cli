<template>
  <div
    v-if="!noResult"
    :id="`automated_${key}_card`"
    class="card_box local_result"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: key,
        card_position: index + 1,
        card_type: 'local',
      })
    "
  >
    <div class="df aic jcsb" :id="`automated_${key}_title`">
      <div
        class="card_title"
        :style="{
          marginBottom: '0',
        }"
      >
        {{ title }}
      </div>
      <div
        v-if="hasMore"
        :id="`automated_${key}_title_more`"
        class="df aic mi_left-xs"
        :data-href="
          $utils.inject({
            h5: {
              url: `${localUrl}q=${q}&key=${key}`,
              title,
              mode: 'page',
              judgeNet: false,
            },
          })
        "
        color="light"
        :data-log="
          $utils.inject({
            control_id: `${key}_more`,
            control_position: 1,
            control_name: '更多',
            control_type: 'button',
          })
        "
      >
        <AngleRight />
      </div>
    </div>
    <list-apps
      class="mi_top-xs"
      v-if="key === 'apps'"
      :list="getAppsOrSettingsList(list)"
      :keys="key"
      :icon="icon"
      :q="q"
      :rKey="rKey"
    />
    <list-files
      class="mi_top-xs"
      v-else-if="key === 'files'"
      :list="getOtherList(list)"
      :keys="key"
      :icon="icon"
      :q="q"
    />
    <list-settings
      v-else-if="key === 'settings'"
      :list="getAppsOrSettingsList(list)"
      :keys="key"
      :icon="icon"
      :q="q"
    />
    <List
      v-else
      :list="getOtherList(list)"
      :keys="key"
      :icon="icon"
      :q="q"
      class="mi_top-xs"
    />
  </div>
</template>

<script>
import { AngleRight } from "@components";
import { ZEUS_URL as URL } from "@lego";
import List from "./components/List";
import ListApps from "./components/ListApps/index";
import ListFiles from "./components/ListFiles/index";
import ListSettings from "./components/ListSettings/index";

export default {
  props: ["q", "item", "index", "isLess"],
  components: {
    AngleRight,
    List,
    ListApps,
    ListFiles,
    ListSettings,
  },
  data() {
    const { icon, key, title, rKey = "" } = this.item;
    let { list = [], rList = [] } = this.item;
    if (rList.length) {
      rList = rList.map((item) => {
        return {
          ...item,
          isRestore: true,
        };
      });
    }
    let appList = [...list, ...rList];
    const noResult = !appList || !appList.length;
    const len = appList.length;
    let hasMoreGap = 3;
    if (this.isLess && (key === "apps" || key === "settings")) {
      hasMoreGap = 2;
    } else if (this.isLess) {
      hasMoreGap = 1;
    }
    const hasMore = len > hasMoreGap;
    appList = hasMore ? appList.slice(0, 3) : appList;

    return {
      key,
      rKey,
      hasMore,
      icon,
      list: appList,
      title,
      noResult,
      localUrl: `${URL}#/local?`,
    };
  },
  methods: {
    // 综合tab下其他卡片只展示一条结果。
    getOtherList(listData) {
      return this.isLess ? listData.slice(0, 1) : listData;
    },
    // 综合tab下app和设置展示两条。
    getAppsOrSettingsList(listData) {
      return this.isLess ? listData.slice(0, 2) : listData;
    },
  },
};
</script>

<style></style>
