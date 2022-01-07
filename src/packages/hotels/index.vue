<template>
  <div
    id="hotel"
    class="gs-hotel gs_card_bg_color"
    v-if="dataPayload"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: dataPayload.cardId,
        card_name: 'hotel',
        card_position: 1,
      })
    "
  >
    <div class="card_title gs-hotel__title">
      {{ cardTitle }}
    </div>
    <hotel-header v-bind="dataPayload" />
    <hotel-list
      v-bind="dataPayload"
      :pageData="dataPayload.list.tabItem.slice(0, 3)"
    />
    <hotel-bottom
      v-if="moreHref"
      :data-log="
        $utils.inject({
          resource_name: '查看更多',
          resource_position: 6,
          resource_source: 0,
          resource_url: moreHref,
          resource_provider: 0,
        })
      "
      :data-href="$utils.inject(genHref({ fastappUrl: moreHref }))"
    />
  </div>
</template>

<script>
import { browserInfo } from "@lego";
import { genHref } from "@lego";
import format from "./format";
import HotelHeader from "./components/HotelHeader";
import HotelList from "./components/HotelList";
import HotelBottom from "./components/HotelBottom";
const { source = "" } = browserInfo || {};
export default {
  name: "hotel",
  props: ["payload", "tname", "q"],
  data() {
    return {
      cardTitle: "酒店预订",
    };
  },
  computed: {
    dataPayload() {
      const {
          data: { cardId, cpId, head, list, mdsSearch, mdsQuery },
          type,
        } = this.format(this.payload, { tname: this.tname }),
        { checkIn, checkOut, location, operation, lat, lon, poi, brand, star } =
          head || {};
      return {
        cardId,
        cpId,
        list,
        mdsSearch,
        mdsQuery,
        checkIn,
        checkOut,
        location,
        operation,
        lat,
        lon,
        poi,
        brand,
        star,
        q: this.q,
        type,
      };
    },
    moreHref() {
      const {
        data: { head, mdsSearch, mdsQuery },
      } = this.format(this.payload, { tname: this.tname });
      if (!head) return "";
      const {
        location,
        lon,
        lat,
        poi,
        brand,
        star,
        // form = 'search',
      } = head;
      let moreHref = `hap://app/com.globalsearch.hap/hotel/listbox?fields=${encodeURIComponent(
        JSON.stringify({
          city: location || `北京`,
          lon,
          lat,
          poi,
          brand,
          star,
          from: "search",
          mds_search: mdsSearch,
          mds_query: mdsQuery,
        })
      )}`;
      if (source) {
        moreHref += `&oparams=${source}`;
      }
      return moreHref;
    },
  },
  components: {
    HotelHeader,
    HotelList,
    HotelBottom,
  },
  methods: {
    format,
    genHref,
  },
};
</script>


<style scoped lang="scss">
$namespace: "gs-"; // 可配置的命名空间
@include b(hotel) {
  border-radius: 14px;
  margin: 0px 10px 10px 10px;
  padding: 10px 0px 4px 0px;
  @include e(title) {
    padding: 0 14px;
  }
}
</style>