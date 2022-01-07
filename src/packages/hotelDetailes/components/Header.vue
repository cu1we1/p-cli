<template>
  <div class="gs-hotel-details-header">
    <div class="gs-hotel-details-header__image-box" @touchmove.stop>
      <color-swipe
        style="height: auto"
        :show-indicators="false"
        @change="getImageSrc"
      >
        <color-swipe-item v-for="(item, index) in head.pics" :key="item">
          <div
            data-exp="0"
            :data-log="
              $utils.inject({
                resource_url: picHref,
                resource_name: 'head_pic',
                resource_position: `1-${index + 1}`,
                resource_source: hasPics ? 0 : 1,
                resource_provider: hasPics ? 0 : logQuery.cpId,
                resource_id: resourceId,
              })
            "
            :data-href="$utils.inject(genHref({ fastappUrl: picHref }))"
          >
            <Pic :src="item" class="gs-hotel-details-header__image" />
          </div>
        </color-swipe-item>
      </color-swipe>
      <div
        class="gs-hotel-details-header__image-tag"
        v-if="head.name[2]"
        :data-log="
          $utils.inject({
            resource_url: picHref,
            resource_name: 'head_pic',
            resource_position: `1`,
            resource_source: 1,
            resource_id: resourceId,
          })
        "
        :data-href="$utils.inject(genHref({ fastappUrl: picHref }))"
      >
        {{ getImageNums(head.name[2]) }}
      </div>
    </div>
    <div class="gs-hotel-details-header__title-info">
      <div
        class="lc2"
        :data-log="
          $utils.inject({
            resource_id: resourceId,
            resource_position: 2,
            resource_name: head.name[0],
            resource_provider: logQuery.cpId,
            resource_source: 1,
            resource_url: logQuery.detailsHref,
          })
        "
        :data-href="
          $utils.inject(genHref({ fastappUrl: logQuery.detailsHref }))
        "
      >
        <div
          class="gs-hotel-details-header__title-info--name"
          v-html="matchCharacters(head.name[0], q, null, 'none')"
        ></div>
        <div class="gs-hotel-details-header__title-info--type lc0">
          {{ head.name[3] }}
        </div>
      </div>
      <div class="gs-hotel-details-header__title-info--other-box">
        <div class="gs-hotel-details-header__title-info--other">
          <div
            class="gs-hotel-details-header__title-info--other-items"
            v-if="head.name[4]"
          >
            <svg
              class="gs-hotel-details-header__title-info--svg-info"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.3">
                <rect
                  x="0.335"
                  y="4.835"
                  width="15.33"
                  height="8.33"
                  rx="1.665"
                  :stroke="$utils.isDark ? 'white' : 'black'"
                  stroke-width="0.67"
                />
                <path
                  d="M4.77495 9.1C4.77495 9.46 4.70495 9.78167 4.56495 10.065C4.42495 10.3483 4.22828 10.5683 3.97495 10.725C3.72495 10.8817 3.43662 10.96 3.10995 10.96C2.78662 10.96 2.49828 10.8817 2.24495 10.725C1.99495 10.5683 1.79995 10.3483 1.65995 10.065C1.51995 9.78167 1.44995 9.46 1.44995 9.1C1.44995 8.73667 1.51995 8.41333 1.65995 8.13C1.79995 7.84667 1.99495 7.62667 2.24495 7.47C2.49828 7.31 2.78662 7.23 3.10995 7.23C3.43662 7.23 3.72495 7.31 3.97495 7.47C4.22828 7.62667 4.42495 7.84667 4.56495 8.13C4.70495 8.41333 4.77495 8.73667 4.77495 9.1ZM2.01995 9.1C2.01995 9.38 2.06495 9.62833 2.15495 9.845C2.24828 10.0617 2.37662 10.23 2.53995 10.35C2.70662 10.47 2.89662 10.53 3.10995 10.53C3.32662 10.53 3.51828 10.47 3.68495 10.35C3.85495 10.23 3.98495 10.0617 4.07495 9.845C4.16828 9.62833 4.21495 9.38 4.21495 9.1C4.21495 8.81667 4.16828 8.56667 4.07495 8.35C3.98495 8.13 3.85495 7.96 3.68495 7.84C3.51828 7.72 3.32662 7.66 3.10995 7.66C2.89662 7.66 2.70662 7.72 2.53995 7.84C2.37662 7.96 2.24828 8.13 2.15495 8.35C2.06495 8.56667 2.01995 8.81667 2.01995 9.1ZM5.38819 10.9V7.285H6.61319C6.87319 7.285 7.09986 7.33333 7.29319 7.43C7.48653 7.52333 7.63319 7.65667 7.73319 7.83C7.83653 8 7.88819 8.19833 7.88819 8.425C7.88819 8.655 7.83653 8.85667 7.73319 9.03C7.63319 9.20333 7.48653 9.33833 7.29319 9.435C7.09986 9.52833 6.87319 9.575 6.61319 9.575H5.92319V10.9H5.38819ZM6.51819 9.155C6.78153 9.155 6.98153 9.09167 7.11819 8.965C7.25486 8.83833 7.32319 8.65833 7.32319 8.425C7.32319 8.19167 7.25486 8.01333 7.11819 7.89C6.98153 7.76333 6.78153 7.7 6.51819 7.7H5.92319V9.155H6.51819ZM10.6552 10.9H8.43019V7.285H10.6552V7.73H8.96519V8.785H10.5452V9.22H8.96519V10.46H10.6552V10.9ZM11.772 10.9H11.272V7.285H11.847L13.717 9.975V7.285H14.217V10.9H13.747L11.772 8.075V10.9Z"
                  :fill="$utils.isDark ? 'white' : 'black'"
                />
                <path
                  d="M4.29538 4.43475C4.14889 4.54776 4.12174 4.75813 4.23475 4.90462C4.34776 5.05111 4.55813 5.07825 4.70462 4.96525L4.29538 4.43475ZM11.2954 4.96525C11.4419 5.07825 11.6522 5.05111 11.7652 4.90462C11.8783 4.75813 11.8511 4.54776 11.7046 4.43475L11.2954 4.96525ZM7.81676 2.14136L7.61214 1.87611L7.81676 2.14136ZM8.18324 2.14136L8.38786 1.87611L8.18324 2.14136ZM4.70462 4.96525L8.02138 2.4066L7.61214 1.87611L4.29538 4.43475L4.70462 4.96525ZM7.97862 2.4066L11.2954 4.96525L11.7046 4.43475L8.38786 1.87611L7.97862 2.4066ZM8.02138 2.4066C8.00878 2.41632 7.99122 2.41632 7.97862 2.4066L8.38786 1.87611C8.15933 1.69982 7.84067 1.69982 7.61214 1.87611L8.02138 2.4066Z"
                  :fill="$utils.isDark ? 'white' : 'black'"
                />
              </g>
            </svg>
            <div class="lc1">{{ head.name[4] }}开业</div>
          </div>
          <div
            v-if="head.name[5]"
            class="
              gs-hotel-details-header__title-info--other-items
              gs-hotel-details-header__title-info--other-items-second
            "
          >
            <svg
              class="gs-hotel-details-header__title-info--svg-info"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.3">
                <path
                  d="M2.335 3.2002C2.335 2.83293 2.63273 2.5352 3 2.5352H13C13.3673 2.5352 13.665 2.83293 13.665 3.2002V5.6002C13.665 5.96746 13.3673 6.2652 13 6.2652H3C2.63273 6.2652 2.335 5.96746 2.335 5.6002V3.2002Z"
                  :stroke="$utils.isDark ? 'white' : 'black'"
                  stroke-width="0.67"
                />
                <path
                  d="M7.0352 10.6C7.0352 10.2327 7.33293 9.93498 7.7002 9.93498H8.30019C8.66746 9.93498 8.9652 10.2327 8.9652 10.6V13.2002C8.9652 13.5674 8.66746 13.8652 8.3002 13.8652H7.7002C7.33293 13.8652 7.0352 13.5674 7.0352 13.2002V10.6Z"
                  :stroke="$utils.isDark ? 'white' : 'black'"
                  stroke-width="0.67"
                />
                <path
                  d="M13.5 4.40021H14.3C14.8523 4.40021 15.3 4.84792 15.3 5.40021V6.99982C15.3 7.5521 14.8523 7.99982 14.3 7.99982H9C8.44771 7.99982 8 8.44753 8 8.99982V9.70021"
                  :stroke="$utils.isDark ? 'white' : 'black'"
                  stroke-width="0.67"
                />
                <path
                  d="M4 4.40021H12"
                  :stroke="$utils.isDark ? 'white' : 'black'"
                  stroke-width="0.67"
                />
              </g>
            </svg>
            <div class="lc1">{{ head.name[5] }}装修</div>
          </div>
        </div>
        <div
          :data-log="$utils.inject(dataLogDetails)"
          @click="showHotelDetails"
          class="gs-hotel-details-header__title-info--details-info lc1"
          :data-href="
            $utils.inject(
              type === 'foreign' && logQuery.detailsHref
                ? genHref({ fastappUrl: logQuery.detailsHref })
                : ''
            )
          "
        >
          酒店详情
        </div>
      </div>
    </div>
    <pop-hotel-details
      v-if="type !== 'foreign'"
      :isShow="showDetails"
      :pageData="head.introduction"
      :cpDetailsInfo="cpDetailsInfo"
      :cpId="logQuery.cpId"
      @changeIsShow="changeShowDetails"
    />
  </div>
