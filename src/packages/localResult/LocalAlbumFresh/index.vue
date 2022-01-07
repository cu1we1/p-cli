<template>
  <div class="medusa-sort-local-result-album-fresh" data-dark-exclude>
    <div
      :class="contentCls"
      id="album-fresh_card"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: 'albumFresh',
          card_position: index,
          card_type: 'local',
        })
      "
    >
      <MultiTitle
        cardKey="albumFresh"
        class="df aic jcsb"
        :title="title"
        :moreText="`${totalCount}`"
        :showMore="showMore"
        :dataHref="
          $utils.inject({
            h5: {
              url: `${ZEUS_URL}#/album?type=photoFresh&q=${q}&tagId=-1`,
              title: `${q}`,
              mode: 'page',
              judgeNet: false,
            },
          })
        "
        :dataLog="
          $utils.inject({
            resource_id: `album_fresh_more`,
            resource_position: 1,
            resource_name: '更多',
            resource_source: 0,
            resource_url: `${ZEUS_URL}#/album?type=photoFresh&q=${q}&tag=全部结果`,
          })
        "
      />
      <div
        v-if="pics.length > 0"
        :class="`medusa-sort-local-result-album-fresh__content medusa-sort-local-result-album-fresh__content--${
          pics.length > 4 ? 'double' : 'single'
        } df jcsb acsb`"
        id="album_photo"
      >
        <div
          v-for="(item, i) in pics"
          :key="i"
          class="medusa-sort-local-result-album-fresh__pic-item"
          :id="`album_item_${i + 1}`"
          data-href=""
          data-exp="0"
          :data-log="
            $utils.inject({
              resource_name: (item.url || '').split('/').pop(),
              resource_position: i + 1,
              resource_type: 'albumfresh',
              resource_source: -1,
            })
          "
          @click="
            () =>
              debounce(
                launchPhotoEditPage(item.intentExtra.id, ids, item.type),
                500
              )
          "
        >
          <Pic
            class="medusa-sort-local-result-album-fresh__img"
            perfType="local"
            :src="item.url || ''"
            :radius="0"
          />
          <div
            v-if="item.type === 'type_video' && item.duration"
            class="medusa-sort-local-result-album-fresh__video-time"
          >
            {{ item.duration }}
          </div>
        </div>
        <div
          v-for="(item, index) in placeHolder"
          :key="index"
          class="medusa-sort-local-result-album-fresh__content--place-holder"
        ></div>
      </div>
    </div>
    <div
      v-if="labelsList && labelsList.length > 1"
      class="
        medusa-sort-local-result-album-fresh__labels-box
        bg_cardFill
        df
        jcfs
        aic
      "
    >
      <div
        class="
          medusa-sort-local-result-album-fresh__labels-title
          cl_ldark
          fw_normal
        "
      >
        分类
      </div>
      <Scroller direction="horizontal">
        <div
          @touchmove.stop
          v-for="(label, labelIdx) in labelsList"
          :data-log="
            $utils.inject({
              resource_id: `${label.name}-${label.id}`,
              resource_position: labelIdx + 1,
              resource_type: 'button',
              resource_url: `${ZEUS_URL}#/album?type=photoFresh&q=${q}&tagId=${label.id}`,
              resource_source: 0,
            })
          "
          :data-href="
            $utils.inject({
              h5: {
                url: `${ZEUS_URL}#/album?type=photoFresh&q=${q}&tagId=${label.id}`,
                title: `${q}`,
                mode: 'page',
                judgeNet: false,
              },
            })
          "
          v-feedback
          :key="labelIdx"
          class="
            medusa-sort-local-result-album-fresh__label
            cl_darker
            bg_fill_s
          "
        >
          {{ getLabelText(label) }}
        </div>
      </Scroller>
    </div>
    <div
      v-else
      class="medusa-sort-local-result-album-fresh__labels-box--place-holder"
    />
  </div>
</template>

