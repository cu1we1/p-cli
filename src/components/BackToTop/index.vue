<template>
  <div @click="clickBackToTop" v-feedback>
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d)">
        <path
          d="M11 35C11 19.536 23.536 7 39 7V7C54.464 7 67 19.536 67 35V35C67 50.464 54.464 63 39 63V63C23.536 63 11 50.464 11 35V35Z"
          fill="white"
          fill-opacity="0.85"
        />
        <path
          d="M39.7501 32.6439L43.4696 36.3635L44.5303 35.3028L39.5303 30.3028C39.2374 30.0099 38.7625 30.0099 38.4696 30.3028L33.4696 35.3028L34.5303 36.3635L38.2501 32.6436V44.1665H39.7501V32.6439Z"
          fill="black"
          fill-opacity="0.85"
        />
        <path
          d="M47.3334 25.9165H30.6667V27.4165H47.3334V25.9165Z"
          fill="black"
          fill-opacity="0.85"
        />
        <path
          d="M39 62.67C23.7183 62.67 11.33 50.2817 11.33 35H10.67C10.67 50.6462 23.3538 63.33 39 63.33V62.67ZM66.67 35C66.67 50.2817 54.2817 62.67 39 62.67V63.33C54.6462 63.33 67.33 50.6462 67.33 35H66.67ZM39 7.33C54.2817 7.33 66.67 19.7183 66.67 35H67.33C67.33 19.3538 54.6462 6.67 39 6.67V7.33ZM39 6.67C23.3538 6.67 10.67 19.3538 10.67 35H11.33C11.33 19.7183 23.7183 7.33 39 7.33V6.67Z"
          fill="black"
          fill-opacity="0.12"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0.669983"
          y="0.669922"
          width="76.66"
          height="76.66"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
  props: ["clickBackToTop"],
};
</script>