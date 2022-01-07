<template>
  <div class="gs-hotel-details card_box">
    <div class="card_title">酒店预订</div>
    <Header
      :head="payloadData.head"
      :cpDetailsInfo="payloadData.cpDetailsInfo"
      :q="q"
      :type="asyncPayload.type"
      :resourceId="payloadData.resourceId"
    />
    <div v-if="scoreData.isShow" class="gs-hotel-details__gap-line" />
    <div class="gs-hotel-details__score" v-if="scoreData.isShow">
      <div class="gs-hotel-details__score-box">
        <div
          class="gs-hotel-details__score-items"
          v-for="item in scoreData.list"
          :key="`${item.cpName}-${item.num}`"
        >
          <div class="gs-hotel-details__score-items--cp-name lc1">
            {{ item.cpName }}
          </div>
          <div :class="getScoreNumCls(item.cpName)">
            {{ item.num }}
          </div>
        </div>
      </div>
      <div class="gs-hotel-details__score-tags" v-if="scoreData.tagList.length">
        <template v-for="(item, idx) in scoreData.tagList">
          <div
            class="gs-hotel-details__score-tags--tag"
            v-if="item"
            :key="'tag_' + idx"
          >
            {{ item }}
          </div>
        </template>
      </div>
    </div>
    <div v-if="NavigationData.isShow" class="gs-hotel-details__gap-line" />
    <div
      class="gs-hotel-details__navigation"
      v-if="NavigationData.isShow"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: asyncPayload.data.head.resourceId,
          resource_name: 'navigation',
          resource_source: 1,
          resource_provider: NavigationData.cpId,
          resource_position: 1,
        })
      "
      :data-href="$utils.inject(genHref({ fastappUrl: NavigationData.href }))"
    >
      <div class="gs-hotel-details__navigation-info">
        <div class="gs-hotel-details__navigation-info--poi lc2">
          {{ NavigationData.location }}
        </div>
        <div class="gs-hotel-details__navigation-info--location lc1">
          {{ NavigationData.district }}
        </div>
      </div>
      <div class="gs-hotel-details__navigation-icon">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.5 4.45834C11.2844 4.45834 10.1186 4.94123 9.2591 5.80077C8.39956 6.66031 7.91667 7.8261 7.91667 9.04168C7.91667 10.7454 9.07786 12.5629 10.3939 14.0434C11.0343 14.7639 11.6771 15.3667 12.1606 15.7897C12.2857 15.8992 12.3998 15.9964 12.5 16.0801C12.6002 15.9964 12.7143 15.8992 12.8395 15.7897C13.3229 15.3667 13.9657 14.7639 14.6061 14.0434C15.9222 12.5629 17.0833 10.7454 17.0833 9.04168C17.0833 7.8261 16.6005 6.66031 15.7409 5.80077C14.8814 4.94123 13.7156 4.45834 12.5 4.45834ZM12.5 17.0417C12.05 17.6417 12.0497 17.6414 12.0497 17.6414L12.0479 17.6401L12.0439 17.637L12.0301 17.6266C12.0184 17.6177 12.0019 17.605 11.9807 17.5886C11.9383 17.5558 11.8776 17.5081 11.801 17.4466C11.648 17.3237 11.4316 17.1451 11.1728 16.9186C10.6563 16.4666 9.96569 15.8195 9.27278 15.04C7.92215 13.5205 6.41667 11.3379 6.41667 9.04168C6.41667 7.42828 7.05759 5.88096 8.19844 4.74011C9.33929 3.59926 10.8866 2.95834 12.5 2.95834C14.1134 2.95834 15.6607 3.59926 16.8016 4.74011C17.9424 5.88096 18.5833 7.42828 18.5833 9.04168C18.5833 11.3379 17.0779 13.5205 15.7272 15.0399C15.0343 15.8195 14.3437 16.4666 13.8272 16.9186C13.5684 17.1451 13.352 17.3237 13.199 17.4466C13.1224 17.5081 13.0617 17.5558 13.0193 17.5886C12.9982 17.605 12.9816 17.6177 12.9699 17.6266L12.9561 17.637L12.9521 17.6401L12.9508 17.6411C12.9508 17.6411 12.95 17.6417 12.5 17.0417ZM12.5 17.0417L12.95 17.6417L12.5 17.9792L12.0497 17.6414L12.5 17.0417Z"
            fill="#2660F5"
          />
          <path
            d="M12.5 10.375C13.1904 10.375 13.75 9.81537 13.75 9.12501C13.75 8.43466 13.1904 7.87501 12.5 7.87501C11.8097 7.87501 11.25 8.43466 11.25 9.12501C11.25 9.81537 11.8097 10.375 12.5 10.375Z"
            fill="#2660F5"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.0979 15.9778C5.16802 15.6273 5.47583 15.3749 5.83334 15.3749H7.50001V16.8749H6.44819L5.91486 19.5416H19.0852L18.5518 16.8749H17.5V15.3749H19.1667C19.5242 15.3749 19.832 15.6273 19.9021 15.9778L20.7354 20.1445C20.7795 20.3648 20.7225 20.5933 20.58 20.7671C20.4376 20.9409 20.2247 21.0416 20 21.0416H5.00001C4.77531 21.0416 4.56245 20.9409 4.42 20.7671C4.27755 20.5933 4.2205 20.3648 4.26457 20.1445L5.0979 15.9778Z"
            fill="#2660F5"
          />
        </svg>
        <div class="gs-hotel-details__navigation-icon-text">
          {{ "地图/周边" }}
        </div>
      </div>
    </div>
    <div
      v-if="
        Array.isArray(payloadData.booking.tabItem) &&
        payloadData.booking.tabItem.length > 0
      "
      class="gs-hotel-details__gap-line"
    />
    <Reservation
      v-if="
        Array.isArray(payloadData.booking.tabItem) &&
        payloadData.booking.tabItem.length > 0
      "
      :tabItem="payloadData.booking.tabItem"
      :tabContent="payloadData.booking.tabContent"
      :cpDetailsInfo="payloadData.cpDetailsInfo"
      :type="asyncPayload.type"
      :isHK="payloadData.isHK"
      :resourceId="payloadData.resourceId"
    />
  </div>
