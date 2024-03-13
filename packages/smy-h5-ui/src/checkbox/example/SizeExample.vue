<template>
  <div class="demo-checkbox">
    <smy-checkbox v-model="value1" size="32px" />
    <smy-checkbox v-model="value2" />
    <smy-checkbox v-model="value3" style="font-size: 50px" />
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
    value3: true,
  }),
}
</script>

<style lang="less" scoped>
.demo-checkbox {
  --checkbox-size: 40px;
}
</style>
