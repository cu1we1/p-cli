<template>
  <div
    class="PhoneIcon"
    data-href
    @click.stop="PhoneCall"
    :data-log="$utils.inject({ control_name: '拨号' })"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1506 17.7596L15.0381 14.8721C15.177 14.7333 15.3599 14.6472 15.5554 14.6287C15.7508 14.6102 15.9466 14.6604 16.1091 14.7706L19.9259 17.3536C20.1082 17.4632 20.2425 17.6374 20.302 17.8416C20.3615 18.0458 20.3419 18.2649 20.247 18.4552V18.4631C19.8584 19.2411 19.1846 19.8391 18.366 20.1325C17.5473 20.4259 16.647 20.3921 15.8527 20.0381C13.2225 18.8768 10.8258 17.246 8.78011 15.2256V15.2256C6.75625 13.1807 5.12164 10.7844 3.95623 8.15386C3.6024 7.35939 3.56866 6.45906 3.86205 5.64034C4.15544 4.82163 4.75333 4.14764 5.53123 3.75873H5.53911C5.72941 3.66364 5.9486 3.64388 6.15285 3.70342C6.35709 3.76295 6.53133 3.8974 6.64073 4.07986L9.22636 7.89398C9.3366 8.05646 9.38677 8.25227 9.36825 8.44774C9.34972 8.64321 9.26366 8.82611 9.12486 8.96498L6.23736 11.8525"
        :stroke="$utils.isDark ? 'white' : 'black'"
        :stroke-opacity="disabled ? 0.15 : 0.55"
        stroke-width="1.575"
        stroke-miterlimit="10"
      />
    </svg>
  </div>
</template>
<script>
import { phoneFn } from "./phone";
export default {
  name: "PhoneIcon",
  props: {
    contactId: {
      type: [String, Number],
    },
    phoneNumber: {
      type: [String, Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    PhoneCall(event) {
      if (!this.disabled) phoneFn(event, this.contactId, this.phoneNumber);
    },
  },
};
</script>
<style scoped>
.PhoneIcon {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
