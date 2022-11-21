<template>
  <div class="smy-switch" :style="{ fontSize }" :class="{ 'smy-switch--active': isActive }" @click="handleToggle">
    <div class="smy-switch__btn"></div>
    <div class="smy-switch__label">{{ isActive ? labelArr[0] : labelArr[1] }}</div>
  </div>
</template>

<script>
import { convertToUnit } from '../_utils/shared'
import { props } from './props'

export default {
  name: 'SmySwitch',
  props,
  computed: {
    isActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit('change', val)
        this.$emit('update:active', val)
      },
    },
    labelArr() {
      return this.label?.split?.('|') ?? []
    },
    fontSize() {
      return convertToUnit(this.size)
    },
  },
  methods: {
    handleToggle() {
      if (this.disabled) return
      this.isActive = !this.isActive
    },
  },
}
</script>

<style lang="less">
@import './switch.less';
</style>
