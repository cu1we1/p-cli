<template>
  <div class="zeus-sugs-search-more">
    <div
      v-if="engineName"
      class="zeus-sugs-search-more__more-box"
      id="automated_sugs_list_web_search"
      @click="moreClick(query, 'web')"
      data-exp="0"
      data-href=""
      :data-log="
        $utils.inject({
          resource_name: 'search_web',
          resource_source: 0,
          resource_position: 1,
        })
      "
    >
      <div class="zeus-sugs-search-more__main">
        <svg
          class="zeus-sugs-search-more__main--search-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.33333 12C4.33333 7.76582 7.76582 4.33333 12 4.33333C14.6822 4.33333 17.0427 5.7107 18.4128 7.7967C17.3677 9.51307 15.7133 11.5865 13.6501 13.6497C11.5867 15.7131 9.51304 17.3677 7.79658 18.4127C5.71064 17.0426 4.33333 14.6821 4.33333 12ZM6.49462 19.1203C5.89049 18.6525 5.34751 18.1095 4.87972 17.5054C4.66424 17.9654 4.51798 18.3692 4.44007 18.7077C4.30053 19.3141 4.42126 19.5058 4.45774 19.5423C4.49421 19.5787 4.68594 19.6995 5.2923 19.5599C5.63083 19.482 6.03459 19.3358 6.49462 19.1203ZM4.04347 16.2102C3.60583 17.0111 3.2904 17.7582 3.14071 18.4087C2.97679 19.1209 2.96561 19.9358 3.51493 20.4851C4.06424 21.0344 4.87906 21.0232 5.59133 20.8593C6.24177 20.7096 6.98896 20.3942 7.78979 19.9565C9.04607 20.6227 10.479 21 12 21C16.9706 21 21 16.9706 21 12C21 10.479 20.6227 9.0462 19.9566 7.78996C20.3944 6.98891 20.71 6.24152 20.8597 5.59092C21.0236 4.87865 21.0348 4.06383 20.4855 3.51452C19.9522 2.98125 19.1682 2.9772 18.4789 3.12478C17.8099 3.26802 17.0372 3.59132 16.2101 4.04338C14.9538 3.37729 13.521 3 12 3C7.02944 3 3 7.02944 3 12C3 13.521 3.37732 14.9539 4.04347 16.2102ZM17.5052 4.87959C18.1095 5.34746 18.6526 5.89054 19.1204 6.4948C19.3361 6.03453 19.4824 5.63057 19.5603 5.29189C19.6999 4.68553 19.5792 4.4938 19.5427 4.45733C19.508 4.42267 19.3286 4.30642 18.758 4.42857C18.4107 4.50294 17.9897 4.6526 17.5052 4.87959ZM19.1244 9.16231C19.4743 10.04 19.6667 10.9975 19.6667 12C19.6667 16.2342 16.2342 19.6667 12 19.6667C10.9975 19.6667 10.0399 19.4742 9.16218 19.1243C10.8373 18.0168 12.7304 16.455 14.5929 14.5925C16.4552 12.7302 18.0169 10.8373 19.1244 9.16231Z"
            :fill="$utils.isDark ? 'white' : 'black'"
            fill-opacity="0.3"
          />
        </svg>
        <div class="zeus-sugs-search-more__main--text">
          <p class="zeus-sugs-search-more__main--text-normal">
            {{ webSearch }}
          </p>
          <p class="zeus-sugs-search-more__main--text-query lc1">
            {{ query }}
          </p>
        </div>
      </div>
      <angle-right />
    </div>
    <div
      class="zeus-sugs-search-more__more-box"
      id="automated_sugs_list_app_search"
      @click="moreClick(query, 'online_apps')"
      data-href=""
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_name: 'search_app',
          resource_source: 0,
          resource_position: 2,
        })
      "
    >
      <div class="zeus-sugs-search-more__main">
        <svg
          class="zeus-sugs-search-more__main--search-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.92422 5.8752C4.92422 5.35102 5.35005 4.9252 5.87422 4.9252H8.49922C9.02339 4.9252 9.44922 5.35102 9.44922 5.8752V9.4502H5.87422C5.35005 9.4502 4.92422 9.02437 4.92422 8.5002V5.8752ZM5.87422 3.3252C4.46639 3.3252 3.32422 4.46737 3.32422 5.8752V8.5002C3.32422 9.90802 4.46639 11.0502 5.87422 11.0502H10.2492H11.0492V10.2502V5.8752C11.0492 4.46737 9.90705 3.3252 8.49922 3.3252H5.87422ZM14.5492 5.8752C14.5492 5.35102 14.975 4.9252 15.4992 4.9252H18.1242C18.6484 4.9252 19.0742 5.35102 19.0742 5.8752V8.5002C19.0742 9.02437 18.6484 9.4502 18.1242 9.4502H14.5492V5.8752ZM15.4992 3.3252C14.0914 3.3252 12.9492 4.46737 12.9492 5.8752V10.2502V11.0502H13.7492H18.1242C19.532 11.0502 20.6742 9.90802 20.6742 8.5002V5.8752C20.6742 4.46737 19.532 3.3252 18.1242 3.3252H15.4992ZM12.9492 12.9502H13.7492H18.1242C19.532 12.9502 20.6742 14.0924 20.6742 15.5002V18.1252C20.6742 19.533 19.532 20.6752 18.1242 20.6752H15.4992C14.0914 20.6752 12.9492 19.533 12.9492 18.1252V13.7502V12.9502ZM14.5492 14.5502V18.1252C14.5492 18.6494 14.975 19.0752 15.4992 19.0752H18.1242C18.6484 19.0752 19.0742 18.6494 19.0742 18.1252V15.5002C19.0742 14.976 18.6484 14.5502 18.1242 14.5502H14.5492ZM4.92422 15.5002C4.92422 14.976 5.35005 14.5502 5.87422 14.5502H9.44922V18.1252C9.44922 18.6494 9.02339 19.0752 8.49922 19.0752H5.87422C5.35005 19.0752 4.92422 18.6494 4.92422 18.1252V15.5002ZM5.87422 12.9502C4.46639 12.9502 3.32422 14.0924 3.32422 15.5002V18.1252C3.32422 19.533 4.46639 20.6752 5.87422 20.6752H8.49922C9.90705 20.6752 11.0492 19.533 11.0492 18.1252V13.7502V12.9502H10.2492H5.87422Z"
            :fill="$utils.isDark ? 'white' : 'black'"
            fill-opacity="0.3"
          />
        </svg>
        <div class="zeus-sugs-search-more__main--text">
          <p class="zeus-sugs-search-more__main--text-normal">
            {{ appSearch }}
          </p>
          <p class="zeus-sugs-search-more__main--text-query lc1">
            {{ query }}
          </p>
        </div>
      </div>
      <angle-right />
    </div>
    <div
      class="zeus-sugs-search-more__more-box"
      id="automated_sugs_list_local_search"
      @click="moreClick(query, 'local')"
      data-href=""
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_name: 'search_local',
          resource_source: 0,
          resource_position: 3,
        })
      "
    >
      <div class="zeus-sugs-search-more__main">
        <svg
          class="zeus-sugs-search-more__main--search-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.03359 3.74441C6.03359 3.70226 6.04086 3.68033 6.04391 3.67286C6.04652 3.66646 6.04812 3.66514 6.04844 3.66488L6.04848 3.66484L6.0485 3.66482C6.04911 3.66424 6.05635 3.65739 6.07736 3.64977C6.09923 3.64183 6.13874 3.63223 6.19997 3.63223H17.7964C17.8577 3.63223 17.8972 3.64183 17.9191 3.64977C17.9401 3.65739 17.9473 3.66424 17.9479 3.66482L17.9479 3.66484L17.948 3.66488C17.9483 3.66514 17.9499 3.66646 17.9525 3.67286C17.9556 3.68033 17.9628 3.70226 17.9628 3.74441V20.2549C17.9628 20.2599 17.9582 20.2891 17.9282 20.3195C17.9052 20.3428 17.8667 20.3671 17.7964 20.3671H6.03359V3.74441ZM6.19997 2.03223C5.74163 2.03223 5.29193 2.17876 4.95021 2.50131C4.60432 2.82781 4.43359 3.27458 4.43359 3.74441V21.1671V21.9671H5.23359H17.7964C18.8266 21.9671 19.5628 21.1443 19.5628 20.2549V3.74441C19.5628 3.27458 19.3921 2.82781 19.0462 2.50131C18.7045 2.17876 18.2548 2.03223 17.7964 2.03223H6.19997ZM13.9314 17.4799H10.0659V19.0799H13.9314V17.4799Z"
            :fill="$utils.isDark ? 'white' : 'black'"
            fill-opacity="0.3"
          />
        </svg>
        <div class="zeus-sugs-search-more__main--text">
          <p class="zeus-sugs-search-more__main--text-normal">
            {{ localSearch }}
          </p>
          <p class="zeus-sugs-search-more__main--text-query lc1">
            {{ query }}
          </p>
        </div>
      </div>
      <angle-right />
    </div>
  </div>
