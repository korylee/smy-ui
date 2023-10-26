<template>
  <smy-cell>
    <smy-stepper v-model="value" :minus-icon="ArrowLeft" :plus-icon="ArrowRight" />
  </smy-cell>
</template>

<script>
import { Stepper, Cell } from '@smy-h5/ui'
import { ArrowLeft, ArrowRight } from '@smy-h5/icons'

export default {
  components: { SmyStepper: Stepper, SmyCell: Cell },
  data: () => ({
    value: 0,
  }),
  computed: {
    // 避免在data中添加响应式
    ArrowLeft: () => ArrowLeft,
    ArrowRight: () => ArrowRight,
  },
}
</script>
