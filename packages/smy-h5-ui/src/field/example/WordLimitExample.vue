<template>
  <smy-cell>
    <smy-field v-model="value" type="textarea" show-word-limit maxlength="50" placeholder="请输入" />
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
