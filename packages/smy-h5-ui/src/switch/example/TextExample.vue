<template>
  <smy-cell>
    <smy-switch v-model="value" style="width: 38px" inactive-label="关" active-label="开" />
    <smy-switch v-model="value" style="width: 50px" inactive-label="OFF" active-label="ON" />
  </smy-cell>
</template>

<script>
import { Cell as SmyCell, Switch as SmySwitch } from '@smy-h5/ui'

export default {
  components: { SmyCell, SmySwitch },
  data: () => ({
    value: false,
  }),
}
</script>
