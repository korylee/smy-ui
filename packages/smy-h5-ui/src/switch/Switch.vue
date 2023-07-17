<template>
  <div
    :style="style"
    :class="bem({ [isActive ? 'active' : 'inactive']: true, disabled })"
    :tabindex="disabled ? undefined : 0"
    :aria-checked="isActive"
    role="switch"
    @click="handleToggle"
  >
    <div :class="bem('thumb')">
      <slot v-if="loading" name="loading">
        <smy-progress-circular
          :color="loadingColor"
          :size="loadingSize"
          :class="bem('thumb-loading')"
          indeterminate
          width="1"
        />
      </slot>
    </div>
    <div v-if="activeLabel" :class="bem('label', 'open')">{{ activeLabel }}</div>
    <div v-if="inactiveLabel" :class="bem('label', 'close')">{{ inactiveLabel }}</div>
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
    style({ size, activeColor, inactiveColor }) {
      return {
        fontSize: convertToUnit(size),
        '--switch-color-active': activeColor,
        '--switch-color-inactive': inactiveColor,
      }
    },
  },
  methods: {
    bem,
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
