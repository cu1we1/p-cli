<template>
  <Card
    class="card_box medusa-sort-quick-app"
    :data-log="
      $utils.inject({
        card_id: cardId,
        card_position: 1,
      })
    "
    data-exp="0"
  >
    <div class="card_title">快应用</div>
    <div
      class="df jcsb aic medusa-sort-quick-app__box"
      data-exp="0"
      :data-log="
        $utils.inject({
          resource_id: item.rId || item.id,
          resource_name: item.name,
          resource_type: item.type || 'store',
          resource_source: 1,
          resource_position: item.index,
          resource_provider: item.cpId,
        })
      "
      :data-adlog="
        $utils.inject({
          adPosId: item.index,
          transparent: item.transparent,
          kw: q,
        })
      "
    >
      <div class="df jcfs aic">
        <Pic
          :size="'xsss1-1'"
          :src="item.icon"
          class="mi_right-l"
          :radius="9"
          :data-href="$utils.inject({ hap: item.url })"
          :data-adlog="
            $utils.inject({
              optValue: item.id || item.name,
              optKey: '1/2/0/4/1',
            })
          "
        />
        <div class="df fdc jcc aifs">
          <div class="df aic jcfs medusa-sort-quick-app__info-box">
            <div
              class="f1 lc1 cl_darkest fw_blod fs_l"
              v-html="matchCharacters(item.name, q)"
            ></div>
            <div class="medusa-sort-quick-app__tag fs_xs fw_cold">
              {{ item.tagText }}
            </div>
          </div>
          <div class="lc1 fs_s cl_normal">
            {{ item.desc }}
          </div>
        </div>
      </div>
      <div
        v-feedback
        class="gs_button_normal"
        :data-href="
          $utils.inject({
            hap: item.url,
          })
        "
        :data-log="
          $utils.inject({
            control_name: '秒开',
            control_position: 1,
            control_type: 'button',
          })
        "
        :data-adlog="
          $utils.inject({
            optValue: item.id || name,
            optKey: '1/1/1/0/1',
          })
        "
      >
        秒开
      </div>
    </div>
  </Card>
</template>

<script>
import format from "./format";
import { matchCharacters } from "@lego";
import { Card, Pic } from "@components";

export default {
  props: ["q", "payload"],
  components: {
    Card,
    Pic,
  },
  computed: {
    item() {
      const { list } = this.format(this.payload);
      return list[0];
    },
    cardId() {
      const { cardId } = this.format(this.payload);
      return cardId;
    },
  },
  methods: {
    matchCharacters,
    format,
  },
};
</script>

<style lang='scss' scoped>
$namespace: "medusa-sort-"; // 可配置的命名空间
@include b(quick-app) {
  padding-bottom: 22px;
  @include e(box) {
    margin-top: 2px;
  }
  @include e(info-box) {
    margin-bottom: 3px;
  }
  @include e(tag) {
    max-width: 100%;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 0px 2px;
    color: #fff;
    height: 14px;
    border-radius: 2px;
    background-color: #2ad181;
    margin-left: 4px;
  }
}
</style>
