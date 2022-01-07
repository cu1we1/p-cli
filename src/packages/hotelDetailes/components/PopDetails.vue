<template>
  <Panel
    :visible="visible"
    content="94.8vh"
    data-exp="0"
    :data-log="
      $utils.inject({
        exposure_type: 'card_in',
        card_name: '酒店简介',
      })
    "
    class="PopHotelDetails fc_normal"
  >
    <template #header>
      <div
        class="df PopHotelDetails__header pd_left-xxxl pd_right-xxxl"
        :style="{ backgroundColor: '#fff' }"
      >
        <div class="f1 pd_left-xxxl cl_darkest fs_l fw_medium ta_center">
          {{ pageData.tabName }}
        </div>
        <div
          class="PopHotelDetails_closeBtn"
          data-href=""
          :data-log="
            $utils.inject({
              control_type: 'button',
              control_name: '关闭',
              control_position: 1,
              control_id: 'close',
            })
          "
          :style="{ backgroundImage: `url(${closeBtnIcon})` }"
          data-sprop=""
          @click="closeWrapper"
        />
      </div>
    </template>
    <Scroller use-simulated-roll class="popHotelDatails__scroll">
      <div v-if="isShowTel">
        <div class="mi_bottom-xs fs_l cl_darkest fw_medium lc0">电话</div>
        <div
          data-href=""
          data-exp="0"
          data-sprop=""
          :data-log="
            $utils.inject({
              resource_name: phoneNumber[1],
              resource_position: 1,
            })
          "
        >
          <a :href="`tel:${phoneNumber[1]}`" class="cl_primary phoneNumber">
            {{ phoneNumber[1] }}
          </a>
        </div>
        <div class="gaps gapG" />
      </div>
      <div v-if="summary[1]">
        <div class="mi_bottom-xs fs_l cl_darkest fw_medium lc0">酒店简介</div>
        <div class="fs_s cl_normal lc0 fw_normal">
          {{ summary[1] }}
        </div>
        <div class="gaps gapG" />
      </div>
      <div v-if="checkInPolicy[1]">
        <div class="mi_bottom-xs cl_darkest fs_l fw_medium lc0">入住政策</div>
        <div
          class="fs_s fw_normal cl_normal lc0"
          :key="item"
          v-for="(item, idx) in checkInPolicy[1].split(',')"
        >
          {{ idx === 0 ? `入住时间:${item}以前` : `离店时间:${item}以后"` }}
        </div>
        <div class="gaps gapG" />
      </div>
      <div v-if="hasSerives">
        <div class="mi_bottom-xs cl_darkest lc_0 fw_medium fs_l">设施服务</div>
        <div class="services" v-if="internet[2]">
          <div
            class="servicesIcon"
            :style="{ backgroundImage: `url(${internetIcon})` }"
          />
          <div class="mi_bottom-m fs_l fw_medium cl_darkest lc0">
            {{ internet[1] }}
          </div>
          <div class="mi_bottom-l L_grid-conxs">
            <div
              class="
                L_grid-cell3 L_grid-cellxs
                lc1
                fs_s
                cl_normal
                fw_normal
                cells
              "
              v-for="item in internet[2].split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="services" v-if="frontService[2]">
          <div
            class="servicesIcon frontService"
            :style="{ backgroundImage: `url(${frontServiceIcon})` }"
          />
          <div class="mi_bottom-m fs_l cl_darkest fw_medium lc0">
            {{ frontService[1] }}
          </div>
          <div class="mi_bottom-l L_grid-conxs">
            <div
              class="
                L_grid-cell3 L_grid-cellxs
                lc1
                fs_s
                cl_normal
                fw_normal
                cells
              "
              v-for="item in frontService[2].split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="services" v-if="generalFacilities[2]">
          <div
            class="servicesIcon"
            :style="{
              backgroundImage: `url(${generalFacilitiesIcon})`,
            }"
          />
          <div class="mi_bottom-m fs_l cl_darkest fw_medium">
            {{ generalFacilities[1] }}
          </div>
          <div class="mi_bottom-l L_grid-conxs">
            <div
              class="
                L_grid-cell3 L_grid-cellxs
                lc1
                fs_s
                cl_normal
                fw_normal
                cells
              "
              v-for="item in generalFacilities[2].split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="services" v-if="food[2]">
          <div
            class="servicesIcon"
            :style="{ backgroundImage: `url(${foodIcon})` }"
          />
          <div class="mi_bottom-m fs_l fw_medium cl_darkest">
            {{ food[1] }}
          </div>
          <div class="mi_bottom-l L_grid-conxs">
            <div
              class="
                L_grid-cell3 L_grid-cellxs
                lc1
                fs_s
                cl_normal
                fw_normal
                cells
              "
              v-for="item in food[2].split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="services" v-if="traffic[2]">
          <div
            class="servicesIcon"
            :style="{ backgroundImage: `url(${trafficIcon})` }"
          />
          <div class="mi_bottom-m fs_l fw_medium cl_darkest lc0">
            {{ traffic[1] }}
          </div>
          <div class="mi_bottom-l L_grid-conxs">
            <div
              class="
                L_grid-cell3 L_grid-cellxs
                lc1
                fs_s
                cl_normal
                fw_normal
                cells
              "
              v-for="item in traffic[2].split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="services" v-if="entertainment[2]">
          <div
            class="servicesIcon"
            :style="{ backgroundImage: `url(${entertainmentIcon})` }"
          />
          <div class="mi_bottom-m fs_l fw_medium cl_darkest lc0">
            {{ entertainment[1] }}
          </div>
          <div class="mi_bottom-l L_grid-conxs">
            <div
              class="
                L_grid-cell3 L_grid-cellxs
                lc1
                fs_s
                cl_normal
                fw_normal
                cells
              "
              v-for="item in entertainment[2].split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </Scroller>
    <div
      v-if="Array.isArray(cpDetailsInfo) && cpDetailsInfo.length > 0"
      class="cpInfo aic fs_xs cl_light lc0 fw_normal"
      :style="{ backgroundColor: '#fff' }"
      data-href=""
      data-sprop=""
    >
      酒店详情由
      <div class="dib">
        &nbsp;
        <div
          v-for="(item, index) in cpDetailsInfo"
          :key="item.cpId"
          data-sprop=""
          :data-log="
            $utils.inject({
              resource_id: item.resourceId,
              resource_name: item.cpName,
              resource_provider: item.cpId,
              resource_position: index + 1,
              resource_source: 1,
            })
          "
          :data-href="$utils.inject(genHref({ fastappUrl: item.url }))"
          class="cl_primary dib"
        >
          {{ index === 0 ? item.cpName : `,${item.cpName}` }}
        </div>
        &nbsp;
      </div>
      提供
    </div>
  </Panel>
