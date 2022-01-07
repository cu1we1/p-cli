<template>
  <color-popper show-arrow :placement="placement" :offset="offset">
    <template v-slot:reference>
      <svg
        data-href=""
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.2 3.42385C3.34129 3.42385 1.02385 5.74129 1.02385 8.59999C1.02385 11.4587 3.34129 13.7761 6.2 13.7761C9.05871 13.7761 11.3761 11.4587 11.3761 8.59999C11.3761 5.74129 9.05871 3.42385 6.2 3.42385ZM0 8.59999C0 5.17583 2.77583 2.39999 6.2 2.39999C9.62417 2.39999 12.4 5.17583 12.4 8.59999C12.4 12.0242 9.62417 14.8 6.2 14.8C2.77583 14.8 0 12.0242 0 8.59999ZM5.68804 11.4434V8.03053H6.7119V11.4434H5.68804ZM6.91128 6.60991C6.91128 7.00259 6.59295 7.32092 6.20027 7.32092C5.80759 7.32092 5.48926 7.00259 5.48926 6.60991C5.48926 6.21723 5.80759 5.8989 6.20027 5.8989C6.59295 5.8989 6.91128 6.21723 6.91128 6.60991Z"
          :fill="$utils.isDark ? 'white' : 'black'"
          fill-opacity="0.3"
        />
      </svg>
    </template>

    <div class="fs_s fw_normal cl_normal lc0 alertInfo">
      {{ info }}
    </div>
  </color-popper>
</template>

<script>
export default {
  name: "AlertInfo",
  props: {
    info: {
      type: String,
      default: "",
    },
    placement: {
      type: String,
    },
    offset: {
      type: Array,
      default: () => [100, 10],
    },
  }
};
</script>

<style lang="scss" scoped>
.alertInfo {
  padding: 5px 4px;
  width: 62vw;
}
.priceInfoIcon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: cover;
  background-repeat: no-repeat;
  vertical-align: text-bottom;
  position: relative;
  z-index: 1;
  background-position-y: -1px;
}
</style>