<script>
import { MultiTitle, Scroller, Pic } from "@components";
import { ZEUS_URL } from "@lego";
import { localStorage, debounce, launchPhotoEditPage } from "@lego";

export default {
  props: ["title", "q", "list", "index"],
  components: {
    MultiTitle,
    Scroller,
    Pic,
  },
  data() {
    const pics = [];
    const ids = [];
    let labelsList = [];
    let totalCount = 0;
    this.list.forEach((item) => {
      if (item.type === "type_album" && item.intentExtra) {
        labelsList = JSON.parse(item.intentExtra.tags || null) || [];
        totalCount = item.intentExtra.totalCount;
      } else {
        const { intentExtra } = item;
        ids.push(intentExtra.id);
        pics.push(item);
      }
    });
    return {
      pics,
      ids,
      ZEUS_URL,
      labelsList,
      totalCount,
      showMore: totalCount > 8 || labelsList.length > 1,
    };
  },
  computed: {
    placeHolder() {
      const len = this.pics.length;
      switch (len) {
        case 1:
        case 2:
        case 3:
          return new Array(4 - len);
        case 5:
        case 6:
        case 7:
          return new Array(8 - len);
        default:
          return [];
      }
    },
    contentCls() {
      if (!(this.labelsList && this.labelsList.length > 1)) {
        return `medusa-sort-local-result-album-fresh__content-box bg_cardFill medusa-sort-local-result-album-fresh__content-box--border`;
      }
      return `medusa-sort-local-result-album-fresh__content-box bg_cardFill`;
    },
  },
  methods: {
    debounce,
    launchPhotoEditPage,
    getLabelText(label) {
      const { name, count } = label;
      return `${name}（${count}）`;
    },
    getRID(str) {
      if (!str) return "";
      const reg = /(?<=search_result_type=)(.*?)(?=(&|$))/g;
      const resultArr = str.match(reg);
      return Array.isArray(resultArr) ? resultArr[0] : "";
    },
    setEm(str) {
      if (!str) return "";
      const itemArr = [];
      [...str].forEach((item) => {
        if (item === this.q) {
          itemArr.push({
            item,
            isRed: true,
          });
        } else {
          itemArr.push({
            item,
            isRed: false,
          });
        }
      });
      return itemArr;
    },
    setTag: function (tag) {
      localStorage.setItem("albumTag", tag);
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-sort-local-result-"; // 可配置的命名空间
@include b(album-fresh) {
  @include e(content-box) {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    margin: 0px 10px 0 10px;
    padding: 10px 14px 18px 14px;
    @include m(border) {
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    @include e(content) {
      flex-flow: row wrap;
      box-sizing: border-box;
      border-radius: 7px;
      overflow: hidden;
      width: 86.8vw;
      @include m(double) {
        height: 43.1vw;
      }
      @include m(single) {
        height: 21.3;
      }
      @include e(pic-item) {
        position: relative;
        @include e(img) {
          width: 21.3vw !important;
          height: 21.3vw !important;
        }
        @include e(video-time) {
          height: 16px;
          bottom: 4px;
          left: 4px;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.55);
          font-size: 10px;
          color: #fff;
          border-radius: 2px;
          line-height: 14px;
          padding: 1px 7px;
          box-sizing: border-box;
        }
      }
      @include m(place-holder) {
        width: 21.3vw;
        height: 21.3vw;
      }
    }
  }
  @include e(labels-box) {
    border-radius: 0 0 12px 12px;
    margin: 0px 10px 10px 10px;
    padding: 0 0 18px 14px;
    @include m(place-holder) {
      margin: 0px 10px 10px 10px;
    }
    @include e(labels-title) {
      flex-shrink: 0;
      font-size: 12px;
      line-height: 16px;
      margin-right: 10px;
    }
    @include e(label) {
      box-sizing: border-box;
      height: 32px;
      padding: 8px 16px;
      border-radius: 16px;
      font-size: 12px;
      line-height: 16px;
      max-width: 200px;
      min-width: 60px;
      flex-shrink: 0;
      margin-right: 8px;
    }
  }
}
</style>
