<template>
  <div
    v-if="(hasLocalApps && localState) || (hasOnlineApps && onlineState)"
    class="zeus-sugs-app-suggestion gs_card_wrapper gs_card_bg_color"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'mixapps',
        card_position: index,
        card_type: cardType,
      })
    "
  >
    <multi-title
      class="zeus-sugs-app-suggestion__title"
      :title="title"
      :showMore="false"
    />
    <div class="zeus-sugs-app-suggestion__content">
      <template v-for="(item, index) in list">
        <single-local-app
          v-if="item.intentPackage"
          :key="`${item.intentPackage}-${index}`"
          :data="item"
          :index="index + 1"
          :query="query"
          :appsIcon="appsIcon"
          :restoreIcon="restoreIcon"
          :type="getAppType(item.intentPackage)"
          :class="getCls(index)"
          :localButtonState="onlineState"
        />
        <single-online-app
          v-else
          :key="`${item.jumpActions[1].pkg}-${index}`"
          :data="item"
          :index="index + 1"
          :query="query"
          :class="getCls(index)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { MultiTitle } from "@components";
import singleOnlineApp from "./singleOnlineApp.vue";
import singleLocalApp from "./singleLocalApp.vue";

export default {
  props: [
    "query",
    "sessionID",
    "localApps",
    "apps",
    "restore",
    "onlineApps",
    "isOnlineResultsReady",
    "isLocalResultsReady",
    "index",
    "hasLocalApps",
    "hasOnlineApps",
    "localState",
    "onlineState",
  ],
  components: {
    MultiTitle,
    singleOnlineApp,
    singleLocalApp,
  },
  computed: {
    appsIcon() {
      return (this.apps || {}).icon || "";
    },
    restoreIcon() {
      return (this.restore || {}).icon || "";
    },
    list({
      localApps,
      onlineApps,
      isLocalResultsReady,
      isOnlineResultsReady,
      localState,
      onlineState,
    }) {
      // 根据应用建议内容返回是否超时，展示不同的结果。
      return this.getAppList(
        localApps,
        onlineApps,
        isLocalResultsReady,
        isOnlineResultsReady,
        localState,
        onlineState
      );
    },
    cardType({ hasLocalApps, hasOnlineApps, localState }) {
      if (localState) {
        if (hasLocalApps && hasOnlineApps) {
          return `${hasLocalApps ? "local," : ""}${
            hasOnlineApps ? "online" : ""
          }`;
        } else {
          return `${hasLocalApps ? "local" : ""}${
            hasOnlineApps ? "online" : ""
          }`;
        }
      } else {
        return "online";
      }
    },
  },
  created() {
    this.title = "应用建议";
  },
  methods: {
    getAppList(
      localApps,
      onlineApps,
      isLocalResultsReady,
      isOnlineResultsReady,
      localState,
      onlineState
    ) {
      if (localState && onlineState) {
        const localNum = localApps.length;
        const onlineNum = onlineApps.length;
        if (isLocalResultsReady && isOnlineResultsReady) {
          if (onlineNum < 3) {
            return [
              ...localApps.slice(0, 5 - onlineNum),
              ...onlineApps.slice(0, onlineNum),
            ];
          } else if (localNum < 2) {
            return [
              ...localApps.slice(0, localNum),
              ...onlineApps.slice(0, 5 - localNum),
            ];
          } else {
            return [...localApps.slice(0, 2), ...onlineApps.slice(0, 3)];
          }
        } else if (isLocalResultsReady) {
          return [...localApps.slice(0, 2)];
        } else {
          return [...onlineApps.slice(0, 3)];
        }
      } else if (onlineState) {
        return onlineApps.slice(0, 5);
      } else if (localState) {
        return localApps.slice(0, 5);
      } else {
        return [];
      }
    },
    getAppType(pkg) {
      if (this.restore?.list?.length) {
        return this.restore.list.findIndex((item) => {
          return pkg === item.intentPackage;
        }) > -1
          ? "restore"
          : "app";
      }
    },
    getCls(index) {
      if (index === 4) {
        return "zeus-sugs-app-suggestion__content--no-margin";
      }
      return "zeus-sugs-app-suggestion__content--has-margin";
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "zeus-sugs-"; // 可配置的命名空间
@include b(app-suggestion) {
  @include e(title) {
    margin-bottom: 0;
  }
  @include e(content) {
    margin-top: 1px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    @include m(has-margin) {
      margin-right: 1.1111111vw;
    }
  }
}
</style>