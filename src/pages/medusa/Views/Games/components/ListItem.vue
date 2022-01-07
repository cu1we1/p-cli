<template>
  <div>
    <app-game-item
      v-if="item.type === '0'"
      :key="`${item.id}-${index}`"
      v-bind="item"
      :keyword="keyword"
      :index="index"
      :perfType="'games'"
      :showRecommend="false"
    />
    <game-item
      v-else-if="item.type === '1'"
      :key="`${item.id}-${index}`"
      v-bind="item"
      :keyword="keyword"
      :index="index"
      :perfType="'games'"
      :showRecommend="false"
    />
    <little-game-item
      v-else-if="item.type === '2'"
      v-bind="item"
      :keyword="keyword"
      :index="index"
      :key="`${item.id}-${index}`"
    />
  </div>
</template>

<script>
import { LittleGameItem, GameItem, AppGameItem } from "@components";

export default {
  props: ["index", "item", "keyword"],
  components: { AppGameItem, GameItem, LittleGameItem },
};
</script>

<style></style>
