<template>
  <smy-cell>
    <smy-stepper v-model="value" width="200" height="40" button-width="40" button-size="30" />
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
