<template>
  <smy-cell>
    <smy-switch v-model="active" size="12" />
    <smy-switch v-model="active" size="16" />
    <smy-switch v-model="active" size="20" />
    <smy-switch v-model="active" size="26" />
    <smy-switch v-model="active" size="32" />
  </smy-cell>
</template>

<script>
import { Cell as SmyCell, Switch as SmySwitch } from '@smy-h5/ui'

export default {
  components: { SmyCell, SmySwitch },
  data: () => ({
    active: false,
  }),
}
</script>
