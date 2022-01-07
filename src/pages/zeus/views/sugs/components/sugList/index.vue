<template>
  <div :class="getCls(sugList)">
    <div
      v-if="showSugs"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: sugsCardId,
          card_position: index,
          card_type: cardType,
        })
      "
    >
      <div
        class="zeus-sugs-sug-list__item-box"
        v-for="(item, idx) in sugList"
        :key="`${sessionID}-${idx}`"
        id="automated_sugs_list"
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_name: item.sug,
            resource_position: idx + 1,
            resource_type: item.type,
          })
        "
      >
        <div
          @click="searchClick($event, item.sug)"
          class="zeus-sugs-sug-list__item-main"
          :data-log="$utils.inject({ control_id: 'sug', resource_source: 0 })"
        >
          <svg
            v-if="item.type === 'local'"
            class="zeus-sugs-sug-list__icon--search"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.2694 2.60818C12.481 2.20085 14.7654 2.58705 16.7202 3.69874C18.675 4.81043 20.1748 6.57629 20.9554 8.68527C21.736 10.7942 21.7473 13.111 20.9874 15.2275C20.2274 17.344 18.7449 19.1245 16.8011 20.2552C14.8572 21.3859 12.5767 21.7944 10.3613 21.4087C8.14578 21.023 6.13748 19.8678 4.69012 18.1467C3.24276 16.4256 2.4492 14.2489 2.44922 12.0001L4.04922 12.0001C4.0492 13.8722 4.70981 15.6842 5.91468 17.1169C7.11955 18.5497 8.79138 19.5113 10.6357 19.8324C12.48 20.1535 14.3784 19.8134 15.9966 18.8721C17.6148 17.9309 18.8489 16.4487 19.4815 14.6868C20.1141 12.9249 20.1047 10.9963 19.4549 9.24065C18.8051 7.48501 17.5566 6.015 15.9293 5.08956C14.302 4.16413 12.4003 3.84263 10.5592 4.18171C8.76874 4.51148 7.14726 5.44546 5.96418 6.8252H8.49922V8.4252H4.12422H3.32422V7.6252V3.2502H4.92422V5.58562C6.32834 4.03687 8.20539 2.98832 10.2694 2.60818ZM11.1992 7.6252V12.0002V12.3316L11.4335 12.5659L14.0585 15.1909L15.1899 14.0595L12.7992 11.6688V7.6252H11.1992Z"
              :fill="$utils.isDark ? 'white' : 'black'"
              fill-opacity="0.3"
            />
          </svg>
          <svg
            v-else
            class="zeus-sugs-sug-list__icon--search"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.8639 19.8027L16.9113 15.8501C18.1157 14.3736 18.7067 12.4908 18.5623 10.5909C18.4178 8.69101 17.549 6.91921 16.1352 5.64175C14.7215 4.36428 12.871 3.6788 10.9662 3.72699C9.06145 3.77518 7.24798 4.55335 5.90067 5.90067C4.55335 7.24798 3.77518 9.06145 3.72699 10.9662C3.6788 12.871 4.36428 14.7215 5.64175 16.1352C6.91921 17.549 8.69101 18.4178 10.5909 18.5623C12.4908 18.7067 14.3736 18.1157 15.8501 16.9113L19.8027 20.8639L20.8639 19.8027ZM11.1666 17.083C9.99644 17.083 8.85251 16.7361 7.87951 16.086C6.9065 15.4358 6.14813 14.5118 5.70029 13.4307C5.25246 12.3496 5.13527 11.1599 5.36356 10.0122C5.59184 8.86451 6.15534 7.81026 6.9828 6.9828C7.81026 6.15534 8.86451 5.59184 10.0122 5.36356C11.1599 5.13527 12.3496 5.25246 13.4307 5.70029C14.5118 6.14813 15.4358 6.9065 16.086 7.87951C16.7361 8.85251 17.083 9.99644 17.083 11.1666C17.0812 12.7352 16.4573 14.239 15.3482 15.3482C14.239 16.4573 12.7352 17.0812 11.1666 17.083Z"
              :fill="$utils.isDark ? 'white' : 'black'"
              fill-opacity="0.3"
            />
          </svg>

          <div
            id="automated_sugs_list_name"
            class="zeus-sugs-sug-list__main-text lc1"
            v-html="highLight(item.sug, q)"
          ></div>
        </div>
        <svg
          id="automated_sugs_list_button_up"
          class="zeus-sugs-sug-list__icon--up"
          :data-log="
            $utils.inject({ control_id: 'up_query', resource_source: '-2' })
          "
          @click="upClick($event, item.sug)"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.8106 7.75H13.9999V6.25H6.99994H6.24994V7V14H7.74994V8.81066L17.4696 18.5303L18.5303 17.4697L8.8106 7.75Z"
            :fill="$utils.isDark ? 'white' : 'black'"
            fill-opacity="0.3"
          />
        </svg>
      </div>
    </div>
    <div
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: sugsMoreCardId,
          card_position: index + 1,
        })
      "
    >
      <div v-if="showSugs" class="zeus-sugs-sug-list__gap-line" />
      <searchMore
        :query="q"
        :engineName="engineName"
        :onSearch="onSearch"
        :isSupCustomSource="isSupCustomSource"
      />
    </div>
  </div>
