<template>
  <transition name="smy-fade">
    <div v-if="errorMessage || extraMessage || hasSlot('error-message') || hasSlot('extra-message')" :class="bem()">
      <div :class="bem('error-message')">
        <slot name="error-message">
          <transition name="smy-fade">
            <div v-if="errorMessage">{{ errorMessage }}</div>
          </transition>
        </slot>
      </div>
      <div :class="bem('extra-message')">
        <slot name="extra-message">
          <transition name="smy-fade">
            <div v-if="extraMessage">{{ extraMessage }}</div>
          </transition>
        </slot>
      </div>
    </div>
  </transition>
</template>
<script>
import { SlotsMixin } from '../_mixins/slots'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('form-details')

export default {
  name,
  props,
  mixins: [SlotsMixin],
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import '../_styles/transition.less';
@import './formDetails.less';
</style>
