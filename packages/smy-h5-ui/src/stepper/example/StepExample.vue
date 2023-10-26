<template>
  <smy-cell>
    <smy-stepper v-model="value" :step="2" />
  </smy-cell>
</template>

<script>
import { Stepper, Cell } from '@smy-h5/ui'

export default {
  components: { SmyStepper: Stepper, SmyCell: Cell },
  data: () => ({
    value: 0,
  }),
}
</script>