</template>

<script>
import { genHref } from "@lego";
import { Scroller, Panel } from "@components";
import hotelDetailes from "../hotelDetailesTheme";

const {
  closeBtn: closeBtnIcon,
  entertainment: entertainmentIcon,
  food: foodIcon,
  frontService: frontServiceIcon,
  generalFacilities: generalFacilitiesIcon,
  internet: internetIcon,
  traffic: trafficIcon,
} = hotelDetailes;

function InitData(tabItem) {
  let result = {};
  const [
    tellPhoneInfo,
    summaryInfo,
    checkInfo,
    internetInfo,
    frontServiceInfo,
    generalFacilitiesInfo,
    foodInfo,
    trafficInfo,
    entertainmentInfo,
  ] = tabItem;
  result.phoneNumber = (tellPhoneInfo && tellPhoneInfo.content) || [];
  result.summary = (summaryInfo && summaryInfo.content) || [];
  result.checkInPolicy = (checkInfo && checkInfo.content) || [];
  result.internet = (internetInfo && internetInfo.content) || [];
  result.frontService = (frontServiceInfo && frontServiceInfo.content) || [];
  result.generalFacilities =
    (generalFacilitiesInfo && generalFacilitiesInfo.content) || [];
  result.food = (foodInfo && foodInfo.content) || [];
  result.traffic = (trafficInfo && trafficInfo.content) || [];
  result.entertainment = (entertainmentInfo && entertainmentInfo.content) || [];

  let hasSerives = false;
  tabItem.some((item) => {
    const { content } = item;
    if (Array.isArray(content) && content.length > 1) {
      content.some((it) => {
        if (it === "设施服务") {
          hasSerives = true;
          return true;
        } else {
          return false;
        }
      });
    }
    return hasSerives;
  });

  result.hasSerives = hasSerives;
  return result;
}
export default {
  components: { Scroller, Panel },
  props: {
    pageData: {
      type: Object,
      default: () => {},
    },
    cpDetailsInfo: {
      type: Array,
      default: () => [],
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    pageData(val, oldVal) {
      if (val !== oldVal) {
        Object.assign(this, InitData(this.pageData.tabItem));
      }
    },
    visible() {
      if (this.visible !== this.isShow) {
        this.$emit("changeIsShow");
      }
    },
    isShow() {
      if (this.visible !== this.isShow) {
        this.visible = this.isShow;
      }
    },
  },
  computed: {
    isShowTel() {
      const reg = /^[0-9]+-?[0-9]+$/g;
      return reg.test(this.phoneNumber[1]);
    },
  },
  data() {
    return {
      genHref,
      closeBtnIcon,
      entertainmentIcon,
      foodIcon,
      // frontService,
      // generalFacilities,
      // internet,
      // traffic,
      generalFacilitiesIcon,
      frontServiceIcon,
      internetIcon,
      trafficIcon,
      visible: false,
      ...InitData(this.pageData.tabItem),
    };
  },
  methods: {
    closeWrapper() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.PopHotelDetails__header {
  padding-top: 30px;
  position: relative;
}
.gaps {
  margin: 16px 0 16px 0;
}
.popHotelDatails__scroll {
  height: 100%;
  padding: 0 24px 64px 24px;
  box-sizing: border-box;
  // overflow: hidden;
  overflow: scroll;
}
.PopHotelDetails_closeBtn {
  // position: absolute;
  // top: 16px;
  // right: 22px;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-size: contain;
}

.title {
  padding-top: 26px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.phoneNumber {
  font-size: 14px;
}

.services {
  position: relative;
  padding-left: 33px;
  margin-bottom: 14px;

  .cells {
    line-height: 23px;
  }
}

.servicesIcon {
  position: absolute;
  top: 0;
  left: 0px;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-size: contain;
}

.cpInfo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 41px;
  line-height: 41px;
  text-align: center;
}
.L_grid-conxs {
  margin: -5px -4px;
  display: flex;
  flex-flow: row wrap;
  box-sizing: border-box;
}
.L_grid-cell3 {
  box-sizing: border-box;
  width: 33.333333%;
}
</style>
