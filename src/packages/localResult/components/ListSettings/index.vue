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
      class="medusa-sort-local-result-settings"
    >
      <Pic
        perfType="local"
        :src="item.url || item.icon || icon"
        class="medusa-sort-local-result-settings__image"
      />
      <div class="medusa-sort-local-result-settings__content">
        <div class="medusa-sort-local-result-settings__title-box">
          <clip-and-high-light
            :id="`${item.k ? item.k : keys}_title`"
            class="medusa-sort-local-result-settings__title-box--title"
            :str="item.title"
            :q="q"
            :count="30"
          ></clip-and-high-light>
          <div
            v-if="item.label"
            :class="`medusa-sort-local-result-settings__title-box--${
              item.label === '最常使用' ? 'often' : 'hot'
            } lc1`"
          >
            {{ item.label }}
          </div>
        </div>
        <clip-and-high-light
          v-if="item.subTitle"
          class="medusa-sort-local-result-settings__content--sub-title"
          :str="item.subTitle"
          :q="q"
          :count="40"
        ></clip-and-high-light>
      </div>
    </div>
  </div>
</template>

<script>
import { openSearchApp } from "@lego";
import ClipAndHighLight from "../ClipAndHighLight";
import { Pic } from "@components";

export default {
  props: ["list", "keys", "icon", "q"],
  components: {
    ClipAndHighLight,
    Pic,
  },
  methods: {
    openSearchApp,
  },
};
</script>

<style lang="scss" scoped>
$namespace: "medusa-sort-local-result-"; // 可配置的命名空间
@mixin label {
  font-size: 10px;
  line-height: 14px;
  color: #fff;
  padding: 0 3px;
  margin-left: 6px;
  border-radius: 3px;
  flex-shrink: 0;
}
@include b(settings) {
  display: flex;
  align-items: center;
  padding: 12px 0;
  @include e(image) {
    margin-right: 16px;
  }
  @include e(content) {
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
    @include m(sub-title) {
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.55);
    }
  }
}
</style>
