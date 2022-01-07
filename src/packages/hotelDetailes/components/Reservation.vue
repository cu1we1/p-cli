<template>
  <div class="gs-hotel-details-reservation">
    <div class="gs-hotel-details-reservation__header-info">
      <div class="gs-hotel-details-reservation__header-text-info">
        <div class="gs-hotel-details-reservation__header-text-info--title lc1">
          {{ "酒店预订" }}
        </div>
        <div class="gs-hotel-details-reservation__header-slogan-info">
          <color-popper show-arrow placement="top" :offset="[100, 10]">
            <template v-slot:reference>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.2 3.42385C3.34129 3.42385 1.02385 5.74129 1.02385 8.59999C1.02385 11.4587 3.34129 13.7761 6.2 13.7761C9.05871 13.7761 11.3761 11.4587 11.3761 8.59999C11.3761 5.74129 9.05871 3.42385 6.2 3.42385ZM0 8.59999C0 5.17583 2.77583 2.39999 6.2 2.39999C9.62417 2.39999 12.4 5.17583 12.4 8.59999C12.4 12.0242 9.62417 14.8 6.2 14.8C2.77583 14.8 0 12.0242 0 8.59999ZM5.68804 11.4434V8.03053H6.7119V11.4434H5.68804ZM6.91128 6.60991C6.91128 7.00259 6.59295 7.32092 6.20027 7.32092C5.80759 7.32092 5.48926 7.00259 5.48926 6.60991C5.48926 6.21723 5.80759 5.8989 6.20027 5.8989C6.59295 5.8989 6.91128 6.21723 6.91128 6.60991Z"
                  :fill="$utils.isDark ? 'white' : 'black'"
                  fill-opacity="0.3"
                />
              </svg>
            </template>
            <div
              class="
                gs-hotel-details-reservation__header-slogan-info--popper-info
              "
            >
              {{ info }}
            </div>
          </color-popper>
          <div
            class="gs-hotel-details-reservation__header-slogan-info--slogan lc1"
          >
            {{ "酒店价格仅供参考，以订单页为准" }}
          </div>
        </div>
      </div>
      <div
        v-if="minPrice"
        class="gs-hotel-details-reservation__header-price-info"
      >
        <div class="gs-hotel-details-reservation__header-price-box">
          <div class="gs-hotel-details-reservation__header-price-box--price">
            {{ `￥${minPrice}` }}
          </div>
          <div class="gs-hotel-details-reservation__header-price-box--desc">
            {{ "起" }}
          </div>
        </div>
        <div
          class="gs-hotel-details-reservation__header-tax"
          v-if="type === 'foreign' || isHK === '1'"
        >
          {{ "已含税" }}
        </div>
      </div>
    </div>
    <div class="gs-hotel-details-reservation__date-picker">
      <div
        class="gs-hotel-details-reservation__date-box"
        role="button"
        :data-log="
          $utils.inject({
            control_type: 'button',
            control_name: '入住日期',
            control_position: 3,
          })
        "
        data-href=""
        @click="openCalendar"
      >
        <div class="gs-hotel-details-reservation__date-box--state">
          {{ "入住" }}
        </div>
        <div class="gs-hotel-details-reservation__date-box--selected">
          {{ formatDate(checkIn) }}
        </div>
      </div>
      <div class="gs-hotel-details-reservation__date-picker--nights">
        {{ `共${nights}晚` }}
      </div>
      <div
        class="gs-hotel-details-reservation__date-box"
        data-href=""
        @click="openCalendar"
        :data-log="
          $utils.inject({
            control_type: 'button',
            control_name: '离店日期',
            control_position: 4,
          })
        "
      >
        <div class="gs-hotel-details-reservation__date-box--state">
          {{ "离店" }}
        </div>
        <div class="gs-hotel-details-reservation__date-box--selected">
          {{ formatDate(checkOut) }}
        </div>
      </div>
    </div>
    <HotelDatePick
      :activeKeys="[checkIn, checkOut]"
      :defaultDate="defaultDate"
      :range="[0, 180]"
      :isShow="showDatePicker"
      @getSelectDate="getSelectDate"
      @close="closeCalendar"
    />
    <div v-if="isLoading" />
    <Providers :pageData="providerData" :isError="isError" v-else />
  </div>
</template>

