<template>
  <div class="smy-badge smy--box">
    <transition :name="transition">
      <span v-bind="$attrs" v-show="!hidden" :style="contentStyle" :class="contentClass" class="smy-badge__content">
        <slot v-if="hasSlot('icon') && !dot" name="icon"></slot>
        <template v-else>{{ internalContent }}</template>
      </span>
    </transition>
    <slot />
  </div>
</template>
<script>
import { isNumString, isNumber } from '../_utils/is'
import { convertToUnit } from '../_utils/dom'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'

const isNum = (num) => isNumber(num) || isNumString(num)

export default {
  name: 'SmyBadge',
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

      return {
        'smy-badge__content--dot': dot,
        'smy-badge__content--bubble': !dot && bubble,
        'smy-badge__content--icon': !dot && hasSlot('icon'),
        [`smy-badge__position smy-badge--${position}`]: hasSlot(),
      }
    },
    internalContent() {
      if (this.dot) return
      const { value, max } = this
      if (isNum(value) && isNum(max)) {
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
