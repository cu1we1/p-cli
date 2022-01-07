<template>
  <div>
    <div
      v-for="(item, index) in list"
      :key="index"
      :id="`${item.k ? item.k : keys}_item_${index}`"
      data-href=""
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_type: item.k ? item.k : keys,
          resource_position: index + 1,
          resource_name: item.title,
          resource_source: -1,
          resource_id: item.intentPackage ? item.intentPackage : '',
        })
      "
      @click="() => openSearchApp(keys, item)"
    >
      <div :class="`df aic${len !== index + 1 ? ' local_list' : ''}`">
        <Pic :src="item.url || item.icon || icon" perfType="local" />
        <div class="f1 mi_left-l List__item">
          <div
            :id="`${item.k ? item.k : keys}_title`"
            class="fs_l fw_normal cl_darkest"
          >
            <clip-and-high-light
              :str="item.title"
              :q="q"
              :count="keys === 'contacts' && item.subTitle ? 18 : 30"
            ></clip-and-high-light>
          </div>
          <div
            v-if="item.subTitle"
            class="fs_s fw_normal cl_normal mi_top-xxxxs"
          >
            <clip-and-high-light
              v-if="
                ['note', 'calendar', 'files'].includes(item.k ? item.k : keys)
              "
              :str="item.subTitle"
              q=""
              :count="keys === 'contacts' && item.subTitle ? 24 : 40"
            ></clip-and-high-light>
            <clip-and-high-light
              v-else-if="(item.k ? item.k : keys) === 'shortcuts'"
              :str="`由“${item.subTitle}”提供服务`"
              :q="q"
              :count="40"
            ></clip-and-high-light>
            <clip-and-high-light
              v-else
              :str="item.subTitle"
              :q="q"
              :count="keys === 'contacts' && item.subTitle ? 24 : 40"
            ></clip-and-high-light>
          </div>
        </div>
        <div
          v-if="keys === 'contacts' && item.subTitle"
          class="List__contactsButton"
        >
          <PhoneIcon
            :contactId="item.contactId"
            :phoneNumber="item.subTitle"
            class="List__contactsButton--right"
          />
          <MessageIcon
            :contactId="item.contactId"
            :phoneNumber="item.subTitle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
import { openSearchApp, sendTo, trackClickBaseEle } from "@lego";
import MessageIcon from "@img/Svg/PhoneIcon/MessageIcon.vue";
import PhoneIcon from "@img/Svg/PhoneIcon/PhoneIcon.vue";
import ClipAndHighLight from "./ClipAndHighLight";
export default {
  props: ["list", "keys", "icon", "q"],
  components: {
    ClipAndHighLight,
    MessageIcon,
    PhoneIcon,
    Pic,
  },
  computed: {
    len() {
      return Array.isArray(this.list) ? this.list.length : 0;
    },
  },
  methods: {
    openSearchApp,
    sendTo,
    clickPopper(e) {
      if (e.target) {
        trackClickBaseEle(e.target);
      }
    },
    clickPattern(idx, data) {
      let el = this.$refs["color_popper" + idx][0].$el;
      trackClickBaseEle(el, data);
    },
  },
};
</script>

<style lang="scss" scoped>
.local_list {
  margin-bottom: 24px;
}

.mw248 {
  max-width: 248px;
}
.List__item {
  flex: auto;
  overflow: hidden;
}
.List__contactsButton--right {
  margin-right: 20px;
}
.List__contactsButton {
  margin-left: 20px;
  box-sizing: border-box;
  display: flex;
  flex: none;
  width: 74px;
}
</style>
