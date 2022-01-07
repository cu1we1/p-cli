<template>
  <div
    class="card_box medusa-sort-local-result-album"
    id="automated_album_card"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: 'album',
        card_position: index,
        card_type: 'local',
      })
    "
  >
    <MultiTitle
      :cardKey="key"
      class="df aic jcsb"
      :title="title"
      :showMore="folders.length > 2"
      :data-href="
        $utils.inject({
          h5: {
            url: `${ZEUS_URL}#/album?type=list&q=${q}`,
            title: `${q}`,
            mode: 'page',
            judgeNet: false,
          },
        })
      "
      :data-log="
        $utils.inject({
          control_id: `album_more`,
          control_position: 1,
          control_name: '更多',
          control_type: 'button',
        })
      "
    />
    <div
      v-if="pics.length > 0"
      :class="`medusa-sort-local-result-album__content medusa-sort-local-result-album__content--${
        pics.length > 4 ? 'double' : 'single'
      } df jcsb acsb`"
      id="album_photo"
    >
      <div
        v-for="(item, i) in pics"
        :key="i"
        class="medusa-sort-local-result-album__pic-item"
        :id="`album_item_${i + 1}`"
        data-href=""
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_name: (item.url || '').split('/').pop(),
            resource_position: i + 1,
            resource_type: 'album',
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
          :src="item.url || ''"
          class="medusa-sort-local-result-album__img"
        />
        <div
          v-if="item.type === 'type_video' && item.duration"
          class="medusa-sort-local-result-album__video-time"
        >
          {{ item.duration }}
        </div>
      </div>
      <div
        v-for="(item, index) in placeHolder"
        :key="index"
        class="medusa-sort-local-result-album__content--place-holder"
      ></div>
    </div>
    <div
      class="medusa-sort-local-result-album__more-info"
      v-if="folders.length > 0"
      id="album_list"
    >
      <div
        v-for="(item, idx) in folders.slice(0, 2)"
        :key="item.intentExtra ? item.intentExtra.key : item.title"
        role="presentation"
        :id="`album_item_${idx + 1}`"
        class="df aic medusa-sort-local-result-album__more-info--item"
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_id: item.intentExtra ? getRID(item.intentExtra.key) : '',
            resource_name: item.title,
            resource_position: idx + 1 + pics.length,
            resource_type: 'album',
            resource_source: -1,
            resource_num: item.rightContent,
          })
        "
        @click="() => setTag(encodeURIComponent(item.intentExtra.key))"
        :data-href="
          $utils.inject({
            h5: {
              url: `${ZEUS_URL}#/album?type=photo&q=${q}`,
              title: item.title,
              mode: 'page',
              judgeNet: false,
            },
          })
        "
      >
        <Pic
          :src="item.url"
          :size="'xss1-1'"
          perfType="local"
          :radius="'7'"
          class="medusa-sort-local-result-album__more-info--img"
        />
        <div id="album_title" class="fs_l cl_darkest f1 wklc">
          <clip-and-high-light
            :str="item.title"
            :q="q"
            count="26"
          ></clip-and-high-light>
        </div>
        <div class="fs_s cl_dark aic df" id="album_more">
          <span>
            {{ +item.rightContent > 9999 ? "9999+" : item.rightContent }}
          </span>
          <AngleRight />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MultiTitle, AngleRight, Pic } from "@components";
import { ZEUS_URL } from "@lego";
import ClipAndHighLight from "./components/ClipAndHighLight";
import { localStorage, debounce, launchPhotoEditPage } from "@lego";

export default {
  props: ["title", "q", "list", "index"],
  components: {
    AngleRight,
    MultiTitle,
    ClipAndHighLight,
    Pic,
  },
  data() {
    const folders = [];
    const pics = [];
    const ids = [];
    this.list.forEach((item) => {
      if (item.type === "type_album") {
        folders.push(item);
      } else {
        const { intentExtra } = item;
        ids.push(intentExtra.id);
        pics.push(item);
      }
    });
    return {
      pics,
      folders,
      ids,
      ZEUS_URL,
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
  },
  methods: {
    debounce,
    launchPhotoEditPage,
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
@include b(album) {
  padding-bottom: 0 !important;
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
        width: 21.3vw;
        height: 21.3vw;
      }
      @include e(video-time) {
        width: 43px;
        height: 16px;
        position: absolute;
        bottom: 5px;
        left: 5px;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 10px;
        color: #fff;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    @include m(place-holder) {
      width: 21.3vw;
      height: 21.3vw;
    }
  }
  @include e(more-info) {
    margin-top: 20px;
    padding-bottom: 18px;
    @include m(item) {
      margin-top: 20px;
    }
    @include m(img) {
      margin-right: 16px;
    }
  }
}
</style>
