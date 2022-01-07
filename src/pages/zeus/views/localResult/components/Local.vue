<template>
  <div
    class="zeus-local-result-local"
    v-if="parentKey === 'files'"
    @click="SubOpenSearchApp(itemData)"
  >
    <color-popper
      :class="rootClass"
      trigger="long-press"
      placement="bottom"
      :offset="[0, 10]"
      :data-log="
        $utils.inject({
          resource_name: itemData.title,
          resource_type: itemData.key,
          resource_source: -1,
          resource_position: idx + 1,
        })
      "
      data-exp="0"
    >
      <template v-slot:reference>
        <div>
          <div class="bsbb f1 w100 fs_l cl_normal">
            <div data-href="" class="df aic">
              <Pic :src="itemIcon" />
              <div class="mi_left-l List__item">
                <div
                  class="fs_l cl_darker"
                  v-html="clipAndHighLight(itemData.title, searchQ, 30)"
                />
                <div
                  v-if="itemData.subTitle"
                  class="fs_s fw_normal cl_normal mi_top-xxxxs"
                  v-html="
                    ['note', 'calendar', 'files'].includes(parentKey)
                      ? clipAndHighLight(itemData.subTitle, '', 34)
                      : clipAndHighLight(itemData.subTitle, searchQ, 34)
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        class="send-btn"
        data-exp="0"
        :data-log="
          $utils.inject(
            {
              resource_source: -1,
              click_pattern: 'click',
              control_name: '发送',
            },
            log
          )
        "
        @click.stop="sendTo(itemData.intentAction)"
      >
        发送
      </div>
    </color-popper>
  </div>

  <div
    v-else
    :class="`zeus-local-result-local ${rootClass}`"
    :data-log="
      $utils.inject({
        resource_name: itemData.title,
        resource_type: itemData.key,
        resource_source: -1,
        resource_position: idx + 1,
      })
    "
    data-exp="0"
    @click="SubOpenSearchApp(itemData)"
  >
    <div class="bsbb f1 w100 fs_l cl_normal">
      <div data-href="" class="df aic">
        <Pic :src="itemIcon" />
        <div class="mi_left-l List__item">
          <div class="zeus-local-result-local__title-box">
            <div
              class="zeus-local-result-local__title-box--title"
              v-html="
                clipAndHighLight(
                  itemData.title,
                  searchQ,
                  parentKey === 'contacts' && itemData.subTitle ? 18 : 30
                )
              "
            />
            <div
              v-if="itemData.label"
              :class="`zeus-local-result-local__title-box--${
                itemData.label === '最常使用' ? 'often' : 'hot'
              } lc1`"
            >
              {{ itemData.label }}
            </div>
          </div>
          <div
            v-if="itemData.subTitle"
            class="fs_s fw_normal cl_normal mi_top-xxxxs"
            v-html="
              ['note', 'calendar', 'files'].includes(parentKey)
                ? clipAndHighLight(
                    itemData.subTitle,
                    '',
                    parentKey === 'contacts' && itemData.subTitle ? 20 : 34
                  )
                : clipAndHighLight(
                    parentKey === 'shortcuts'
                      ? `由“${itemData.subTitle}”提供服务`
                      : itemData.subTitle,
                    searchQ,
                    parentKey === 'contacts' && itemData.subTitle ? 20 : 34
                  )
            "
          />
        </div>
        <div
          :contactId="itemData.contactId"
          :phoneNumber="itemData.subTitle"
          v-if="parentKey === 'contacts'"
          class="List__contactsButton"
        >
          <PhoneIcon
            class="List__contactsButton--right"
            :contactId="itemData.contactId"
            :phoneNumber="itemData.subTitle"
            :disabled="!itemData.subTitle"
          />
          <MessageIcon
            :contactId="itemData.contactId"
            :phoneNumber="itemData.subTitle"
            :disabled="!itemData.subTitle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
import { sendTo, clipAndHighLight, openSearchApp } from "@lego";
import MessageIcon from "@img/Svg/PhoneIcon/MessageIcon.vue";
import PhoneIcon from "@img/Svg/PhoneIcon/PhoneIcon.vue";
export default {
  name: "Local",
  components: {
    MessageIcon,
    PhoneIcon,
    Pic,
  },
  props: {
    itemData: {
      type: Object,
    },
    parentKey: {
      type: String,
    },
    parentIcon: {
      type: String,
    },
    idx: {
      type: Number,
    },
    parentQ: {
      type: String,
    },
    log: {
      type: Object,
      default() {
        return {};
      },
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    rootClass() {
      let className = "df aic pd-tb7 Local";
      !this.idx && (className += " pd_top-0");
      this.idx === Number(this.total) - 1 && (className += " pd_bottom-0");
      return className;
    },
    itemIcon() {
      const { itemData } = this;
      return itemData.url || itemData.icon || this.parentIcon;
    },
    searchQ() {
      return this.parentKey === "apps" ? this.itemData.hitKey : this.parentQ;
    },
  },
  methods: {
    sendTo(val) {
      sendTo(val);
    },
    clipAndHighLight,
    SubOpenSearchApp(item) {
      openSearchApp(this.parentKey, item);
    },
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-local-result-"; // 可配置的命名空间
@mixin label {
  font-size: 10px;
  line-height: 14px;
  color: #fff;
  padding: 0 3px;
  margin-left: 6px;
  border-radius: 3px;
  flex-shrink: 0;
}
@include b(local) {
  @include e(title-box) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 3px;

    @include m(title) {
      font-weight: 400;
      font-size: 16px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.85);
    }
    @include m(often) {
      @include label;
      background-color: #2dc84e;
    }
    @include m(hot) {
      @include label;
      background-color: #ffbb0e;
    }
  }
}
.pd-tb7 {
  padding: 7px 0;
}
.List__item {
  overflow: hidden;
  flex: auto;
}
.List__contactsButton--right {
  margin-right: 24px;
}
.List__contactsButton {
  margin-left: 20px;
  box-sizing: border-box;
  display: flex;
  flex: none;
  width: 74px;
}
</style>
