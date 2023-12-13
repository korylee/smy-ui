<template>
  <smy-checkbox v-model="value" size="32px" />
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
