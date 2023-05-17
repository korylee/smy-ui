<template>
  <div :style="style" class="smy-stepper">
    <div
      :class="{ 'smy-stepper__button--grey': !minusable }"
      :style="buttonStyle"
      class="smy-stepper__button"
      @click="handleMinus"
    >
      <slot name="minus">
        <smy-icon><minus /></smy-icon>
      </slot>
    </div>
    <input
      v-model="internalValue"
      :min="min"
      :max="max"
      :readonly="readonly || !isLegal"
      :disabled="disabled || !isLegal"
      v-bind="$attrs"
      type="number"
      class="smy-stepper__input"
      @input="$emit('change', $event)"
      @keyup="$emit('keyup', $event)"
      @focus="$emit('focus', $event)"
      @blur="onBlur"
    />
    <div
      :class="{ 'smy-stepper__button--grey': !plusable }"
      :style="buttonStyle"
      class="smy-stepper__button"
      @click="handlePlus"
    >
      <slot name="plus">
        <smy-icon><plus /></smy-icon>
      </slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import Plus from '@smy-h5/icons/dist/es/Plus'
import Minus from '@smy-h5/icons/dist/es/Minus'
import SmyIcon from '../icon'
import { range, toNumber } from '../_utils/shared'
import { throwError } from '../_utils/smy/warn'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { convertToUnit } from '../_utils/dom'

export default {
  name: 'SmyStepper',
  mixins: [
    createProxiedModel('value', 'internalValue', {
      transformIn: 'normalizeValue',
    }),
  ],
  props,
  components: { Plus, Minus, SmyIcon },
  computed: {
    minusable({ internalValue, step, min, disabledMinus, disabled }) {
      return internalValue - step >= min && !disabledMinus && !disabled
    },
    plusable({ max, internalValue, step, disabled, disabledPlus }) {
      return (!max || toNumber(internalValue) + toNumber(step) <= max) && !disabledPlus && !disabled
    },
    isLegal({ min, max }) {
      return min < max && min >= 0
    },
    style({ width, height }) {
      return {
        '--stepper-width': convertToUnit(width),
        '--stepper-height': convertToUnit(height),
      }
    },
    buttonStyle({ buttonWidth, buttonSize }) {
      return { width: convertToUnit(buttonWidth), fontSize: convertToUnit(buttonSize) }
    },
  },
  watch: {
    isLegal(val) {
      !val && throwError('SmyStepper', `max必须大于min!`)
    },
  },
  methods: {
    normalizeValue(value) {
      const { decimalPlaces, min, max } = this
      return toNumber(toNumber(range(toNumber(value) || min, min, max)).toFixed(decimalPlaces))
    },
    onBlur(event) {
      const value = this.normalizeValue(event.target.value)
      event.target.value = this.internalValue = value
      this.$emit('blur', event)
    },
    handlePlus(e) {
      const { plusable, step, internalValue } = this
      if (!plusable) {
        return
      }
      this.internalValue = this.normalizeValue(toNumber(internalValue) + toNumber(step))
      this.$emit('plus', e)
    },
    handleMinus(e) {
      const { internalValue, step, minusable } = this
      if (!minusable) {
        return
      }
      this.internalValue = this.normalizeValue(toNumber(internalValue) - toNumber(step))
      this.$emit('minus', e)
    },
  },
}
</script>

<style lang="less">
@import './stepper.less';
</style>
