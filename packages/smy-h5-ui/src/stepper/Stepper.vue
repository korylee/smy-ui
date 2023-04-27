<template>
  <div class="smy-stepper" :class="{ 'smy-stepper--simple': simple }">
    <div :class="{ 'smy-stepper__icon--grey': !minusable }" class="smy-stepper__icon" @click="handleMinus">
      <slot name="left-icon">
        <smy-icon><minus /></smy-icon>
      </slot>
    </div>
    <input
      :value="range(internalValue, min, max)"
      :min="min"
      :max="max"
      :readonly="readonly || !isLegal"
      type="number"
      class="smy-stepper__input"
      @focus="handleFocus"
      @keyup="handleKeyup"
      @blur="handleBlur"
      @input="handleInput"
    />
    <span :class="{ 'smy-stepper__icon--grey': !plusable }" class="smy-stepper__icon" @click="handlePlus">
      <slot name="right-icon">
        <smy-icon><plus /></smy-icon>
      </slot>
    </span>
  </div>
</template>

<script>
import { props } from './props'
import Plus from '@smy-h5/icons/dist/es/Plus'
import Minus from '@smy-h5/icons/dist/es/Minus'
import SmyIcon from '../icon'
import { range, toNumber } from '../_utils/shared'
import { throwError } from '../_utils/smy/warn'

export default {
  name: 'SmyStepper',
  props,
  components: { Plus, Minus, SmyIcon },
  data: (vm) => ({
    internalValue: vm.value,
  }),
  computed: {
    minusable({ internalValue, step, min, disabledMinus, disabled }) {
      return internalValue - step >= min && !disabledMinus && !disabled
    },
    plusable({ max, internalValue, step, disabled, disabledPlus }) {
      return (!max || toNumber(internalValue) + step <= max) && !disabledPlus && !disabled
    },
    isLegal({ min, max }) {
      return min < max
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        const { min, max, internalValue } = this
        v = range(v, min, max)
        if (v === internalValue) return
        const value = (this.internalValue = v > 0 ? this.fixedDecimalPlaces(v) : v)
        this.$emit('change', value)
        this.$emit('input', value)
      },
    },
    isLegal(val) {
      !val && throwError('SmyStepper', `max必须大于min!`)
    },
  },
  methods: {
    range,
    fixedDecimalPlaces(v) {
      return toNumber(v).toFixed(this.decimalPlaces)
    },
    handleFocus(e) {
      const { readonly, isLegal, disabled } = this
      if (readonly || !isLegal || disabled) return
      this.$emit('focus', e)
    },
    handlePlus(e) {
      const { plusable, step, internalValue } = this
      if (!plusable) {
        return
      }
      const [n1, n2] = this.fixedDecimalPlaces(toNumber(internalValue) + step).split('.')
      const fixedLen = n2?.length ?? 0
      this.internalValue = parseFloat(n1 + (n2 ? `.${n2}` : '')).toFixed(fixedLen)
      this.$emit('input', this.internalValue)
      this.$emit('plus', e)
    },
    handleMinus(e) {
      const { internalValue, step, minusable } = this
      if (!minusable) {
        return
      }
      const [n1, n2] = this.fixedDecimalPlaces(internalValue - toNumber(step)).split('.')
      const fixedLen = n2?.length ?? 0
      this.internalValue = parseFloat(n1 + (n2 ? `.${n2}` : n2)).toFixed(fixedLen)

      this.$emit('input', this.internalValue)
      this.$emit('minus', e)
    },
    handleInput(e) {
      const { value } = e.target
      const v = range(value, this.min, this.max)
      e.target.value = v
      this.internalValue = v
      this.$emit('input', v)
      this.$emit('change', v)
    },
    handleKeyup(e) {
      const { value } = e.target
      const v = range(value, this.min, this.max)
      e.target.value = v
      this.internalValue = v
    },
    handleBlur(e) {
      const { readonly, isLegal, disabled, min, max } = this
      if (readonly || !isLegal || disabled) {
        return
      }
      const { value } = e.target
      const v = value ? range(value, min, max) : min

      this.internalValue = v
      this.$emit('input', v)
      this.$emit('blur', e)
    },
  },
}
</script>

<style lang="less">
@import './stepper.less';
</style>
