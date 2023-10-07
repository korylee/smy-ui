<template>
  <smy-cell>
    <smy-field v-model="value" rows="1" autosize type="textarea" placeholder="请输入" />
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
