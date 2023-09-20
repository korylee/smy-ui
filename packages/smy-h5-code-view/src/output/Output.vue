<template>
  <div class="output-wrapper">
    <div class="output-container">
      <preview show />
    </div>
  </div>
</template>
<script>
import Preview from './Preview.vue'

export default {
  name: 'VueOuput',
  components: { Preview },
}
</script>
<style>
.output-wrapper {
  height: 100%;
  width: 100%;
}

.output-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
