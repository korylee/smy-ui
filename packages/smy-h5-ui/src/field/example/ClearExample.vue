<template>
  <smy-cell>
    <smy-field v-model="value" placeholder="显示清除图标" clearable />
  </smy-cell>
</template>
<script>
import { Field as SmyField, Cell as SmyCell } from '@smy-h5/ui'

export default {
  components: { SmyField, SmyCell },
  data: () => ({
    value: '',
  }),
}
</script>