</template>

<script>
import { genHref, matchCharacters } from "@lego";
import { debounceExport, browserInfo } from "@lego";
import { Pic } from "@components";
import PopHotelDetails from "./PopDetails";

const { source = "" } = browserInfo || {};
export default {
  name: "HotelDetailsHeader",
  components: {
    PopHotelDetails,
    Pic,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    head: {
      type: Object,
      default: () => {},
    },
    cpDetailsInfo: {
      type: Array,
      default: () => [],
    },
    resourceId: {
      type: [String, Number],
      default: "",
    },
    q: {
      type: String,
      default: "",
    },
  },
  computed: {
    headInfo() {
      let cpNames = "";
      this.cpDetailsInfo.forEach((item) => {
        const { cpName } = item;
        cpNames ? (cpNames += `,${cpName}`) : (cpNames += cpName);
      });
      return cpNames
        ? `预定服务由${cpNames}提供,价格实时变动,以订单页为准`
        : "";
    },
    hasPics() {
      const { pics } = this.head;
      return Array.isArray(pics) && pics.length > 1;
    },
    picHref() {
      let { url } = this.head,
        { url: picHref } = url[0] || { url: "" };
      if (this.hasPics && picHref && source) {
        picHref += `&oparams=${source}`;
      }
      return picHref;
    },
    logQuery() {
      let { url } = this.head,
        { url: detailsHref, cpId } = url[2] || { url: "" };
      return {
        detailsHref,
        cpId,
      };
    },
    dataLogDetails() {
      let dataLogDetails;
      if (this.type === "foregin") {
        dataLogDetails = {
          resource_id: "details",
          resource_position: 1,
          resource_source: 1,
          resource_name: "酒店详情",
          resource_provider: this.logQuery.cpId,
          resource_url: this.logQuery.detailsHref,
        };
      } else {
        dataLogDetails = {
          control_id: "details",
          control_position: 1,
          control_name: "酒店详情",
          control_type: "button",
        };
      }
      return dataLogDetails;
    },
  },
  data() {
    return {
      genHref,
      showDetails: false,
    };
  },
  methods: {
    matchCharacters,
    showHotelDetails() {
      if (this.type === "domestic" && this.head.introduction) {
        this.showDetails = true;
      }
    },
    changeShowDetails(val) {
      this.showDetails = val;
    },
    getImageSrc() {
      debounceExport();
    },
    getImageNums(info) {
      const num = info?.split("全部")[1]?.split("张")[0];
      return `全部 ${num} 张`;
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-hotel-details-"; // 可配置的命名空间
@include b(header) {
  margin-bottom: 13.67px;
  @include e(image) {
    /* width: 86.6666667vw; */
    width: 100%;
    height: 32.5vw;
  }
  @include e(image-box) {
    position: relative;
    border-radius: 7px;
    overflow: hidden;
  }
  @include e(image-tag) {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    font-size: 12px;
    line-height: 22px;
    color: #fff;
    font-weight: 500;
    padding: 0 6px;
  }
  @include e(title-info) {
    margin-top: 14px;
    @include m(name) {
      display: inline-block;
      font-size: 18px;
      line-height: 23px;
    }
    @include m(type) {
      display: inline-block;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.3);
      margin-left: 10px;
    }
    @include m(other-box) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 6px;
    }
    @include m(other) {
      display: flex;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.3);
    }
    @include m(other-items) {
      display: flex;
    }
    @include m(other-items-second) {
      margin-left: 10px;
    }
    @include m(svg-info) {
      margin-right: 4px;
    }
    @include m(details-info) {
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: #2660f5;
      flex-shrink: 0;
    }
  }
}
</style>