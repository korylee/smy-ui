<template>
  <smy-checkbox v-model="value" color="#12C963" />
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
