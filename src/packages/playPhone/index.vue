<template>
  <div class="card_box">
    <div
      class="all-content"
      v-for="(tab, index) in tabList"
      :key="index"
      data-exp="0"
      :data-log="
        $utils.inject({
          card_id: cardInfo.cardId,
          card_name: `play-phone`,
          card_position: 1,
        })
      "
    >
      <div class="title-box df aic jcsb">
        <div class="fw_medium title-box-title">
          {{ tab.tabName }}
        </div>
        <div
          class="icon_right df aic"
          data-exp="0"
          v-if="tab.tabItem && tab.tabItem.length >= 3"
          :data-href="
            $utils.inject({
              h5: {
                url: `${playPhoneUrl}q=${q}`,
                title: jumpTitle,
                mode: 'page',
                judgeNet: false,
              },
            })
          "
          :data-log="
            $utils.inject({
              resource_id: tab.tabId,
              resouece_name: tab.tabName,
              resource_position: index + 1,
              resource_source: '1',
            })
          "
        >
          <AngleRight size="m" color="light" />
        </div>
      </div>

      <div v-for="(item, i) in tab.tabItem" :key="i">
        <div v-show="showMore || i <= 1">
          <div class="sub-title" v-if="!item.pic">
            <div
              class="question cl_darkest fs_l"
              v-html="
                clipAndHighLight(item.content[0], q, 50, 'play-phone-light')
              "
            ></div>
            <div class="content fs_s" v-html="item.content[1]"></div>
          </div>

          <div
            class="item-box df jcsb"
            v-if="item.pic && item.pic.length >= 1"
            data-exp="0"
            :data-href="
              item.jumpActions && item.jumpActions[0] && item.jumpActions[0].url
            "
            :data-log="
              $utils.inject({
                resource_id: item.resourceId,
                resouece_name: item.content && item.content[0],
                resource_position: i + 1,
                resource_provider: item.cpId,
                resource_source: '1',
              })
            "
          >
            <div class="sub-title">
              <div
                class="cl_darkest fs_l"
                v-html="clipAndHighLight(item.content[0], q, 50)"
              ></div>
              <div class="content fs_s" v-html="item.content[1]"></div>
            </div>
            <div v-if="item.pic && item.pic.length === 1" class="pic">
              <Pic
                class="picture"
                :src="item.pic[0]"
                size="m3-2"
                :radius="8"
              ></Pic>
            </div>

            <div
              class="df jcsb pd_top-xxs"
              v-if="item.pic && item.pic.length > 1"
            >
              <Pic
                v-for="(pic, i) in item.pic"
                :key="i"
                :src="pic"
                size="m3-2"
                :radius="8"
                class="picture"
              ></Pic>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Pic, AngleRight } from "@components";
import format from "./format";
import { clipAndHighLight } from "@lego";
import { ZEUS_URL as URL } from "@lego";
export default {
  name: "PlayPhone",
  components: {
    Pic,
    AngleRight,
  },
  props: ["q", "payload"],
  data() {
    return {
      showMore: false,
      playPhoneUrl: `${URL}#/playphone?`,
      jumpTitle: `“${this.q}”的更多使用技巧`,
    };
  },
  computed: {
    tabList() {
      const list = this.format(this.payload).find(
        (item) => item.type === "tab"
      );
      return list && list.data;
    },
    cardInfo() {
      const card = this.format(this.payload).find(
        (item) => item.type === "card"
      );
      return card && card.cardInfo;
    },
  },
  methods: {
    format,
    clipAndHighLight,
  },
};
</script>
<style lang="scss" scoped>
.pic {
  margin-left: 10px;
  height: 64px;
}
.ics_m {
  width: 10px;
  height: 10px;
}
.title-box {
  color: rgba(0, 0, 0, 0.55);
}
.title-box-title {
  font-size: 12px;
  line-height: 28px;
}
.picture {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.sub-title {
  padding-top: 12px;
}
.all-content {
  margin-bottom: -8px;
}
.item-box {
  align-items: flex-end;
  margin-bottom: 12px;
}
.content.fs_s {
  line-height: 20px;
  color: rgba(0, 0, 0, 0.55);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-top: 4px;
}
.question {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/deep/.pic {
  margin-left: 4px;
}
/deep/.img-box {
  background-position: 50% 50%;
}
</style>
