<template>
  <div :style="style" :class="bem({ [isActive ? 'active' : 'inactive']: true, disabled })" @click="handleToggle">
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
    <div v-if="activeLabel" :class="bem('label', 'open')">{{ activeLabel }}</div>
    <div v-if="inactiveLabel" :class="bem('label', 'close')">{{ inactiveLabel }}</div>
  </div>
</template>

<script>
import { convertToUnit } from '../_utils/dom'
import { props } from './props'
import SmyProgressCircular from '../progress-circular'
import { createNamespace } from '../_utils/vue/create'
import { computed } from 'vue'

const [name, bem] = createNamespace('switch')

export default {
  name,
  components: { SmyProgressCircular },
  props,
  setup(props, { emit }) {
    const isActive = computed(() => props.modelValue === props.activeValue)

    function handleToggle(e) {
      if (props.isStopPropagation) e.stopPropagation()
      if (props.disabled) return
      const value = isActive.value ? props.inactiveValue : props.activeValue
      emit('update:modelValue', value)
    }
    return { isActive, bem, handleToggle }
  },
  computed: {
    style({ size, activeColor, inactiveColor }) {
      return {
        fontSize: convertToUnit(size),
        '--switch-color-active': activeColor,
        '--switch-color-inactive': inactiveColor,
      }
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../progress-circular/progressCircular.less';
@import './switch.less';
</style>