</template>

<script>
import format from "./format";
import { genHref } from "@lego";
import Header from "./components/Header";
import Reservation from "./components/Reservation";
const getScoreList = (...data) => {
  let result = [];
  data.forEach((item) => {
    if (item) {
      let _item = {};
      _item.isShow = true;
      let [num, cpName] = item.split(";");
      _item.num = num;
      _item.cpName = cpName;
      num && num !== "0.0" && result.push(_item);
    }
  });
  return result;
};
export default {
  name: "HotelDetails",
  components: {
    Header,
    Reservation,
  },
  props: {
    hitPayload: {
      type: Object,
      default: () => {},
    },
    payload: {
      type: [Object, Array, String],
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    q: {
      type: String,
      default: "",
    },
    tname: {
      type: String,
      default: "",
    },
  },
  computed: {
    asyncPayload() {
      return this.format(this.payload, { tname: this.tname });
    },
    payloadData() {
      return this.asyncPayload.data || {};
    },
    NavigationData() {
      let NavigationData = {};
      const { head } = this.asyncPayload.data,
        { name, url } = head,
        location = name[12];

      if (location) {
        NavigationData.isShow = true;
        NavigationData.location = location;
        NavigationData.district = name[6].split(";")[0];
        const { url: href, cpId } = url[1];
        NavigationData.href = href;
        NavigationData.cpId = cpId;
      } else {
        NavigationData.isShow = false;
      }
      return NavigationData;
    },
    scoreData() {
      const { name } = this.asyncPayload.data.head;
      let scoreData = {};
      if (!name[7] && !name[8] && !name[9] && !name[10]) {
        scoreData.isShow = false;
      } else {
        scoreData.isShow = true;
        scoreData.list = getScoreList(name[8], name[9], name[10]);
        scoreData.tagList = (name[7] && name[7].split(";").slice(0, 4)) || [];
      }
      return scoreData;
    },
  },
  data() {
    return { genHref };
  },
  methods: {
    format,
    getScoreNumCls(name) {
      if (name === "综合") {
        return `gs-hotel-details__score-items--cp-score-all lc1`;
      }
      return `gs-hotel-details__score-items--cp-score lc1`;
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-"; // 可配置的命名空间
@mixin flex-start {
  display: flex;
  justify-content: flex-start;
}
@include b(hotel-details) {
  @include e(gap-line) {
    height: 33px;
    background-color: rgba(0, 0, 0, 0.12);
    transform: scaleY(0.01);
    margin: -16.335px 0;
  }
  @include e(score) {
    margin-top: 14px;
    margin-bottom: 13.67px;
    @include e(score-box) {
      @include flex-start;
      @include e(score-items) {
        @include flex-start;
        margin-right: 24px;
        align-items: baseline;
        @include m(cp-name) {
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.55);
          margin-right: 6px;
        }
        @include m(cp-score) {
          font-size: 20px;
          line-height: 22px;
          color: #fd8326;
          font-weight: 500;
        }
        @include m(cp-score-all) {
          font-size: 16px;
          line-height: 22px;
          color: #fd8326;
          font-weight: 500;
        }
      }
    }
    @include e(score-tags) {
      @include flex-start;
      margin-top: 9px;
      @include m(tag) {
        font-size: 10px;
        line-height: 14px;
        color: rgba(0, 0, 0, 0.55);
        padding: 0 3px;
        margin-right: 6px;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 3px;
        flex-shrink: 0;
      }
    }
  }
  @include e(navigation) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 14px;
    margin-bottom: 13.67px;
    @include e(navigation-info) {
      margin-right: 14px;
      flex: 1;
      @include m(poi) {
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 2px;
      }
      @include m(location) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.3);
      }
    }
    @include e(navigation-icon) {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      @include e(navigation-icon-text) {
        flex-shrink: 0;
        font-size: 12px;
        line-height: 16px;
        color: #2660f5;
        margin-top: 4px;
        font-weight: 500;
      }
    }
  }
}
</style>