<template>
  <CardTitleFooter
    :cardLog="$utils.inject({ card_id: 'head', card_position: cardindex })"
    title="热映电影"
    :newFooterData="newFooterData"
    :isFooter="!!data.viewMoreHref"
  >
    <div
      class="medusa-movie-head-card__content"
      v-if="data.headInfo"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: data.headInfo.detailItemId,
          resource_name: data.headInfo.showName,
          resource_position: 1,
        })
      "
      :data-href="$utils.inject(data.headInfo.viewMoreHref)"
    >
      <Pic
        :src="data.headInfo.poster"
        class="medusa-movie-head-card__pic"
        :radius="7"
      >
        <div class="medusa-movie-head-card__score-box">
          <div class="medusa-movie-head-card__score">
            <span>{{ data.headInfo.remark }}</span>
          </div>
        </div>
      </Pic>
      <div class="medusa-movie-head-card__info">
        <h4
          class="medusa-movie-head-card__title"
          v-html="highLightApp(data.headInfo.showName, q, 1, 26)"
        ></h4>
        <p class="medusa-movie-head-card__time">
          <span>{{ movieInfo.openTime }}</span
          ><span class="medusa-movie-head-card__movieType">{{
            movieInfo.movieType
          }}</span>
        </p>
        <p class="medusa-movie-head-card__director">
          {{ personnelInfo.director }}
        </p>
        <p class="medusa-movie-head-card__performer">
          {{ personnelInfo.performer }}
        </p>
        <div
          class="medusa-movie-head-card__ticket-info"
          v-if="movieInfo.price && movieInfo.soldType"
        >
          <div
            class="medusa-movie-head-card__get-ticket"
            :data-log="
              $utils.inject({
                control_type: 'button',
                control_name: movieInfo.ticketButton,
                control_position: 2,
              })
            "
            :data-href="$utils.inject(data.headInfo.buyHref)"
            theme="info"
          >
            {{ movieInfo.ticketButton }}
          </div>
          <div class="medusa-movie-head-card__ticket-price">
            <span>{{ movieInfo.price }}</span>
          </div>
        </div>
      </div>
    </div>
  </CardTitleFooter>
</template>

<script>
import { CardTitleFooter, Pic } from "@components";
import { highLightApp } from "@lego";
export default {
  components: { CardTitleFooter, Pic },
  name: "HeadCard",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    tname: {
      type: String,
      default: "",
    },
    q: {
      type: String,
      default: "",
    },
    cardindex: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    highLightApp,
  },
  computed: {
    newFooterData() {
      const { inject } = this.$utils;
      return {
        log: inject({
          resource_name: "淘票票",
          resource_position: 4,
          control_name: "查看更多",
        }),
        text: "淘票票",
        moreText: " ",
        iconUrl: require("../../../img/icon_taopiaopiao@3x.png"),
        href: inject(this.data.viewMoreHref),
      };
    },
    movieInfo() {
      let { headInfo } = this.data,
        { minSeatPrice, movieType, soldType } = headInfo,
        price;
      if (Number.isNaN(Number(minSeatPrice))) {
        price = minSeatPrice;
      } else {
        price = Number(minSeatPrice.toString()).toFixed(1);
      }
      return {
        openTime: `${headInfo.openTime.split(" ")[0]} 上映`,
        movieType: ` ${movieType.replace(/,/g, " ")}`,
        price,
        soldType,
        ticketButton: soldType === "PRE" ? "预售" : "特惠购票",
      };
    },
    personnelInfo() {
      let director = "主演：",
        performer = "导演：",
        _name;
      this.data.actorsList.forEach((item, idx) => {
        _name = item.name;
        if (idx == 0) {
          director += _name;
        } else if (_name) {
          performer += _name + " ";
        }
      });
      return {
        director,
        performer,
      };
    },
  },
};
</script>

<style lang="scss">
$namespace: "medusa-movie-";
@include b(head-card) {
  @include e(content) {
    margin-bottom: 14px;
    display: flex;
  }
  @include e(pic) {
    flex: none;
    width: 92px !important;
    height: 124px !important;
  }
  @include e(score-box) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 36px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
  @include e(score) {
    position: absolute;
    bottom: 6px;
    left: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #ffbb0e;
    &::after {
      font-size: 10px;
      content: "分";
    }
  }
  @include e(info) {
    margin-left: 14px;
  }
  @include e(title) {
    margin: 0;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 21px;
  }
  @include e(time) {
    margin-bottom: 3px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 16px;
  }
  @include e(movieType) {
    margin-left: 14px;
  }
  @include e(director) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    margin-bottom: 3px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 16px;
  }
  @include e(performer) {
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 16px;
  }
  @include e(ticket-info) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row-reverse;
  }
  @include e(ticket-price) {
    &::before {
      content: "￥";
    }
    font-size: 16px;
    color: red;
    &::after {
      font-size: 10px;
      content: "起";
    }
  }
  @include e(get-ticket) {
    font-size: 12px;
    color: white;
    line-height: 1;
    padding: 8px 12px;
    background: #2660f5;
    border-radius: 14px;
  }
}
</style>
