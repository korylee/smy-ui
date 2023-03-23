<template>
  <div class="smy-stepper" :class="{ 'smy-stepper--simple': simple }">
    <div
      :class="{ 'smy-stepper-grey': !minusable || disabledMinus || disabled }"
      class="smy-stepper-icon"
      @click="handleMinus"
    >
      <slot name="left-icon">
        <smy-icon><minus /></smy-icon>
      </slot>
    </div>
    <input
      :value="maxv(internal, minNum, max)"
      :min="minNum"
      :max="max"
      :readonly="readonly || !isLegal"
      type="number"
      class="smy-stepper-input"
      @focus="handleFocus"
      @keyup="handleKeyup"
      @blur="handleBlur"
      @input="handleInput"
    />
    <span
      :class="{ 'smy-stepper-grey': !plusable || disabledPlus || disabled }"
      class="smy-stepper-icon"
      @click="handlePlus"
    >
      <slot name="right-icon">
        <smy-icon><plus /></smy-icon>
      </slot>
    </span>
  </div>
</template>

<script>
import { props } from './props'
import Plus from '@smy-h5/icons/Plus'
import Minus from '@smy-h5/icons/Minus'
import SmyIcon from '../icon'

export default {
  name: 'SmyStepper',
  props,
  components: { Plus, Minus, SmyIcon },
  data: (vm) => ({
    focusing: false,
    internal: vm.value,
    minNum: vm.min,
    isLegal: true, // 是否合法
  }),
  computed: {
    minusable() {
      return (this.focusing ? this.tempNum : this.internal) - this.step >= this.min
    },
    plusable() {
      return !this.max || Number(this.internal) + this.step <= this.max
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        if (v === this.internal) return
        v = this.maxv(v, this.minNum, this.max)
        this.internal = v > 0 ? this.fixedDecimalPlaces(v) : v
        this.$emit('change', this.internal)
      },
    },
    min: {
      immediate: true,
      handler(v) {
        this.isLegal = true
        if (v < this.max) {
          this.minNum = v
        } else {
          this.isLegal = false
        }
      },
    },
    max: {
      immediate: true,
      handler(v) {
        this.isLegal = v > this.min
      },
    },
  },
  methods: {
    maxv(v, min, max) {
      if (v > max) return max
      else if (v < min) return min
      return v
    },
    fixedDecimalPlaces(v) {
      return Number(v).toFixed(this.decimalPlaces)
    },
    handleFocus(e) {
      if (this.readonly || this.isLegal || this.disabled) return
      const v = this.internal
      this.tempNum = v
      this.minNum = ''
      this.focusing = true
      this.$emit('focus', e)
    },
    handlePlus(e) {
      if (this.disabled || this.disabledPlus) return
      this.internal = Number(this.internal)
      if (this.internal <= this.max - this.step && this.max > this.minNum) {
        const [n1, n2] = this.fixedDecimalPlaces(this.internal + Number(this.step)).split('.')
        const fixedLen = n2?.length ?? 0
        this.internal = parseFloat(n1 + (n2 ? `.${n2}` : '')).toFixed(fixedLen)
        this.$emit('input', this.internal, e)
        this.$emit('plus', e)
      } else {
        this.$emit('plus-no-allow')
      }
    },
    handleMinus(e) {
      if (this.disabled || this.disabledMinus) return
      const { internal } = this
      if (internal - this.step >= this.minNum) {
        const [n1, n2] = this.fixedDecimalPlaces(internal - Number(this.step)).split('.')
        const fixedLen = n2?.length ?? 0
        this.internal = parseFloat(n1 + (n2 ? `.${n2}` : n2)).toFixed(fixedLen)

        this.$emit('input', this.internal, e)
        this.$emit('minus', e)
      } else {
        this.$emit('minus-no-allow')
      }
    },
    handleInput(e) {
      const { value } = e.target
      const v = this.maxv(value, this.minNum, this.max)
      e.target.value = v
      this.internal = v
      this.$emit('input', v, e)
      this.$emit('change', v)
    },
    handleKeyup(e) {
      const { value } = e.target
      this.focusing = false
      const v = this.maxv(value, this.minNum, this.max)
      e.target.value = v
      this.internal = v
    },
    handleBlur(e) {
      if (this.readonly || !this.isLegal || !this.disabled) {
        return this.$emit('blur', e)
      }
      const { value } = e.target.value
      this.minNum = this.min
      this.focusing = false
      const v = value ? this.maxv(value, this.minNum, this.max) : this.tempNum

      this.internal = v
      this.$emit('input', v, e)
      this.$emit('blur', e)
    },
  },
}
</script>

<style lang="less">
@import './stepper.less';
</style>
