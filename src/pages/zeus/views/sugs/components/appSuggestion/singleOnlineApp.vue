<template>
  <div
    class="zeus-sugs-app-suggestion-single-online-app"
    data-exp="0"
    :data-log="
      $utils.inject({
        resource_id: rId || id,
        resource_name: name,
        resource_type: type,
        resource_source: 1,
        resource_position: index,
        resource_provider: cpId,
        ad_src: isAd,
      })
    "
    :data-adlog="
      $utils.inject({
        adPosId: index,
        transparent: transparent,
        kw: query,
      })
    "
  >
    <div
      class="zeus-sugs-app-suggestion-single-online-app__main-info"
      :data-href="
        $utils.inject({
          native: {
            pkg: pkg,
            url: url,
            transparent: transparent,
            adpos: index,
            tk_con: tk_con,
            tk_ref: tk_ref,
          },
        })
      "
      :data-adlog="
        $utils.inject({
          optValue: id || name,
          optKey: '1/2/0/4/1',
        })
      "
    >
      <Pic
        :src="icon"
        :size="'xss1-1'"
        :radius="12"
        class="zeus-sugs-app-suggestion-single-online-app__main-info--image"
      />
      <div
        id="automated_sugOnlineApps_name"
        v-html="highLightApp(name, query, 1)"
        class="zeus-sugs-app-suggestion-single-online-app__main-info--name lc1"
      ></div>
    </div>
    <Button
      id="automated_sugOnlineApps_button"
      :pkg="pkg"
      :url="url"
      :transparent="transparent"
      :index="index + 1"
      :optId="id"
      :name="name"
      :token="token"
      :type="type"
      :tkRef="tk_ref"
      :tkCon="tk_con"
    />
  </div>
</template>

<script>
import { Pic, Button } from "@components";
import { highLightApp, getPkg } from "@lego";

export default {
  props: ["data", "query", "index"],
  data() {
    return {
      rId: this.data.resourceId,
      cpId: this.data.cpId,
      id: this.data.content[0],
      type: "store",
      name: this.data.content[1],
      transparent:
        this.data.content[5] ||
        JSON.stringify({
          contentId: this.data.content[0],
        }),
      tk_con: this.data.content[6],
      tk_ref: this.data.content[7],
      icon: this.data.pic[0],
      pkg: getPkg(this.data.jumpActions[1].pkg),
      url: this.data.jumpActions[0].url,
      isAd: this.data.content[9],
      token: this.data.downloadToken || "",
    };
  },
  components: {
    Pic,
    Button,
  },
  computed: {
    getButtonText() {
      return "安装";
    },
  },
  methods: {
    highLightApp,
    getPkg,
  },
};
</script>

<style lang="scss" scoped>
$namespace: "zeus-sugs-app-suggestion-"; // 可配置的命名空间
@mixin flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
@include b(single-online-app) {
  width: 16.666667vw;
  @include flex;
  @include e(main-info) {
    @include flex;
    margin-bottom: 10px;
    @include m(name) {
      height: 16px;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
    @include m(image) {
      margin-bottom: 8px;
      margin-top: 5px;
    }
  }
  @include e(button) {
    width: 52px;
    height: 28px;
    min-width: 52px;
    background-color: rgba(38, 96, 245, 0.1);
    padding: 0 12px;
    font-size: 14px;
    line-height: 28px;
    color: #2660f5;
    border-radius: 3.888889vw;
    box-sizing: border-box;
    font-weight: 500;
    text-align: center;
  }
}
</style>