<template>
  <div :class="`gs-hotel-item gs-hotel-item--box${index}`">
    <Pic :src="imgSrc" class="gs-hotel-item__image" :radius="7" />
    <div class="gs-hotel-item__info">
      <div class="lc2" :style="`lineHeight: 0;`">
        <div class="gs-hotel-item__hotel-name">
          {{ pageData.name }}
        </div>
        <div
          v-if="pageData.type || pageData.commentNum"
          class="gs-hotel-item__hotel-type"
        >
          {{ getHotelTypeAndCommons(pageData.type, pageData.commentNum) }}
        </div>
      </div>
      <div class="gs-hotel-item__hotel-score">
        <template v-for="item in scoreList">
          <div
            class="gs-hotel-item__hotel-score--wrapper"
            :key="item.cpName"
            v-if="!item.isHide"
          >
            <div class="lc1 gs-hotel-item__hotel-score--name">
              {{ item.cpName }}
            </div>
            <div :class="getScoreNumCls(item.cpName)">
              {{ item.score }}
            </div>
          </div>
        </template>
      </div>
      <div class="gs-hotel-item__tags-box">
        <template v-for="item in pageData.tagStr.split(';').slice(0, 3)">
          <div
            class="gs-hotel-item__tags-box--name lc1"
            :key="item"
            v-if="item"
          >
            {{ item }}
          </div>
        </template>
      </div>
      <div
        class="gs-hotel-item__location"
        v-if="pageData.distanceInfo || pageData.poiStr"
      >
        {{ getHotelLocationInfo(pageData.distanceInfo, pageData.poiStr) }}
      </div>
      <div class="gs-hotel-item__price-info" v-if="Number(pageData.minPrice)">
        <div class="gs-hotel-item__price-info--price lc1">
          {{ getHotelPriceInfo(pageData.minPrice) }}
        </div>
        <div class="gs-hotel-item__price-info--under-line lc1">起</div>
        <div v-if="type === 'foreign' || pageData.isHK === '1'">
          <div
            class="lc1 gs-hotel-item__price-info--tax"
            v-if="pageData.tax && pageData.tax > 0"
          >
            {{ `（另需付税/费${pageData.tax}）` }}
          </div>
          <div class="gs-hotel-item__price-info--tax lc1" v-else>
            {{ `（已含税）` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
function ScoreItem(scoreData) {
  const [score, cpName] = scoreData.split(";"),
    isHide = (cpName !== "综合" && !Number(score)) || !score || !cpName;
  return {
    isHide,
    score,
    cpName,
  };
}
export default {
  name: "HotelItem",
  props: {
    content: {
      type: Array,
      default: () => [],
    },
    pic: {
      type: [String, Array],
      default: "",
    },
    type: {
      type: String,
      defualt: "",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  components: {
    Pic,
  },
  computed: {
    pageData() {
      const [
        name,
        enName,
        type,
        scoreXC,
        scoreTC,
        scoreAll,
        commentNum,
        distanceInfo,
        poiInfo,
        tagStr,
        priceInfo,
        ,
        ,
        saleStaus,
        isHK,
      ] = this.content;
      const [minPrice, tax] = priceInfo.split(";");
      const poiStr = poiInfo.split(";")[0];
      return {
        name,
        enName,
        type,
        scoreXC,
        scoreTC,
        scoreAll,
        commentNum,
        distanceInfo,
        poiInfo,
        tagStr,
        priceInfo,
        saleStaus,
        isHK,
        minPrice,
        tax,
        poiStr,
      };
    },
    imgSrc() {
      return Array.isArray(this.pic) ? this.pic[0] : this.pic;
    },
    scoreList() {
      const { pageData } = this;
      return pageData
        ? [
            ScoreItem(pageData.scoreXC),
            ScoreItem(pageData.scoreTC),
            ScoreItem(pageData.scoreAll),
          ]
        : [];
    },
  },
  methods: {
    getHotelTypeAndCommons(type, num) {
      if (type && num) {
        return `${type} | ${num}评论`;
      } else {
        return type || `${num}评论`;
      }
    },
    getHotelLocationInfo(distance, poi) {
      if (this.type === "domestic") {
        if (distance && poi) {
          return `${distance} | 位于${poi}`;
        } else {
          return distance || `位于${poi}`;
        }
      } else {
        return `位于${poi}`;
      }
    },
    getHotelPriceInfo(price) {
      return `￥${price}`;
    },
    getScoreNumCls(name) {
      if (name === "综合") {
        return `lc1 gs-hotel-item__hotel-score--num-all`;
      }
      return `lc1 gs-hotel-item__hotel-score--num`;
    },
  },
};
</script>

<style scoped lang="scss">
$namespace: "gs-"; // 可配置的命名空间
@mixin flex-single {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
@include b(hotel-item) {
  @include flex-single;
  align-items: flex-start;
  @include m(box1) {
    margin-bottom: 15px;
    margin-top: 10px;
  }

  @include m(box2) {
    margin-bottom: 15px;
  }
  @include m(box3) {
    margin-bottom: 1px;
  }
  @include e(image) {
    width: 25.56vw;
    height: 34.45vw;
    margin-right: 14px;
    &:after {
      border-radius: 21px;
    }
  }
  @include e(info) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 35.83vw;
    @include e(hotel-name) {
      font-size: 16px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 700;
      display: inline;
    }
    @include e(hotel-type) {
      display: inline-block;
      font-size: 10px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.3);
      margin-top: 4px;
    }
    @include e(hotel-score) {
      margin-top: 6px;
      @include flex-single;
      @include m(wrapper) {
        @include flex-single;
      }
      @include m(name) {
        flex-shrink: 0;
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.55);
        margin-right: 1.111vw;
      }
      @include m(num) {
        flex-shrink: 0;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
        color: rgba(253, 131, 38, 1);
        margin-right: 3.88vw;
      }
      @include m(num-all) {
        flex-shrink: 0;
        font-size: 13px;
        line-height: 16px;
        font-weight: 700;
        color: rgba(253, 131, 38, 1);
        margin-right: 3.88vw;
      }
    }
    @include e(tags-box) {
      margin-top: 3px;
      @include flex-single;
      @include m(name) {
        font-size: 10px;
        line-height: 14px;
        color: rgba(0, 0, 0, 0.55);
        padding: 0 3px;
        background-color: rgba(0, 0, 0, 0.05);
        flex-shrink: 0;
        margin-right: 1.666vw;
        border-radius: 3px;
      }
    }
    @include e(location) {
      margin-top: 4px;
      font-size: 10px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.3);
    }
    @include e(price-info) {
      margin-top: 8px;
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
      @include m(under-line) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(236, 62, 80, 1);
        margin-left: 4px;
      }
      @include m(price) {
        font-size: 16px;
        line-height: 21px;
        color: rgba(236, 62, 80, 1);
        font-weight: 500;
      }
      @include m(tax) {
        font-size: 12px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.3);
        margin-left: 2px;
      }
    }
  }
}
</style>