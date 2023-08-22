<template>
  <div :style="style" :class="bem()">
    <div
      :style="buttonStyle"
      :class="bem('button', { disabled: !minusable })"
      @click.prevent="onMinusOrPlus('minus', $event)"
      @touchstart.passive="onTouchStart('minus', $event)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="minus">
        <smy-icon><minus /></smy-icon>
      </slot>
    </div>
    <input
      :value="internalValue"
      :min="min"
      :max="max"
      :readonly="readonly || !isLegal"
      :disabled="disabled || !isLegal"
      :class="bem('input')"
      :placeholder="placeholder"
      v-bind="$attrs"
      type="number"
      @input="onInput"
      @keyup="$emit('keyup', $event)"
      @focus="$emit('focus', $event)"
      @blur="onBlur"
    />
    <div
      :class="bem('button', { disabled: !plusable })"
      :style="buttonStyle"
      @click.prevent="onMinusOrPlus('plus', $event)"
      @touchstart.passive="onTouchStart('plus', $event)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
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
import { range, toNumber, formatNumber } from '../_utils/shared'
import { throwError } from '../_utils/smy/warn'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { convertToUnit, preventDefault } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('stepper')

const LONG_PRESS_INTERVAL = 200

export default {
  name,
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
      !val && throwError(name, `max必须大于min!`)
    },
  },
  methods: {
    bem,
    normalizeValue(value) {
      const { decimalPlaces, min, max } = this
      return toNumber(toNumber(range(toNumber(value) || min, min, max)).toFixed(decimalPlaces))
    },
    onBlur(event) {
      const { target } = event
      const formatted = this.normalizeValue(formatNumber(String(target.value)))
      target.value = this.internalValue = formatted
      this.$emit('blur', event)
    },
    onMinusOrPlus(type, event) {
      const { plusable, minusable, step, internalValue } = this
      if ((type === 'plus' && !plusable) || (type === 'minus' && !minusable)) {
        this.$emit('overlimit', type)
        return
      }
      const diff = type === 'minus' ? -step : +step
      const value = this.normalizeValue(internalValue + diff)
      this.internalValue = value
      this.$emit(type, event)
    },
    onInput(event) {
      const { target } = event
      const formatted = this.normalizeValue(formatNumber(String(target.value)))
      this.$emit('change', event)
      this.internalValue = target.value = formatted
    },
    onTouchStart(type, event) {
      if (!this.longPress) return
      const longPressStep = () => {
        this.isLongPress = false
        clearTimeout(this.longPressTimer)
        this.longPressTimer = setTimeout(() => {
          this.isLongPress = true
          this.onMinusOrPlus(type, event)
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
