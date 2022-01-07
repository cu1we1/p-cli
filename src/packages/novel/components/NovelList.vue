<template>
  <div class="medusa-novel-component-novel-list">
    <div
      class="medusa-novel-component-novel-list__novel-item"
      v-for="(item, idx) in list"
      :key="item.picUrl"
      :data-href="$utils.inject(item.href)"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: item.resourceId,
          resource_position: idx + 1,
          resource_name: item.name,
          resource_provider: item.cpId,
        })
      "
    >
      <Pic
        :src="item.picUrl"
        class="medusa-novel-component-novel-list__pic"
        style="width: 25.56vw; height: 34.44vw"
        :radius="7"
      >
        <template>
          <div
            class="medusa-novel-component-novel-list__text-icon"
            :class="
              item.status == '连载'
                ? 'medusa-novel-component-novel-list__text-icon--serial'
                : 'medusa-novel-component-novel-list__text-icon--finish'
            "
          >
            {{ item.status }}
          </div>
        </template>
      </Pic>
      <h4 class="lc1 medusa-novel-component-novel-list__novel-name">
        {{ item.name }}
      </h4>
      <p
        class="lc1 medusa-novel-component-novel-list__author"
        v-html="highLightApp(item.author, q, 1)"
      ></p>
    </div>
  </div>
</template>

<script>
import { Pic } from "@components";
import { highLightApp } from "@lego";
export default {
  name: "NovelList",
  components: { Pic },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    q: {
      type: String,
      default: "",
    },
  },
  methods: {
    highLightApp,
  },
};
</script>

<style lang="scss">
$namespace: "medusa-novel-component-";
@include b(novel-list) {
  margin-top: 10px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  @include e(novel-item) {
    flex: none;
    width: 25.56vw;
  }
  @include e(pic) {
    margin-bottom: 8px;
    flex: none;
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
    height: 14px;
    padding: 0 3px;
    border-radius: 3px;
    @include m(finish) {
      background: #2660f5;
    }
    @include m(serial) {
      background: #ffbb0e;
    }
  }
  @include e(novel-name) {
    margin: 0;
    margin-bottom: 3px;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  @include e(author) {
    font-size: 10px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.55);
  }
}
</style>
