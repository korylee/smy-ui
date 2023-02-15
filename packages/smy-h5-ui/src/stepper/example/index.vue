<template>
  <div>
    <div>默认用法</div>
    <div>
      <Stepper v-model="val1" :max="12" :step="0.1" :decimal-places="1" />
    </div>
    <Stepper v-model="val2" :max="12" :step="1" />
    <Stepper v-model="val2" :max="12" :step="1" :simple="false" />
  </div>
</template>

<script>
import Stepper from '../Stepper.vue'

export default {
  name: 'StepperExample',
  components: { Stepper },
  data: () => ({
    val1: 1,
    val2: 1,
  }),
}
</script>

<style></style>
