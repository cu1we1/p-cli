<template>
  <div
    class="MessageIcon"
    data-href
    @click.stop="SendMessage"
    :data-log="$utils.inject({ control_name: '信息' })"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.49984 5.38354C4.47774 5.38354 4.45654 5.39232 4.44091 5.40795C4.42528 5.42358 4.4165 5.44478 4.4165 5.46688V17.4755L6.95226 15.9538C7.39253 15.6897 7.89645 15.5502 8.40984 15.5502H19.4998C19.5219 15.5502 19.5431 15.5414 19.5588 15.5258C19.5744 15.5102 19.5832 15.489 19.5832 15.4669V5.46688C19.5832 5.44478 19.5744 5.42358 19.5588 5.40795C19.5431 5.39232 19.5219 5.38354 19.4998 5.38354H4.49984ZM3.38025 4.34729C3.67718 4.05036 4.07991 3.88354 4.49984 3.88354H19.4998C19.9198 3.88354 20.3225 4.05036 20.6194 4.34729C20.9164 4.64423 21.0832 5.04695 21.0832 5.46688V15.4669C21.0832 15.8868 20.9164 16.2895 20.6194 16.5865C20.3225 16.8834 19.9198 17.0502 19.4998 17.0502H8.40984C8.16824 17.0502 7.93111 17.1158 7.72391 17.2401L2.9165 20.125V5.46688C2.9165 5.04695 3.08332 4.64423 3.38025 4.34729Z"
        :fill="$utils.isDark ? 'white' : 'black'"
        :fill-opacity="disabled ? 0.15 : 0.55"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.3332 9.55021H8.6665V8.05021H15.3332V9.55021Z"
        :fill="$utils.isDark ? 'white' : 'black'"
        :fill-opacity="disabled ? 0.15 : 0.55"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.8332 12.8835H8.6665V11.3835H12.8332V12.8835Z"
        :fill="$utils.isDark ? 'white' : 'black'"
        :fill-opacity="disabled ? 0.15 : 0.55"
      />
    </svg>
  </div>
</template>
<script>
import { phoneFn } from "./phone";
export default {
  name: "MessageIcon",
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
    SendMessage(event) {
      if (!this.disabled) phoneFn(event, this.contactId, this.phoneNumber, "message");
    },
  },
};
</script>

<style scoped>
.MessageIcon {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
