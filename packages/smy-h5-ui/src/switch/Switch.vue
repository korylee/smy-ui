<template>
  <div :style="style" :class="classes" @click="handleToggle">
    <div class="smy-switch__thumb">
      <slot v-if="loading" name="loading">
        <smy-progress-circular
          :color="loadingColor"
          :size="loadingSize"
          indeterminate
          width="1"
          class="smy-switch__thumb-loading"
        />
      </slot>
    </div>
    <div v-if="activeLabel" class="smy-switch__label smy-switch__label--open">{{ activeLabel }}</div>
    <div v-if="inactiveLabel" class="smy-switch__label smy-switch__label--close">{{ inactiveLabel }}</div>
  </div>
</template>

<script>
import { convertToUnit } from '../_utils/dom'
import { props } from './props'
import SmyProgressCircular from '../progress-circular'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('switch')

export default {
  name,
  components: { SmyProgressCircular },
  model: {
    prop: 'value',
    event: 'change',
  },
  props,
  computed: {
    isActive({ value, activeValue }) {
      return value === activeValue
    },
    classes({ isActive, disabled }) {
      return bem({ [isActive ? 'active' : 'inactive']: true, disabled })
    },
    style({ size, activeColor, inactiveColor }) {
      return {
        fontSize: convertToUnit(size),
        '--switch-color-active': activeColor,
        '--switch-color-inactive': inactiveColor,
      }
    },
  },
  methods: {
    handleToggle(e) {
      if (this.isStopPropagation) e.stopPropagation()
      if (this.disabled) return
      this.$emit('change', this.isActive ? this.inactiveValue : this.activeValue)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../progress-circular/progressCircular.less';
@import './switch.less';
</style>
