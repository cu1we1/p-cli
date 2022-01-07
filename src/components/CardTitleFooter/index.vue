<template>
  <div class="gs-components-card-title-footer" data-exp="0" :data-log="cardLog">
    <div class="gs-components-card-title-footer__title">
      {{ title }}
    </div>
    <slot />
    <NewFooter
      v-if="isFooter"
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
  name: 'CardTitleFooter',
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
    isFooter:{
      type:Boolean,
      default:true
    }
  },
};
</script>

<style lang="scss">
$namespace: 'gs-components-';
@include b(card-title-footer) {
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
