<template>
  <CommonNovelCard
    class="medusa-novel-voice"
    data-exp="0"
    title="有声书"
    :cardLog="$utils.inject({ card_id: data.dataInfo.cardId })"
    :newFooterData="newFooterData"
  >
    <div
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: data.source.resourceId,
          resource_provider: data.source.cpId,
          resource_name: data.cardContent[0],
        })
      "
    >
      <div class="medusa-novel-voice__content">
        <Pic
          :data-log="
            $utils.inject({
              resource_position: 2,
              control_name: '封面',
              resource_source: 1,
            })
          "
          class="medusa-novel-voice__pic"
          :data-href="$utils.inject(data.detailUrl)"
          :src="data.source.pic[0]"
          size="m3-4"
          :radius="7"
        >
          <div class="medusa-novel-voice__play-icon"></div>
        </Pic>
        <div class="medusa-novel-voice__info">
          <h4
            class="medusa-novel-voice__novel-title"
            v-html="highLightApp(novelInfo.name, q, 1, 26)"
          ></h4>
          <div>
            <div
              class="medusa-novel-voice__author-name"
              v-html="highLightApp(novelInfo.author, q)"
            ></div>
            <div
              class="medusa-novel-voice__paly lc2"
              v-html="highLightApp(novelInfo.palyNum, q, 2)"
            ></div>
            <div
              class="medusa-novel-voice__new-chapter"
              :data-log="
                $utils.inject({
                  resource_position: 4,
                  resource_source: 1,
                })
              "
            >
              {{ novelInfo.newChapter }}
            </div>
          </div>
        </div>
      </div>
      <div class="medusa-novel-voice__buttons">
        <div
          v-feedback
          class="medusa-novel-voice__button medusa-novel-voice__button-chapters"
          :data-href="$utils.inject(data.detailUrl)"
          :data-log="
            $utils.inject({
              resource_position: 3,
              control_name: data.source.content[10],
              resource_source: 1,
            })
          "
        >
          {{ novelInfo.buttonLeftText }}
        </div>
        <div
          v-feedback
          class="medusa-novel-voice__button medusa-novel-voice__button-try"
          :data-href="$utils.inject(data.chapterUrl)"
          :data-log="
            $utils.inject({
              resource_position: 4,
              control_name: data.source.content[11],
              resource_source: 1,
            })
          "
        >
          {{ novelInfo.buttonRightText }}
          <div v-if="data.source.pic[2]" class="medusa-novel-voice__icon">
            vip
          </div>
        </div>
      </div>
    </div>
  </CommonNovelCard>
</template>

<script>
import { highLightApp } from "@lego";
import CommonNovelCard from "./CommonNovelCard";
import { Pic } from "@components";
export default {
  name: "Voice",
  props: {
    data: {
      type: Object,
      required: true,
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
  components: { CommonNovelCard, Pic },
  methods: { highLightApp },
  computed: {
    newFooterData() {
      const { $utils, data } = this,
        { moreData } = data;
      return {
        href: $utils.inject(moreData.url),
        log: $utils.inject({ control_name: "查看更多" }),
        moreText: " ",
        text: moreData.title,
        iconUrl: moreData.img,
      };
    },
    novelInfo() {
      const { content } = this.data.source;
      return {
        name: this.data.cardContent[0],
        status: content[3],
        author: `${content[0]}${content[1]}`,
        palyNum: `${content[2]}${content[3]}`,
        newChapter: `${content[6]}${content[7]}`,
        buttonLeftText: content[10],
        buttonRightText: content[11],
      };
    },
  },
};
</script>

<style lang="scss">
$namespace: "medusa-novel-";
@include b(voice) {
  @include e(content) {
    margin-bottom: 14px;
    display: flex;
  }
  @include e(pic) {
    flex: none;
    width: 92px !important;
    height: 124px !important;
  }
  @include e(play-icon) {
    position: absolute;
    left: 8px;
    bottom: 8px;
    width: 18px;
    height: 18px;
    background: url("../../../img/novel_play.png") center center no-repeat;
    background-size: 100% auto;
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
    margin-bottom: 6px;
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
  @include e(paly) {
    margin-bottom: 6px;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.85);
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
    color: rgba(0, 0, 0, 0.85);
    line-height: 16px;
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
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  @include e(button-try) {
    position: relative;
    color: white;
    background: #2660f5;
  }
  @include e(icon) {
    position: absolute;
    top: -12px;
    right: 22px;
    width: 22px;
    height: 25px;
    font-size: 9px;
    line-height: 22px;
    text-align: center;
    color: white;
    background: url("../../../img/voice_icon.png") center center no-repeat;
    background-size: 100% auto;
  }
}
</style>
