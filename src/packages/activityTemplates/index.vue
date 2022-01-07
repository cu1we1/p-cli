<template>
  <div
    v-if="hasData && isShow"
    key="activity_template"
    id="activityTemplate"
    class="activityTemplate_box"
    data-exp="0"
    :data-log="
      $utils.inject({
        card_id: formatPayload.id,
        card_name: `activityTemplate-${formatPayload.type}`,
        card_position: 1,
      })
    "
  >
    <component
      :is="componentMap[formatPayload.type]"
      :pageData="formatPayload.data"
      :id="formatPayload.id"
      @clickClose="Close"
    ></component>
  </div>
</template>

<script>
import { localStorage } from "@lego";
import format from "./format";
import pic from "./components/PicTemplate";
export default {
  name: "ActivityTmeplate",
  props: {
    payload: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    formatPayload() {
      return this.format(this.payload);
    },
    hasData() {
      return this.formatPayload?.data?.hasData;
    },
  },
  data() {
    return {
      isShow: false,
      componentMap: { pic },
    };
  },
  methods: {
    format,
    Close() {
      this.isShow = false;
      this.$nextTick(() => {
        this.setLocalByid();
      });
    },
    setLocalByid() {
      const { formatPayload } = this,
        { id, nowDate } = formatPayload,
        activities = formatPayload.activities || [];
      if (Array.isArray(activities)) {
        const newActivity = {};
        newActivity[id] = nowDate;
        activities.push(newActivity);
      }

      localStorage.setItem("activityTemplates", JSON.stringify(activities));
    },
  },
  created() {
    this.isShow = !this.formatPayload.hasClosed;
  },
};
</script>

<style lang="scss">
#activityTemplate {
  .picBox {
    border-radius: 12px;
  }

  .iconClose {
    position: absolute;
    right: 23px;
    top: 19px;
    width: 24px;
    height: 24px;
    background-size: 100%;
    background-repeat: no-repeat;
  }
}

.active_text {
  box-sizing: border-box;
  height: 46px;
  padding: 6px 24px;

  .expand {
    position: absolute;
    right: 24px;
    width: 53px;
    height: 16px;
  }

  .icon_close {
    position: absolute;
    right: 0;
    width: 16px;
    height: 16px;
  }

  .icon_box {
    width: 24px;
    height: 24px;
    margin-left: -4px;
    margin-right: 10px;
  }

  .text_box {
    width: 100%;
    height: 16px;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
