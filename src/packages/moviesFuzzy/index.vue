<template>
  <div class="card_box">
    <CardTitleFooter
      :cardLog="
        $utils.inject({
          card_id: 'moviesFuzzy',
          card_position: 1,
        })
      "
      title="热映电影"
      :newFooterData="newFooterData"
    >
      <div class="medusa-movies-fuzzy">
        <div
          class="medusa-movies-fuzzy__item"
          v-for="(item, index) in movies"
          :key="item.poster"
          :data-href="$utils.inject(item.movieDetailsHref)"
          data-exp="0"
          :data-log="
            $utils.inject({
              resource_id: item.id,
              resource_name: item.showName,
              resource_position: `2-${index + 1}`,
            })
          "
        >
          <Pic
            :src="item.poster"
            class="medusa-movies-fuzzy__pic"
            style="width: 25.56vw; height: 34.44vw"
            :radius="7"
          >
            <template>
              <div class="medusa-movies-fuzzy__hint-box">
                <div
                  class="
                    medusa-movies-fuzzy__hint medusa-movies-fuzzy__hint--remark
                  "
                  v-if="item.remark"
                >
                  {{ item.remark }}
                </div>
                <div
                  class="
                    medusa-movies-fuzzy__hint
                    medusa-movies-fuzzy__hint--want-count
                  "
                  v-else-if="item.wantCount"
                >
                  {{ item.wantCount }}
                </div>
              </div>
            </template>
          </Pic>
          <h4 class="medusa-movies-fuzzy__name">
            {{ item.showName }}
          </h4>
          <div
            class="medusa-movies-fuzzy__get-ticket"
            :data-href="$utils.inject(item.buyTicketsHref)"
            :data-log="
              $utils.inject({
                control_id: item.id,
                control_type: 'button',
                control_name: `${
                  item.soldType === 'PRE' ? '预售' : '特惠购票'
                }`,
                control_position: `2-${index + 1}`,
              })
            "
          >
            {{ item.soldType === "PRE" ? "预售" : "特惠购票" }}
          </div>
        </div>
      </div>
    </CardTitleFooter>
  </div>
</template>
<script>
import { CardTitleFooter, Pic } from "@components";
import format from "./format";
export default {
  name: "moviesFuzzy",
  components: {
    CardTitleFooter,
    Pic,
  },
  props: ["tname", "payload", "q"],
  data() {
    return {};
  },
  computed: {
    // 根据entry统一传入的数据进行数据处理
    asyncPayload() {
      return format(this.payload, this);
    },
    newFooterData() {
      const { inject } = this.$utils,
        { asyncPayload } = this;
      return {
        log: inject({
          resource_id: asyncPayload.itemId,
          resource_name: "淘票票",
          resource_position: 3,
          control_name: "查看更多",
        }),
        text: "淘票票",
        moreText: " ",
        iconUrl: require("../../img/icon_taopiaopiao@3x.png"),
        href: inject(asyncPayload.viewMoreHref),
      };
    },
    movies() {
      return this.asyncPayload.movies.slice(0, 3);
    },
  },
};
</script>
<style lang="scss">
$namespace: "medusa-";

@include b(movies-fuzzy) {
  margin-top: 10px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  @include e(item) {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: none;
    width: 25.56vw;
  }
  @include e(pic) {
    margin-bottom: 8px;
    position: relative;
    flex: none;
  }
  @include e(hint-box) {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 36px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
  @include e(hint) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    position: absolute;
    bottom: 6px;
    left: 8px;
    right: 8px;
    font-size: 12px;
    text-align: left;
    color: #ffbb0e;
    font-weight: 600;
    @include m(want-count) {
      &::after {
        font-size: 9px;
        color: white;
        content: "人想看";
      }
    }
    @include m(remark) {
      &::after {
        font-size: 9px;
        content: "分";
      }
    }
  }
  @include e(text-icon) {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 26px;
    height: 14px;
    font-size: 10px;
    color: white;
    line-height: 14px;
    height: 14px;
    padding: 0 3px;
    border-radius: 3px;
    @include m(finish) {
      background: #2660f5;
    }
    @include m(serial) {
      background: #ffbb0e;
    }
  }
  @include e(name) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    margin: 0;
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  @include e(get-ticket) {
    font-size: 12px;
    line-height: 1;
    color: white;
    padding: 8px 12px;
    background: #2660f5;
    border-radius: 14px;
  }
}
</style>
