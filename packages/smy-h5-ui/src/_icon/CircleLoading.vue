<template>
  <svg class="circle-loading-c92e" viewBox="25 25 50 50">
    <circle cx="50" cy="50" r="20" fill="none"></circle>
  </svg>
</template>

<style lang="less">
.circle-loading-c92e {
  @keyframes circle {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes circular {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120;
    }
  }

  display: block;
  width: 100%;
  height: 100%;
  animation: circle 1.8s linear infinite;
  circle {
    animation: circular 1.5s ease-in-out infinite;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
  }
}
</style>
