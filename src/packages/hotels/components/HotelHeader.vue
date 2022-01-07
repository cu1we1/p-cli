<template>
  <div class="gs-hotel-header">
    <div
      v-if="!mdsSearch || mdsSearch !== '1'"
      class="gs-hotel-header__top-main"
    >
      <div
        class="gs-hotel-header__location"
        :data-href="$utils.inject(genHref({ fastappUrl: hrefCity }))"
        data-href-location="1"
        :data-log="
          $utils.inject({
            resource_name: city,
            resource_source: 0,
            resource_position: 2,
            resource_url: hrefCity,
            resource_provider: 0,
          })
        "
      >
        <svg
          class="gs-hotel-header__location--icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 4.45834C10.7844 4.45834 9.61864 4.94123 8.7591 5.80077C7.89956 6.66031 7.41667 7.8261 7.41667 9.04168C7.41667 10.7454 8.57786 12.5629 9.8939 14.0434C10.5343 14.7639 11.1771 15.3667 11.6606 15.7897C11.7857 15.8992 11.8998 15.9964 12 16.0801C12.1002 15.9964 12.2143 15.8992 12.3395 15.7897C12.8229 15.3667 13.4657 14.7639 14.1061 14.0434C15.4222 12.5629 16.5833 10.7454 16.5833 9.04168C16.5833 7.8261 16.1005 6.66031 15.2409 5.80077C14.3814 4.94123 13.2156 4.45834 12 4.45834ZM12 17.0417C11.55 17.6417 11.5497 17.6414 11.5497 17.6414L11.5479 17.6401L11.5439 17.637L11.5301 17.6266C11.5184 17.6177 11.5019 17.605 11.4807 17.5886C11.4383 17.5558 11.3776 17.5081 11.301 17.4466C11.148 17.3237 10.9316 17.1451 10.6728 16.9186C10.1563 16.4666 9.46569 15.8195 8.77278 15.04C7.42215 13.5205 5.91667 11.3379 5.91667 9.04168C5.91667 7.42828 6.55759 5.88096 7.69844 4.74011C8.83929 3.59926 10.3866 2.95834 12 2.95834C13.6134 2.95834 15.1607 3.59926 16.3016 4.74011C17.4424 5.88096 18.0833 7.42828 18.0833 9.04168C18.0833 11.3379 16.5779 13.5205 15.2272 15.0399C14.5343 15.8195 13.8437 16.4666 13.3272 16.9186C13.0684 17.1451 12.852 17.3237 12.699 17.4466C12.6224 17.5081 12.5617 17.5558 12.5193 17.5886C12.4982 17.605 12.4816 17.6177 12.4699 17.6266L12.4561 17.637L12.4521 17.6401L12.4508 17.6411C12.4508 17.6411 12.45 17.6417 12 17.0417ZM12 17.0417L12.45 17.6417L12 17.9792L11.5497 17.6414L12 17.0417Z"
            fill="#2660F5"
          />
          <path
            d="M12 10.375C12.6904 10.375 13.25 9.81537 13.25 9.12501C13.25 8.43466 12.6904 7.87501 12 7.87501C11.3097 7.87501 10.75 8.43466 10.75 9.12501C10.75 9.81537 11.3097 10.375 12 10.375Z"
            fill="#2660F5"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.5979 15.9778C4.66802 15.6273 4.97583 15.3749 5.33334 15.3749H7.00001V16.8749H5.94819L5.41486 19.5416H18.5852L18.0518 16.8749H17V15.3749H18.6667C19.0242 15.3749 19.332 15.6273 19.4021 15.9778L20.2354 20.1445C20.2795 20.3648 20.2225 20.5933 20.08 20.7671C19.9376 20.9409 19.7247 21.0416 19.5 21.0416H4.50001C4.27531 21.0416 4.06245 20.9409 3.92 20.7671C3.77755 20.5933 3.7205 20.3648 3.76457 20.1445L4.5979 15.9778Z"
            fill="#2660F5"
          />
        </svg>
        <div class="gs-hotel-header__location--city-name lc1">
          {{ city }}
        </div>
      </div>
      <div
        class="gs-hotel-header__date"
        :data-log="
          $utils.inject({
            resource_name: 'hotel_calendar',
            resource_position: 3,
            resource_source: 0,
            resource_url: hrefDate,
            resource_provider: 0,
          })
        "
        :data-href="$utils.inject(genHref({ fastappUrl: hrefDate }))"
      >
        <div
          class="
            gs-hotel-header__date--item-box gs-hotel-header__date--check-in
          "
        >
          <div class="gs-hotel-header__date--check-before">住</div>
          <div class="gs-hotel-header__date--check-text lc1">
            {{ checkIn }}
          </div>
        </div>
        <div
          class="
            gs-hotel-header__date--item-box gs-hotel-header__date--check-out
          "
        >
          <div class="gs-hotel-header__date--check-before">离</div>
          <div class="gs-hotel-header__date--check-text lc1">
            {{ checkOut }}
          </div>
        </div>
      </div>
      <div
        class="gs-hotel-header__input"
        :data-log="
          $utils.inject({
            resource_name: 'input',
            resource_position: 4,
            resource_source: 0,
            resource_url: hrefInput,
            resource_provider: 0,
          })
        "
        :data-href="$utils.inject(genHref({ fastappUrl: hrefInput }))"
      >
        <div class="gs-hotel-header__input--place-holder-text lc1">
          {{ `关键词/位置/品牌/酒店` }}
        </div>
      </div>
    </div>
    <div class="gs-hotel-header__bottom-info">
      <AlertInfo
        class="gs-hotel-header__bottom-info--icon"
        :info="cpData.alertInfo"
        placement="bottom"
        :data-log="
          $utils.inject({
            control_id: 'alertInfo',
            control_name: cpData.alertInfo,
            control_position: 1,
          })
        "
      />
      <div class="gs-hotel-header__bottom-info--text lc1">
        {{ cpData.info }}
      </div>
    </div>
    <div
      v-if="!isClosed && tabArr && tabArr.length"
      class="gs-hotel-header__activity-info hotelOperation"
    >
      <div class="gs-hotel-header__icon-box">
        <div class="gs-hotel-header__icon-box--text lc0">活动</div>
        <div class="gs-hotel-header__icon-box--border" />
      </div>
      <div class="gs-hotel-header__carousel-wrapper">
        <div class="gs-hotel-header__texts">
          <color-swipe
            :auto-duration="3000"
            :vertical="true"
            style="height: 55vw"
          >
            <!-- @change="handleChange" -->
            <color-swipe-item v-for="item in tabArr" :key="item.key">
              <div
                data-exp="0"
                class="gs-hotel-header__texts--item lc1"
                :data-href="$utils.inject(item.href)"
                :data-log="
                  $utils.inject({
                    resource_id: item.resourceId,
                    resource_name: item.resourceName,
                    resource_position: 5,
                    resource_source: item.clickType,
                    resource_url: JSON.stringify(item.href),
                    resource_provider: item.cpId,
                  })
                "
              >
                {{ item.text }}
              </div>
            </color-swipe-item>
          </color-swipe>
        </div>
      </div>
      <div
        data-href=""
        class="gs-hotel-header__icon-close"
        :style="{ backgroundImage: `url(${operationCloseIcon})` }"
        @click="close"
        :data-log="
          $utils.inject({
            control_name: 'hotelOperationClose',
            control_position: 1,
            control_type: 'button',
          })
        "
      />
    </div>
  </div>
