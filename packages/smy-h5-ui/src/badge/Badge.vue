<template>
  <div class="smy-badge smy--box">
    <transition :name="transition">
      <span
        v-bind="$attrs"
        v-on="$listeners"
        v-show="!hidden"
        :style="contentStyle"
        :class="contentClass"
        class="smy-badge__content"
      >
        <slot v-if="hasSlot('icon') && !dot" name="icon"></slot>
        <template v-else>{{ internalContent }}</template>
      </span>
    </transition>
    <slot />
  </div>
</template>
<script>
import { isNumeric } from '../_utils/is'
import { convertToUnit } from '../_utils/dom'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('badge')

export default {
  name,
  inheritAttrs: false,
  mixins: [SlotsMixin],
  props,
  computed: {
    contentStyle({ zIndex, color }) {
      return {
        top: convertToUnit(this.top),
        right: convertToUnit(this.right),
        zIndex,
        background: color,
      }
    },
    contentClass() {
      const { dot, bubble, position, hasSlot } = this

      const hasDefaultSlot = hasSlot()
      return bem('content', {
        dot,
        bubble: !dot && bubble,
        icon: !dot && hasSlot('icon'),
        fixed: hasDefaultSlot,
        [position]: position && hasDefaultSlot,
      })
    },
    internalContent() {
      if (this.dot) return
      const { value, max } = this
      if (isNumeric(value) && isNumeric(max)) {
        return max < +value ? `${max}+` : value
      }
      return value
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './badge.less';
</style>
