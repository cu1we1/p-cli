<template>
  <CommonNovelCard
    title="作家作品"
    :cardLog="$utils.inject({ card_id: data.dataInfo.cardId })"
    :newFooterData="newFooterData"
  >
    <NovelList :list="novelList" :q="q" />
  </CommonNovelCard>
</template>

<script>
import NovelList from "./NovelList";
import CommonNovelCard from "./CommonNovelCard";
import { jumpActionToUrl } from "@lego";
export default {
  name: "Author",
  components: { CommonNovelCard, NovelList },
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
    const { list } = this.data;
    let moreCpId = "";
    if (Array.isArray(list) && list.length) {
      const firstItem = list[0];
      const { cpId } = firstItem[0];
      if (cpId) {
        moreCpId = cpId;
      }
    }
    return {
      cpId: moreCpId,
    };
  },
  computed: {
    novelList() {
      const { data } = this,
        members = data.list,
        author = data.cardContent[0];
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
            author,
            status: nowMember_content[3],
            href: jumpActionToUrl(nowMember.jumpActions[0]),
            resourceId: nowMember.resourceId,
          });
          j++;
        }
        i++;
      }
      return _nowMembers;
    },
    newFooterData() {
      const { $utils, data } = this,
        { moreData } = data;
      return {
        href: $utils.inject(moreData.url),
        log: $utils.inject({
          control_name: "查看更多",
          resource_source: "1",
          resource_provider: this.cpId,
        }),
        moreText: " ",
        text: moreData.title,
        iconUrl: moreData.img,
      };
    },
  },
};
</script>