</template>
<script>
import {
  trackClickBaseEle,
  highLight,
  setKeyboardVisible,
  saveHistory,
} from "@lego";
import searchMore from "./searchMore.vue";
export default {
  name: "more",
  props: {
    q: {
      type: String,
      default: "",
    },
    sessionID: {
      type: String,
      default: "0",
    },
    sugs: {
      type: Array,
      default: () => [],
    },
    onSearch: {
      type: Function,
      default: () => {},
    },
    index: {
      type: Number,
      default: 3,
    },
    hasNetwork: {
      type: Boolean,
      default: true,
    },
    isSupCustomSource: {
      type: Boolean,
      default: false,
    },
    engineName: {
      type: String,
      default: "",
    },
    history: {
      type: Array,
      default: () => [],
    },
    isHistoryReady: {
      type: Boolean,
      required: true,
    },
    isSugsReady: {
      type: Boolean,
      required: true,
    },
    sugNum: {
      type: Number,
      required: true,
    },
    historyNum: {
      type: Number,
      required: true,
    },
    hasSearchFound: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    this.sugsCardId = "sugs";
    this.sugsMoreCardId = "sugs_search_more";
  },
  components: {
    searchMore,
  },
  computed: {
    historyList() {
      return this.history
        .filter((item) => item !== this.q)
        .map((item) => {
          return {
            sug: item,
            type: "local",
          };
        })
        .slice(0, this.historyNum);
    },
    onlineSugList() {
      return this.sugs
        .filter((item) => !this.history.includes(item.sug))
        .map(({ sug }) => {
          return {
            sug: sug,
            type: "online",
          };
        })
        .slice(0, this.sugNum);
    },
    sugList() {
      return [{ sug: this.q }, ...this.historyList, ...this.onlineSugList];
    },
    cardType() {
      return `${this.historyList.length > 0 ? "local," : ""}${
        this.onlineSugList.length > 0 ? "online" : ""
      }`;
    },
    showSugs() {
      if (this.hasNetwork && this.hasSearchFound) {
        return (
          this.sugList?.length > 1 && this.isSugsReady && this.isHistoryReady
        );
      } else {
        return (
          this.sugList?.length > 0 && this.isSugsReady && this.isHistoryReady
        );
      }
    },
  },
  methods: {
    highLight,
    upClick(e, q) {
      setKeyboardVisible(1);
      trackClickBaseEle(e.target);
      if (this.onSearch) {
        this.onSearch(q, "sugs");
      }
    },
    searchClick(e, q) {
      saveHistory(q);
      trackClickBaseEle(e.target);
      this.onSearch(q, "search_sugs");
    },
    getCls(sugList) {
      if (sugList?.length && this.hasNetwork) {
        return "zeus-sugs-sug-list gs_card_bg_color zeus-sugs-sug-list--has-list";
      }
      return "zeus-sugs-sug-list gs_card_bg_color zeus-sugs-sug-list--no-list";
    },
  },
};
</script>
<style lang="scss" scoped>
$namespace: "zeus-sugs-"; // 可配置的命名空间
@include b(sug-list) {
  border-radius: 12px;
  margin: 0px 10px 10px 10px;
  @include e(item-box) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    @include e(item-main) {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 2px 0;
      margin-right: 16px;
    }
    @include e(icon) {
      @include m(search) {
        margin-right: 12px;
        flex-shrink: 0;
      }
      @include m(up) {
        flex-shrink: 0;
      }
    }
    @include e(main-text) {
      font-size: 16px;
      line-height: 21px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  @include e(gap-line) {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-left: none;
    border-right: none;
    border-bottom: none;
    transform: scaleY(0.3);
    margin-top: 8px;
    margin-bottom: 8px;
  }
  @include m(has-list) {
    padding: 8px 14px;
  }
  @include m(no-list) {
    padding: 0 14px;
  }
}
</style>
