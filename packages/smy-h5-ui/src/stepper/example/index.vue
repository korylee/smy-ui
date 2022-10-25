<template>
  <div>
    <div>默认用法</div>
    <div>
      <Stepper :value.sync="val1" :max="12" :step="0.1" :decimalPlaces="1" />
    </div>
  </div>
</template>

<script>
import Stepper from '../Stepper.vue'

export default {
  name: 'StepperExample',
  components: { Stepper },
  data: () => ({
    val1: 1,
  }),
}
</script>

<style></style>
