<template>
  <div class="demo-checkbox">
    <smy-checkbox v-model="value1" color="#12C963" />
    <smy-checkbox v-model="value2" />
    <smy-checkbox v-model="value2" />
  </div>
</template>

<script>
import { Checkbox } from '@smy-h5/ui'

export default {
  components: {
    SmyCheckbox: Checkbox,
  },
  data: () => ({
    value1: true,
    value2: true,
  }),
}
</script>

<style lang="less" scoped>
.demo-checkbox {
  --checkbox-color: #9a6655;
}
</style>
