<template>
  <div :style="style" :class="bem()">
    <div
      v-show="showMinus"
      :class="bem('minus', { disabled: !minusable })"
      type="button"
      :aira-disabled="!minusable || undefined"
      @click.prevent="onStep('minus', $event)"
      @touchstart.passive="onTouchStart('minus', $event)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="minus-icon"> <smy-icon :name="minusIcon" /></slot>
    </div>
    <input
      ref="input"
      v-show="showInput"
      :value="modelValue"
      :aria-valuemax="max"
      :aria-valuemin="min"
      :aria-valuenow="modelValue"
      :readonly="readonly || !isLegal"
      :disabled="disabled || !isLegal"
      :class="bem('input')"
      :placeholder="placeholder"
      :type="integer ? 'tel' : 'text'"
      :inputmode="integer ? 'numeric' : 'decimal'"
      role="spinbutton"
      v-bind="$attrs"
      @input="onInput"
      @keyup="$emit('keyup', $event)"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div
      v-show="showPlus"
      :class="bem('plus', { disabled: !plusable })"
      type="button"
      :aira-disabled="!plusable || undefined"
      @click.prevent="onStep('plus', $event)"
      @touchstart.passive="onTouchStart('plus', $event)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="plus-icon"> <smy-icon :name="plusIcon" /> </slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import SmyIcon from '../icon'
import { throwError } from '../_utils/smy/warn'
import { createNamespace } from '../_utils/vue/create'
import {
  isNil,
  range,
  toNumber,
  formatNumber,
  decimal,
  convertToUnit,
  preventDefault,
  resetScroll,
} from '@smy-h5/shared'

const [name, bem] = createNamespace('stepper')

const LONG_PRESS_INTERVAL = 200

const isEqualString = (a, b) => String(a) === String(b)

export default {
  name,
  props,
  components: { SmyIcon },
  data: (vm) => {
    const defaultValue = vm.value
    const modelValue = vm.format(defaultValue)
    return {
      modelValue,
    }
  },
  computed: {
    minusable({ modelValue, step, min, disabledMinus, disabled }) {
      return modelValue - step >= min && !disabledMinus && !disabled
    },
    plusable({ max, modelValue, step, disabled, disabledPlus }) {
      return (!max || toNumber(modelValue) + toNumber(step) <= max) && !disabledPlus && !disabled
    },
    isLegal({ min, max }) {
      return min < max && min >= 0
    },
    style({ width, height, buttonSize, buttonWidth }) {
      return {
        '--stepper-width': convertToUnit(width),
        '--stepper-height': convertToUnit(height),
        '--stepper-button-font-size': convertToUnit(buttonSize),
        '--stepper-button-width': convertToUnit(buttonWidth),
      }
    },
  },
  watch: {
    isLegal(val) {
      !val && throwError(name, `max必须大于min!`)
    },
    value(value) {
      if (!isEqualString(value, this.modelValue)) {
        this.modelValue = this.format(value)
      }
    },
    modelValue: {
      handler(value) {
        this.$emit('input', value)
      },
      immediate: true,
    },
  },
  methods: {
    bem,
    format(value) {
      const { decimalPlaces, min, max, allowEmpty, integer } = this
      if (allowEmpty && value === '') {
        return value
      }
      value = formatNumber(String(value), !integer)
      value = value === '' ? 0 : toNumber(value, +min)
      value = range(value, +min, +max)
      value = isNil(decimalPlaces) || !value ? value : value.toFixed(+decimalPlaces)

      return value
    },

    onFocus(event) {
      const { readonly } = this
      const { target } = event
      readonly ? target.blur() : this.$emit('focus', event)
    },

    onBlur(event) {
      const { target } = event
      const value = this.format(target.value)
      target.value = String(value)
      this.modelValue = value
      this.$nextTick(() => {
        this.$emit('blur', event)
        resetScroll()
      })
    },
    onStep(type, event) {
      const { plusable, minusable, step, modelValue } = this
      if ((type === 'plus' && !plusable) || (type === 'minus' && !minusable)) {
        this.$emit('overlimit', type)
        return
      }
      const operate = type === 'minus' ? 'subtract' : 'add'
      const value = this.format(decimal[operate](+modelValue, +step))
      this.modelValue = value
      this.$emit(type, event)
    },
    onInput(event) {
      const { target } = event
      const { value } = target
      const { integer } = this
      const formatted = formatNumber(String(value), !integer)

      if (!isEqualString(value, formatted)) {
        input.value = formatted
      }
      this.modelValue = formatted
      this.$emit('change', event)
    },
    onTouchStart(type, event) {
      if (!this.longPress) return
      const longPressStep = () => {
        this.isLongPress = false
        clearTimeout(this.longPressTimer)
        this.longPressTimer = setTimeout(() => {
          this.isLongPress = true
          this.onStep(type, event)
          longPressStep()
        }, LONG_PRESS_INTERVAL)
      }
      longPressStep()
    },
    onTouchEnd(event) {
      if (!this.longPress) return
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
      this.isLongPress && preventDefault(event)
    },
  },
}
</script>

<style lang="less">
@import './stepper.less';
</style>
