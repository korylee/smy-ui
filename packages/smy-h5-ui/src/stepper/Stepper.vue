<template>
  <div class="smy-stepper" :class="{ 'smy-stepper--simple': simple }">
    <div :class="{ 'smy-stepper-grey': !minusable || disabled }" class="smy-stepper-icon" @click="handleMinus">
      <MinusSvg />
    </div>
    <input
      :value="maxv(intervalValue, minNum, max)"
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
    <span :class="{ 'smy-stepper-grey': !plusable || disabled }" class="smy-stepper-icon" @click="handlePlus">
      <PlusSvg />
    </span>
  </div>
</template>

<script>
import { props } from './props'
import MinusSvg from '../_icon/MinusSvg.vue'
import PlusSvg from '../_icon/PlusSvg.vue'

export default {
  name: 'SmyStepper',
  props,
  components: { MinusSvg, PlusSvg },
  data: (vm) => ({
    focusing: false,
    intervalValue: vm.value,
    minNum: vm.min,
    isLegal: true, // 是否合法
  }),
  computed: {
    minusable() {
      return (this.focusing ? this.tempNum : this.intervalValue) - this.step >= this.min
    },
    plusable() {
      return !this.max || Number(this.intervalValue) + this.step <= this.max
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        if (v === this.intervalValue) return
        v = this.maxv(v, this.minNum, this.max)
        this.intervalValue = v > 0 ? this.fixedDecimalPlaces(v) : v
        this.$emit('change', this.intervalValue)
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
      const v = this.intervalValue
      this.tempNum = v
      this.minNum = ''
      this.focusing = true
      this.$emit('focus', e, this.intervalValue)
    },
    handlePlus() {
      if (this.disabled) return
      this.intervalValue = Number(this.intervalValue)
      if (this.intervalValue <= this.max - this.step && this.max > this.minNum) {
        const [n1, n2] = this.fixedDecimalPlaces(this.intervalValue + Number(this.step)).split('.')
        const fixedLen = n2?.length ?? 0
        this.intervalValue = parseFloat(n1 + (n2 ? `.${n2}` : '')).toFixed(fixedLen)
        this.$emit('update:value', this.intervalValue)
        this.$emit('plus', this.intervalValue)
      } else {
        this.$emit('plus-no-allow')
      }
    },
    handleMinus() {
      if (this.disabled) return
      const { intervalValue } = this
      if (intervalValue - this.step >= this.minNum) {
        const [n1, n2] = this.fixedDecimalPlaces(intervalValue - Number(this.step)).split('.')
        const fixedLen = n2?.length ?? 0
        this.intervalValue = parseFloat(n1 + (n2 ? `.${n2}` : n2)).toFixed(fixedLen)

        this.$emit('update:value', this.intervalValue)
        this.$emit('minus', this.intervalValue)
      } else {
        this.$emit('minus-no-allow')
      }
    },
    handleInput(e) {
      const { value } = e.target
      const v = this.maxv(value, this.minNum, this.max)
      e.target.value = v
      this.intervalValue = v
      this.$emit('update:value', v)
      this.$emit('change', v)
    },
    handleKeyup(e) {
      const { value } = e.target
      this.focusing = false
      const v = this.maxv(value, this.minNum, this.max)
      e.target.value = v
      this.intervalValue = v
    },
    handleBlur(e) {
      if (this.readonly || !this.isLegal || !this.disabled) {
        return this.$emit('blur', e, this.intervalValue)
      }
      const { value } = e.target.value
      this.minNum = this.min
      this.focusing = false
      const v = value ? this.maxv(value, this.minNum, this.max) : this.tempNum

      this.intervalValue = v
      this.$emit('update:value', v)
      this.$emit('blur', v)
    },
  },
}
</script>

<style lang="less">
@import './stepper.less';
</style>