</template>

<script>
import { genHref, mThemes, formatUrl } from "@lego";
import { browserInfo, localStorage } from "@lego";
import { AlertInfo } from "@components";
const { source = "" } = browserInfo || {},
  { hotelPlaceIcon, hotelHeadClearBg, operationBgColor, operationCloseIcon } =
    mThemes;
const getHrefResult = ((source) => {
  let _href = "hap://app/com.globalsearch.hap/hotel/listbox?";
  if (source) {
    _href += `oparams=${source}&fields=`;
  } else {
    _href += `fields=`;
  }
  return (data) => {
    return `${_href}${encodeURIComponent(JSON.stringify(data))}`;
  };
})(source);

export default {
  name: "HotelHead",
  components: { AlertInfo },
  props: [
    "type",
    "operation",
    "checkIn",
    "checkOut",
    "location",
    "lat",
    "lon",
    "poi",
    "brand",
    "star",
    "mdsSearch",
    "mdsQuery",
  ],
  data() {
    return {
      genHref,
      hotelPlaceIcon,
      hotelHeadClearBg,
      operationBgColor,
      operationCloseIcon,
      isClosed: this.operation?.hasClosed,
    };
  },
  computed: {
    city() {
      return this.location || "北京";
    },
    oversea() {
      return this.type === "foreign" ? 1 : 0;
    },
    cpData() {
      let info, alertInfo;
      if (this.type === "domestic") {
        info = "预订服务由携程旅行、同程旅行提供，价格实时变动，以订单页为准";
        alertInfo =
          "展示价格以及房间状态由第三方携程旅行、同程旅行提供，仅供参考。由于价格以及房间状态实时变化，且与您是否登录等多种因素相关，所以请以最终订单提交页酒店价格以及房间状态为准。";
      } else {
        info = "预订服务由携程旅行提供，价格实时变动，以订单页为准";
        alertInfo =
          "展示价格以及房间状态由第三方携程旅行提供，仅供参考。由于价格以及房间状态实时变化，且与您是否登录等多种因素相关，所以请以最终订单提交页酒店价格以及房间状态为准。";
      }
      return { info, alertInfo };
    },
    getHrefQuery() {
      const {
          city,
          lon,
          lat,
          poi,
          brand,
          star,
          oversea,
          mdsSearch: mds_search,
          mdsQuery: mds_query,
        } = this,
        baseObj = {
          city,
          lon,
          lat,
          poi,
          brand,
          star,
          oversea,
          mds_search,
          mds_query,
        };
      return (data) => {
        const hrefquery = Object.assign(data, baseObj);
        return getHrefResult(hrefquery);
      };
    },
    hrefCity() {
      let data = {
        poidisplay: true,
        from: "search",
      };
      return this.getHrefQuery(data);
    },
    hrefDate() {
      let data = {
        datedisplay: true,
        from: "search",
      };
      return this.getHrefQuery(data);
    },
    hrefInput() {
      let data = {
        input: true,
        from: "search",
      };
      return this.getHrefQuery(data);
    },
    tabArr() {
      if (this.operation) {
        const { tabItem } = this.operation;
        const data = JSON.parse(JSON.stringify(tabItem)) || [];
        return data.map((item, index) => {
          const { content, cpId, resourceId, jumpActions } = item;
          const key = index;
          const [text, resourceName] = content;
          const { click_type: clickType } = jumpActions[0] || {};
          const href = formatUrl(jumpActions);
          return {
            key,
            text,
            resourceName,
            clickType,
            href,
            cpId,
            resourceId,
          };
        });
      }
      return [];
    },
  },
  methods: {
    close() {
      const { time, activityId } = this.operation;
      this.isClosed = true;
      this.setLocalById(activityId, time);
    },
    setLocalById(id, time) {
      const activities = this.operation.activities || [];

      if (Array.isArray(activities)) {
        const newActivity = {};
        newActivity[id] = time;
        activities.push(newActivity);
      }

      localStorage.setItem("hotelActivity", JSON.stringify(activities));
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-"; // 可配置的命名空间
@include b(hotel-header) {
  padding: 0 14px;
  @include e(top-main) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    @include e(location) {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include m(icon) {
        margin-right: 4px;
      }
      @include m(city-name) {
        font-size: 16px;
        font-weight: 500;
        color: rgba(10, 127, 251, 1);
      }
    }
    @include e(date) {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @include m(item-box) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      @include m(check-before) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        margin-right: 6px;
      }
      @include m(check-text) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(10, 127, 251, 1);
      }
      @include m(check-in) {
        margin-bottom: 4px;
      }
    }
    @include e(input) {
      width: 41.1vw;
      height: 36px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 27.8vw;
      display: flex;
      align-items: center;
      justify-content: center;
      @include m(place-holder-text) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  @include e(bottom-info) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 12px;
    @include m(icon) {
      flex-shrink: 0;
    }
    @include m(text) {
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.3);
    }
  }
  @include e(activity-info) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 6px 0 11px 0;
    padding: 9px;
    border-radius: 9px;
    background-color: rgba(0, 122, 255, 0.1);
    @include e(icon-box) {
      margin-right: 8px;
      width: 31px;
      height: 17px;
      position: relative;
      flex-shrink: 0;
      @include m(text) {
        width: 100%;
        line-height: 16px;
        text-align: center;
        font-weight: 400;
        font-size: 12px;
        color: #2660f5;
      }
      @include m(border) {
        width: 91px;
        height: 49px;
        border: 1px solid #2660f5;
        border-radius: 8.1px;
        transform: scale(0.33333333);
        position: absolute;
        top: -103%;
        left: -100%;
      }
    }
    @include e(carousel-wrapper) {
      overflow: hidden;
      height: 16px;
      flex: 1;
      @include e(texts) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        @include m(item) {
          font-size: 12px;
          line-height: 16px;
          color: #2660f5;
        }
      }
    }
    @include e(icon-close) {
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: contain;
      flex-shrink: 0;
    }
  }
}
</style>