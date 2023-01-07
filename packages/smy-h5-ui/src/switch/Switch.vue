<template>
  <div class="smy-switch" :style="style" :class="classes" @click="handleToggle">
    <div class="smy-switch__btn">
      <slot v-if="loading" name="loading">
        <smy-loading :color="loadingColor" :size="loadingSize" class="smy-switch__btn-loading" />
      </slot>
    </div>
    <div class="smy-switch__label" :class="`smy-switch__label--${isActive ? 'open' : 'close'}`">
      {{ isActive ? activeLabel : inactiveLabel }}
    </div>
  </div>
</template>

<script>
import { convertToUnit } from '../_utils/shared'
import { props } from './props'
import SmyLoading from '../loading'

export default {
  name: 'SmySwitch',
  components: { SmyLoading },
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  computed: {
    isActive: {
      get() {
        return this.value === this.activeValue
      },
      set(val) {
        this.$emit('change', val)
        this.$emit('update:value', val)
      },
    },
    fontSize() {
      return convertToUnit(this.size)
    },
    classes({ isActive, disabled }) {
      return {
        [`smy-switch--${isActive ? 'active' : 'inactive'}`]: true,
        'smy-switch--disabled': disabled,
      }
    },
    style({ fontSize, isActive, activeColor, inactiveColor }) {
      return {
        fontSize,
        backgroundColor: isActive ? activeColor : inactiveColor,
      }
    },
  },
  methods: {
    handleToggle() {
      if (this.disabled || this.loading) return
      this.isActive = this.isActive ? this.inactiveValue : this.activeValue
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../loading/loading.less';
@import './switch.less';
</style>