</template>

<script>
import { localStorage, highLight } from "@lego";
import { AngleRight } from "@components";
import { DEFAULT_TAB_INDEX, tabMapping_web } from "@lego";

export default {
  props: ["query", "engineName", "onSearch", "isSupCustomSource"],
  components: {
    AngleRight,
  },
  created() {
    this.appSearch = "应用搜索：";
    this.localSearch = "本机搜索：";
    this.sourceMapping = {
      local: "local",
      online_apps: "app",
      web: "web",
    };
  },
  computed: {
    webSearch() {
      if (this.engineName === "百度搜索") {
        return "百度一下：";
      }
      return `${this.engineName}：`;
    },
  },
  methods: {
    highLight,
    moreClick(q, searchSource) {
      // 设置默认结果页跳转的tab。
      const tabIndex = tabMapping_web[searchSource];
      localStorage.setItem(DEFAULT_TAB_INDEX, tabIndex);
      const source = this.isSupCustomSource
        ? this.sourceMapping[searchSource]
        : "search_sugs";
      this.onSearch(q, source);
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-sugs-"; // 可配置的命名空间
@mixin flexB {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
@include b(search-more) {
  @include e(more-box) {
    padding: 12px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include e(main) {
      @include flexB;
      padding: 2px 0;
      margin-right: 20px;
      @include m(search-icon) {
        flex-shrink: 0;
        margin-right: 12px;
      }
      @include m(text) {
        @include flexB;
        font-size: 16px;
        line-height: 21px;
      }
      @include m(text-normal) {
        color: rgba(0, 0, 0, 0.55);
        flex-shrink: 0;
      }
      @include m(text-query) {
        color: #ea3447;
      }
    }
  }
}
</style>