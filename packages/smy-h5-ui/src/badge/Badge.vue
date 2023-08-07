<template>
  <div class="smy-badge smy--box">
    <transition :name="transition">
      <span v-bind="$attrs" v-show="!hidden" :style="contentStyle" :class="contentClass">
        <slot v-if="$slots.icon && !dot" name="icon"></slot>
        <template v-else>{{ internalContent }}</template>
      </span>
    </transition>
    <slot />
  </div>
</template>
<script lang="ts">
import { isNumeric } from '../_utils/is'
import { convertToUnit } from '../_utils/dom'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { computed, defineComponent } from 'vue'

const [name, bem] = createNamespace('badge')

export default defineComponent({
  name,
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const contentClass = computed(() => {
      const { dot, position, bubble } = props
      return bem('content', {
        dot,
        bubble: !dot && bubble,
        icon: !dot && slots.icon,
        fixed: slots.default,
        [position]: position && slots.default,
      })
    })
    const internalContent = computed(() => {
      const { value, max, dot } = props
      if (dot) return
      if (isNumeric(value) && isNumeric(max)) {
        return +max < +value ? `${max}+` : value
      }
      return value
    })
    const contentStyle = computed(() => {
      const { top, right, zIndex, color } = props
      return {
        top: convertToUnit(top),
        right: convertToUnit(right),
        zIndex,
        background: color,
      }
    })

    return {
      contentClass,
      contentStyle,
      internalContent,
    }
  },
})
</script>

<style lang="less">
@import '../_styles/common.less';
@import './badge.less';
</style>
