<template>
  <CommonNovelCard
    class="medusa-novel-widely-list"
    data-exp="0"
    title="小说"
    :cardLog="$utils.inject({ card_id: data.dataInfo.cardId })"
    :newFooterData="newFooterData"
  >
    <div class="medusa-novel-widely-list__scroll-box">
      <div class="medusa-novel-widely-list__menu-item-box" @touchmove.stop>
        <div
          ref="menuItems"
          class="medusa-novel-widely-list__menu-item"
          :class="{
            'medusa-novel-widely-list__menu-item--active':
              index === nowShow && q !== item,
            'medusa-novel-widely-list__menu-item--active-red':
              index === nowShow && q === item,
          }"
          v-for="(item, index) in data.buttons"
          :key="item"
          @click="clickBtn(index)"
        >
          {{ item }}
        </div>
        <div
          v-if="data.buttons.length > 0"
          class="medusa-novel-widely-list__menu-item--last"
        />
      </div>
      <div
        class="medusa-novel-widely-list__scroll-shadow"
        @click="clickShadow"
        ref="menuShadow"
      ></div>
    </div>
    <NovelList
      :list="nowMembers"
      :data-log="
        $utils.inject({
          tab_id: selectedTabName,
          tab_position: nowShow + 1,
        })
      "
    />
  </CommonNovelCard>
</template>

<script>
import CommonNovelCard from "./CommonNovelCard";
import NovelList from "./NovelList";
import { jumpActionToUrl, mThemes } from "@lego";
const { novelFooterIcon } = mThemes;
export default {
  components: { CommonNovelCard, NovelList },
  name: "WidelyList",
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
  data() {
    return {
      nowShow: 0,
      file_is_show: true,
    };
  },
  computed: {
    selectedTabName() {
      return this.data.buttons[this.nowShow];
    },
    newFooterData() {
      const { $utils, data } = this,
        { moreData } = data;
      return {
        href: $utils.inject(moreData.url),
        log: $utils.inject({ control_name: "查看更多" }),
        moreText: " ",
        text: "可乐免费小说",
        iconUrl: novelFooterIcon,
      };
    },
    // 需要渲染的图书列表
    nowMembers() {
      const { data, nowShow } = this,
        initText = data.buttons[nowShow],
        members = data.members[initText].list;
      let _nowMembers = [];
      let i = 0,
        j = 0,
        menber = [],
        max = 0,
        nowMember = null,
        nowMember_content = null;
      while (_nowMembers.length < 3) {
        j = 0;
        menber = members[i];
        max = menber.length;
        while (j < max && _nowMembers.length < 3) {
          nowMember = menber[j];
          nowMember_content = nowMember.content;
          _nowMembers.push({
            cpId: nowMember.cpId,
            picUrl: nowMember.pic[0],
            name: nowMember_content[0],
            author: nowMember_content[2],
            status: nowMember_content[4],
            href: jumpActionToUrl(nowMember.jumpActions[0]),
            resourceId: nowMember.resourceId,
          });
          j++;
        }
        i++;
      }
      return _nowMembers;
    },
  },
  methods: {
    Init() {
      const { data } = this;
      let activeKey = data.cardContent[2];
      this.nowShow = data.buttons.indexOf(activeKey);
    },
    clickBtn(index) {
      this.nowShow = index;
    },
    clickShadow() {
      const shadowDom = this.$refs.menuShadow;
      if (shadowDom && this.$refs.menuItems && this.$refs.menuItems.length) {
        let num = 9999;
        let selectedIndex;
        const { left: shadowRect } = shadowDom.getBoundingClientRect();
        this.$refs.menuItems.forEach((item, index) => {
          if (item instanceof HTMLElement) {
            const { left: itemRect } = item.getBoundingClientRect();
            if (itemRect <= shadowRect && num > shadowRect - itemRect) {
              num = shadowRect - itemRect;
              selectedIndex = index;
            }
          }
        });
        this.nowShow = selectedIndex;
      }
    },
  },
  created() {
    this.Init();
  },
};
</script>

<style lang="scss">
@import "src/style/functions/index.scss";
@import "src/style/themes/index.scss";
$namespace: "medusa-novel-";
@include b(widely-list) {
  padding-top: 10px;
  @include e(title) {
    margin-bottom: 16px;
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.55);
  }
  @include e(scroll-box) {
    position: relative;
    @include e(menu-item-box) {
      display: flex;
      overflow-x: scroll;
    }
    @include e(menu-item) {
      flex-shrink: 0;
      margin-left: 20px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.55);
      height: 34px;
      line-height: 34px;
      border-bottom: 2px solid white;
      &:first-child {
        margin: 0;
      }
      @include m(active) {
        color: rgba(0, 0, 0, 0.85);
        border-bottom-color: rgba(0, 0, 0, 0.85);
      }
      @include m(last) {
        flex-shrink: 0;
        height: 34px;
        width: 40px;
      }
      @include m(active-red) {
        @include themify(initThemes($oppo, $oppoDark)) {
          color: themed("clm");
          border-bottom-color: themed("clm");
        }
      }
    }
  }
  @include e(scroll-shadow) {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 36px;
    background: linear-gradient(
      269.95deg,
      #ffffff 50%,
      rgba(255, 255, 255, 0) 99.96%
    );
  }
}
</style>
