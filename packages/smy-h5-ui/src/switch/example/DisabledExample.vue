<template>
  <smy-cell>
    <smy-switch :value="true" disabled />
    <smy-switch :value="false" disabled />
  </smy-cell>
</template>

<script>
import { Cell as SmyCell, Switch as SmySwitch } from '@smy-h5/ui'

export default {
  components: { SmyCell, SmySwitch },
}
</script>
