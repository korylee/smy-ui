<template>
  <div :style="style" :class="bem({ [isActive ? 'active' : 'inactive']: true, disabled })" @click="handleToggle">
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
import { computed, defineComponent } from 'vue'

const [name, bem] = createNamespace('switch')

export default defineComponent({
  name,
  components: { SmyProgressCircular },
  props,
  setup(props, { emit }) {
    const isActive = computed(() => props.modelValue === props.activeValue)
    const style = computed(() => {
      const { size, activeColor, inactiveColor } = props
      return {
        fontSize: convertToUnit(size),
        '--switch-color-active': activeColor,
        '--switch-color-inactive': inactiveColor,
      }
    })

    function handleToggle(e) {
      if (props.isStopPropagation) e.stopPropagation()
      if (props.disabled) return
      const value = isActive.value ? props.inactiveValue : props.activeValue
      emit('update:modelValue', value)
    }
    return { isActive, style, bem, handleToggle }
  },
})
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../progress-circular/progressCircular.less';
@import './switch.less';
</style>
