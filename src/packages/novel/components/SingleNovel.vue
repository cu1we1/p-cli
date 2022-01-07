<template>
  <CommonNovelCard
    title="小说"
    class="medusa-novel-single-novel"
    data-exp="0"
    :cardLog="
      $utils.inject({
        card_id: data.dataInfo.cardId,
        card_position: 1,
      })
    "
    :newFooterData="newFooterData"
  >
    <div class="medusa-novel-single-novel__content">
      <Pic
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_position: 2,
            resource_name: '封面',
            resource_source: 1,
            resource_id: data.source.resourceId,
            resource_provider: data.source.cpId,
          })
        "
        class="medusa-novel-single-novel__pic"
        :data-href="$utils.inject(data.detailUrl)"
        :src="data.source.pic[0]"
        size="m3-4"
        :radius="7"
      >
        <div
          class="medusa-novel-single-novel__text-icon"
          :class="
            novelInfo.status == '连载'
              ? 'medusa-novel-single-novel__text-icon--serial'
              : 'medusa-novel-single-novel__text-icon--finish'
          "
        >
          {{ novelInfo.status }}
        </div>
      </Pic>
      <div class="medusa-novel-single-novel__info">
        <h4
          class="medusa-novel-single-novel__novel-title"
          v-html="highLightApp(novelInfo.name, q, 1, 26)"
        ></h4>
        <div>
          <div
            @click="clickSearch(data.query, data.dataInfo.cardId)"
            class="medusa-novel-single-novel__author-name"
            v-html="highLightApp(novelInfo.author, q)"
          ></div>
          <div
            class="medusa-novel-single-novel__brief-introduction lc2"
            v-html="highLightApp(novelInfo.introduction, q, 2)"
          ></div>
          <div
            class="medusa-novel-single-novel__new-chapter"
            data-exp="0"
            :data-log="
              $utils.inject({
                resource_position: 4,
                resource_name: newChapter.text,
                resource_source: 1,
                resource_id: data.source.resourceId,
                resource_provider: data.source.cpId,
              })
            "
            :data-href="$utils.inject(jumpActionToUrl(newChapter.url))"
          >
            {{ newChapter.text }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="medusa-novel-single-novel__buttons"
      v-if="data.dataInfo.cardId !== '130101'"
    >
      <div
        v-feedback
        class="
          medusa-novel-single-novel__button
          medusa-novel-single-novel__button-chapters
        "
        :data-href="
          $utils.inject(
            data.chapterUrl.url ||
              data.chapterUrl.hap ||
              data.chapterUrl.deepLink
              ? data.novelUrl
              : data.chapterUrl
          )
        "
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_position: 5,
            resource_name: '章节目录',
            resource_source: 1,
            resource_id: data.source.resourceId,
            resource_provider: data.source.cpId,
          })
        "
        :style="{
          borderColor: [
            $utils.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
          ],
        }"
      >
        章节目录
      </div>
      <div
        v-feedback
        class="
          medusa-novel-single-novel__button
          medusa-novel-single-novel__button-try
        "
        :data-href="$utils.inject(data.chapterUrl)"
        data-exp="0"
        :data-log="
          $utils.inject({
            resource_position: 6,
            resource_name: '免费阅读',
            resource_source: 1,
            resource_id: data.source.resourceId,
            resource_provider: data.source.cpId,
          })
        "
      >
        立即试读
      </div>
    </div>
  </CommonNovelCard>
</template>

<script>
import { Pic } from "@components";
import CommonNovelCard from "./CommonNovelCard";
import { highLightApp, mThemes, jumpActionToUrl } from "@lego";
const { novelFooterIcon } = mThemes;

export default {
  name: "SingleNovel",
  components: { Pic, CommonNovelCard },
  inject: ["onSearch"],
  props: {
    data: {
      type: Object,
      require: true,
      default: () => {},
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
    // 最后章节
    newChapter() {
      const { list, url } = this.data.chapters;
      return {
        text: list && list[list.length - 2],
        url: url && url[url.length - 1],
      };
    },
    // 所使用的小说信息
    novelInfo() {
      const { content } = this.data.source;
      let status = content[3];
      if (status) {
        status.indexOf("完结") !== -1 ? (status = "完结") : (status = "连载");
      }
      return {
        name: this.data.cardContent[0],
        status,
        author: `作者：${content[1]}`,
        introduction: content[9] && `简介：${content[9].trim()}`,
      };
    },
    // 查看更多数据
    newFooterData() {
      const { $utils, data } = this,
        { moreData } = data;
      return {
        href: $utils.inject(moreData.url),
        log: $utils.inject({ control_name: "查看更多" }),
        moreText: " ",
        // text: moreData.title,
        text: "可乐免费小说",
        iconUrl: novelFooterIcon,
      };
    },
  },
  methods: {
    highLightApp,
    jumpActionToUrl,
    clickSearch(query) {
      this.onSearch(query, "search_web");
    },
  },
};
</script>

<style lang="scss">
$namespace: "medusa-novel-";
@include b(single-novel) {
  @include e(content) {
    margin-bottom: 14px;
    display: flex;
  }
  @include e(pic) {
    flex: none;
    width: 92px !important;
    height: 124px !important;
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
    padding: 0 3px;
    border-radius: 3px;
    text-align: center;
    @include m(finish) {
      background: #2660f5;
    }
    @include m(serial) {
      background: #ffbb0e;
    }
  }
  @include e(info) {
    margin-left: 14px;
  }
  @include e(novel-title) {
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
  @include e(author-name) {
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
  @include e(brief-introduction) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    margin-bottom: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 16px;
  }
  @include e(new-chapter) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    font-size: 12px;
    color: #2660f5;
    line-height: 16px;
    &::before {
      color: rgba(0, 0, 0, 0.55);
      content: "最新章节：";
    }
  }
  @include e(buttons) {
    display: flex;
    justify-content: space-between;
  }
  @include e(button) {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 151px;
    height: 36px;
    font-size: 12px;
    border-radius: 18px;
  }
  @include e(button-chapters) {
    color: rgba(0, 0, 0, 0.85);
    border: 1px solid;
  }
  @include e(button-try) {
    color: white;
    background: #2660f5;
  }
}
</style>
