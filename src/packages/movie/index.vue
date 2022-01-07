<template>
  <div>
    <div v-for="(card, index) in asyncPayload" :key="index" class="card_box">
      <component
        :tname="tname"
        :is="componentMap[card.type]"
        :data="card.data"
        :cardindex="index + 1"
        :q="q"
      ></component>
    </div>
  </div>
</template>

<script>
// import HeadCard from './newComponents/HeadCard';
import HeadCard from "./components/HeadCard";
// import NearbyTheater from './components/NearbyTheater';
// import MovieReview from './components/MovieReview';
import format from "./format";
const componentMap = {
  detail: HeadCard,
  // nearbyCinema: NearbyTheater,
  // comment: MovieReview,
};
export default {
  name: "movie",
  props: ["tname", "payload", "q"],
  data() {
    return {
      componentMap,
    };
  },
  computed: {
    // 根据entry统一传入的数据进行数据处理
    asyncPayload() {
      return format(this.payload, this).filter((item) => {
        return item.type === "detail";
      });
    },
  },
};
</script>
