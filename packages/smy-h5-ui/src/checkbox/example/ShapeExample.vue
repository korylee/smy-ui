<template>
  <div>
    <smy-checkbox v-model="value" shape="round">复选框</smy-checkbox>
    <smy-checkbox v-model="value" shape="plain">复选框</smy-checkbox>
  </div>
</template>

<script>
import { Checkbox } from '@smy-h5/ui'

export default {
  components: {
    SmyCheckbox: Checkbox,
  },
  data: () => ({
    value: true,
  }),
}
</script>
