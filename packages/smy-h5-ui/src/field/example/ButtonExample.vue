<template>
  <smy-cell>
    <smy-field v-model="value" placeholder="请输入">
      <template #button><button>发送验证码</button></template>
    </smy-field>
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