<script>
import Providers from "./Providers";
import HotelDatePick from "./Picker";
import { post, oreport } from "@lego";
import { HOTEL_API } from "@lego";
const formatTabItem = (data) => {
  if (!data) return null;
  const arr = [];
  data.forEach((item) => {
    const { content, jumpActions, pic, resourceId, cpId } = item;
    arr.push({
      cpName: content[0],
      discountInfo: content[1],
      priceInfo: content[2] ? content[2].split(";")[0] : "",
      logo: pic[0],
      discountPic: pic[1],
      url: jumpActions,
      resourceId,
      cpId,
    });
  });
  return arr;
};
export default {
  name: "HotelDetailsReservation",
  components: { Providers, HotelDatePick },
  props: {
    tabContent: {
      type: Array,
      default: () => [],
    },
    tabItem: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "",
    },
    isHK: {
      type: String,
      default: "",
    },
    resourceId: {
      type: [Number, String],
      default: "",
    },
    cpDetailsInfo: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    info() {
      const { cpDetailsInfo } = this;
      let cpNames = cpDetailsInfo
        .map((item) => {
          return item.cpName;
        })
        .toString();
      return `展示价格以及房间状态由第三方${cpNames}提供，仅供参考。由于价格以及房间状态实时变化，且与您是否登录等多种因素相关，所以请以最终订单提交页酒店价格以及房间状态为准。`;
    },
  },
  data(vm) {
    const { tabContent } = vm,
      [price, tax] = tabContent[2].split(";"),
      [, , , xcId, tcId] = tabContent;
    return {
      leftLimit: new Date().getTime() + 86400000,
      rightLimit: new Date().getTime() + 364 * 24 * 3600 * 1000,
      nights: 1,
      showDatePicker: false,
      checkIn: tabContent[0],
      checkOut: tabContent[1],
      defaultDate: tabContent[0],
      minPrice: price,
      xcId,
      tcId,
      tax,
      providerData: formatTabItem(vm.tabItem),
      isLoading: true,
      isError: false,
    };
  },
  methods: {
    openCalendar() {
      this.showDatePicker = true;
    },
    closeCalendar() {
      this.showDatePicker = false;
    },
    fetchLatestPriceInfo(checkInTime, checkOutTime, ctripId, elongId, type) {
      post(`${HOTEL_API}`, {
        params: {
          v: "1.0",
          f: "json",
          oversea: type === "domestic" ? 0 : 1,
          ctrip_id: ctripId,
          elong_id: elongId,
          check_in_date: checkInTime,
          check_out_date: checkOutTime,
        },
        timeout: 2000,
      })
        .then((data) => {
          const { code, cards } = data;
          if (code === 0 && Array.isArray(cards) && cards.length > 0) {
            const priceInfo = this.formatPriceInfo(cards);
            this.providerData = priceInfo;
            this.isLoading = false;
            this.isError = false;
          } else {
            this.isLoading = false;
            this.isError = true;
            this.$toast({
              text: "查询失败",
              duration: 3000,
            });
          }
        })
        .catch((error) => {
          oreport.reportError(new Error(`HotelDetails-Reservation-${error}`));
          this.isLoading = false;
          this.isError = true;
          this.$toast({
            text: "查询失败",
            duration: 3000,
          });
        });
    },
    formatPriceInfo(data) {
      if (!data) return null;
      const reg = new RegExp("^[0-9]*$");
      let minPrice;
      const arr = [];
      this.tabItem.forEach((item) => {
        const { content, jumpActions, pic, resourceId, cpId: nowCP } = item;
        let priceInfo = "";
        let taxInfo = "";
        data.forEach((it) => {
          const {
            cardContent,
            dataInfo: { cpId },
          } = it;
          if (cpId === nowCP && cardContent[0]) {
            const [, isFull] = cardContent;
            if (isFull === "已满房") {
              priceInfo = isFull;
            } else {
              const [priceInfomation] = cardContent;
              [priceInfo, taxInfo] = priceInfomation.split(";");
              if (priceInfo === "-1") {
                priceInfo = "暂无可售";
              } else if (priceInfo === "-2") {
                priceInfo = "暂无报价";
              }
            }
          }
        });
        if (priceInfo && reg.test(priceInfo)) {
          if (minPrice && minPrice > priceInfo) {
            minPrice = priceInfo;
          }
          if (!minPrice) {
            minPrice = priceInfo;
          }
          if (taxInfo) {
            this.tax = taxInfo;
          }
        }
        this.minPrice = minPrice;
        arr.push({
          cpName: content[0],
          discountInfo: content[1],
          priceInfo,
          logo: pic[0],
          discountPic: pic[1],
          url: jumpActions,
          resourceId,
          cpId: nowCP,
        });
      });
      return arr;
    },
    formatDate(data) {
      if (!data) return "";
      const arr = data.split("-");
      let month = arr[1];
      let day = arr[2];
      if (month.startsWith("0")) {
        month = month.slice(1);
      }
      if (day.startsWith("0")) {
        day = day.slice(1);
      }

      return `${month}月${day}日`;
    },
    getSelectDate(data) {
      const { selectedDate, totalDay } = data,
        checkIn = selectedDate[0],
        checkOut = selectedDate[1];
      this.checkIn = checkIn;
      this.checkOut = checkOut;
      this.nights = totalDay;
      this.isLoading = true;
      this.fetchLatestPriceInfo(checkIn, checkOut, this.xcId, this.tcId);
    },
  },
  mounted() {
    const { checkIn, checkOut, xcId, tcId, type } = this;
    this.fetchLatestPriceInfo(checkIn, checkOut, xcId, tcId, type);
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-hotel-details-"; // 可配置的命名空间
@include b(reservation) {
  margin-top: 14px;
  @include e(header-info) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    @include e(header-text-info) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      @include m(title) {
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
      @include e(header-slogan-info) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 2px;
        @include m(slogan) {
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.3);
        }
        @include m(popper-info) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.55);
          padding: 5px 4px;
          width: 62vw;
        }
      }
    }
    @include e(header-price-info) {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      flex-shrink: 0;
      @include e(header-price-box) {
        display: flex;
        align-items: baseline;
        justify-content: flex-start;
        @include m(price) {
          font-size: 16px;
          line-height: 20px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 700;
        }
        @include m(desc) {
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.55);
          margin-left: 4px;
        }
      }
      @include e(header-tax) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        margin-top: 2px;
      }
    }
  }
  @include e(date-picker) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 7px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 11px 12px 9px 12px;
    margin-bottom: 10px;
    @include e(date-box) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
      @include m(state) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        margin-right: 6px;
      }
      @include m(selected) {
        font-size: 14px;
        line-height: 20px;
        color: #2660f5;
        font-weight: 500;
      }
    }
    @include m(nights) {
      flex-shrink: 0;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.55);
    }
  }
  @include e(order) {
  }
}
</style>