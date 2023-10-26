<template>
  <smy-cell>
    <smy-stepper v-model="value" min="10" max="20" />
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
