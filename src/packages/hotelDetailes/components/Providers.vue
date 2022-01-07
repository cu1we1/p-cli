<template>
  <div class="gs-hotel-details-provider-list">
    <div
      v-for="item in renderList"
      :key="item.cpId"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: item.resourceId,
          resource_name: item.priceInfo,
          resource_provider: item.cpId,
          resource_source: 1,
          resource_position: 6,
        })
      "
      class="gs-hotel-details-provider-list__items-box"
      :style="`padding: ${item.discountInfo ? '5px' : '10px'} 0;`"
      :data-href="$utils.inject(genHref({ fastappUrl: item.href }))"
    >
      <div class="gs-hotel-details-provider-list__cp-info">
        <Pic
          :src="item.logo"
          class="gs-hotel-details-provider-list__cp-info--icon"
          :radius="13"
        />
        <div class="gs-hotel-details-provider-list__cp-info-text">
          <div class="gs-hotel-details-provider-list__cp-info--name lc1">
            {{ item.cpName }}
          </div>
          <div
            class="gs-hotel-details-provider-list__cp-info-text--discount-info"
            v-if="item.discountInfo"
          >
            <div class="gs-hotel-details-provider-list__cp-info-text--text lc1">
              {{ item.discountInfo }}
            </div>
            <Pic
              v-if="item.discountPic"
              :src="item.discountPic"
              class="
                gs-hotel-details-provider-list__cp-info-text--discount-icon
              "
            />
          </div>
        </div>
      </div>
      <div class="gs-hotel-details-provider-list__order-info lc1">
        <div
          class="gs-hotel-details-provider-list__price-info"
          v-if="item.hasPrice && item.priceInfo && item.priceInfo > 0"
        >
          <div class="gs-hotel-details-provider-list__price-info--price lc1">
            {{ `￥${item.priceInfo}` }}
          </div>
          <div class="gs-hotel-details-provider-list__price-info--desc">
            {{ "起" }}
          </div>
        </div>
        <div
          v-else
          class="
            gs-hotel-details-provider-list__price-info
            gs-hotel-details-provider-list__price-info--price
            lc1
          "
          :class="item.priceInfo === '暂无可售' ? 'fontCR' : 'fontCR'"
        >
          {{ item.priceInfo }}
        </div>
        <div v-feedback class="gs-hotel-details-provider-list__button">
          查看房型
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
import { genHref } from "@lego";
export default {
  name: "HoetelDetailsProviders",
  components: { Pic },
  props: {
    pageData: {
      type: Array,
      default: () => [],
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    renderList() {
      const { isError } = this,
        renderList = [];
      this.pageData.forEach((item) => {
        const {
          discountInfo,
          logo,
          discountPic,
          cpName,
          url,
          cpId,
          resourceId,
          priceInfo,
        } = item;
        const { url: href } = url[0] || {};
        if (cpName && cpId && url && logo) {
          const hasPrice = !(
            priceInfo === "暂无报价" ||
            priceInfo === "已满房" ||
            priceInfo === "暂无可售"
          );
          let _item = {
            discountInfo,
            logo,
            discountPic,
            cpName,
            href,
            cpId,
            resourceId,
            priceInfo: isError ? "暂无报价" : priceInfo,
            hasPrice,
          };
          renderList.push(_item);
        }
      });
      return renderList;
    },
  },
  methods: {
    genHref,
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-hotel-details-"; // 可配置的命名空间
@include b(provider-list) {
  @include e(items-box) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include e(cp-info) {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include m(icon) {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
      @include e(cp-info-text) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-right: 12px;
        @include m(name) {
          font-size: 14px;
          line-height: 20px;
          color: rgba(0, 0, 0, 0.85);
        }
        @include m(discount-info) {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        @include m(text) {
          font-size: 10px;
          line-height: 14px;
          color: #fd8326;
          margin-right: 6px;
        }
        @include m(discount-icon) {
          width: 14px;
          height: 14px;
        }
      }
      @include m(name) {
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    @include e(order-info) {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      @include e(price-info) {
        flex-shrink: 0;
        display: flex;
        align-items: baseline;
        justify-content: flex-start;
        margin-right: 12px;
        @include m(price) {
          font-size: 16px;
          line-height: 21px;
          color: rgba(0, 0, 0, 0.85);
        }
        @include m(desc) {
          font-size: 12px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.55);
          margin-left: 4px;
        }
      }
      @include e(button) {
        flex-shrink: 0;
        width: 20vw;
        height: 24px;
        background-color: #2660f5;
        border-radius: 12px;
        padding: 0 12px;
        font-size: 12px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        box-sizing: border-box;
      }
    }
  }
}
.fontCR {
  color: #ff6436;
}
</style>
