<template>
  <div
    class="medusa-novel-component-common-novel-card"
    data-exp="0"
    :data-log="cardLog"
  >
    <div class="medusa-novel-component-common-novel-card__title">
      {{ title }}
    </div>
    <slot />
    <NewFooter
      :data-href="newFooterData.href"
      :data-log="newFooterData.log"
      :moreText="newFooterData.moreText"
      :text="newFooterData.text"
      :iconUrl="newFooterData.iconUrl"
    ></NewFooter>
  </div>
</template>

<script>
import { NewFooter } from '@components';
export default {
  name: 'CommonNovelCard',
  components: { NewFooter },
  props: {
    title: {
      type: String,
      default: '',
    },
    cardLog: {
      type: String,
      default: '',
    },
    newFooterData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss">
$namespace: 'medusa-novel-component-';
@include b(common-novel-card) {
  padding-top: 10px;
  @include e(title) {
    margin-bottom: 16px;
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.55);
  }
}
</style>
