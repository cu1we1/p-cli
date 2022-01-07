<template>
  <div class="album">
    <photo-list :q="q" v-if="type === 'list'"></photo-list>
    <photo-gather v-else-if="type === 'photo'"></photo-gather>
    <photo-gather-fresh
      :query="q"
      :tagId="tagId"
      v-else-if="type === 'photoFresh'"
    ></photo-gather-fresh>
  </div>
</template>

<script>
import PhotoList from "./PhotoList";
import PhotoGather from "./PhotoGather";
import PhotoGatherFresh from "./PhotoGatherFresh";
import { init } from "@lego";
export default {
  data() {
    const { q, type, tagId } = this.$route.query;
    return {
      q,
      type,
      tagId,
    };
  },
  components: {
    PhotoList,
    PhotoGather,
    PhotoGatherFresh,
  },
  created() {
    document.body.classList.add("bg_fill");
  },
  mounted() {
    init();
  },
};
</script>

<style></style>
