<template>
  <smy-cell>
    <smy-switch v-model="value" active-value="hello" inactive-value="goodbye" />
    <template #extra>{{ value }}</template>
  </smy-cell>
</template>

<script>
import { Cell as SmyCell, Switch as SmySwitch } from '@smy-h5/ui'

export default {
  components: { SmyCell, SmySwitch },
  data: () => ({
    value: 'hello',
  }),
}
</script>
