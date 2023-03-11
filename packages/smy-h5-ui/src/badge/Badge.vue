<template>
  <div class="smy-badge">
    <div v-show="!hidden && !dot && hasSlots('icon')" :style="style" class="smy-badge__icon">
      <slot name="icon"></slot>
    </div>
    <slot></slot>
    <div
      v-show="!hidden && (internalContent || dot)"
      v-text="internalContent"
      :style="style"
      :class="{
        'smy-badge__content--dot': dot,
        'smy-badge__content--bubble': !dot && bubble,
      }"
      class="smy-badge__content smy-badge__content--sup"
    ></div>
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
  mixins: [SlotsMixin],
  props,
  computed: {
    style({ zIndex, color }) {
      return {
        top: convertToUnit(this.top),
        right: convertToUnit(this.right),
        zIndex,
        background: color,
      }
    },
    internalContent() {
      if (this.dot) return
      const { content, max } = this
      if (isNum(content) && isNum(max)) {
        return max < +content ? `${max}+` : content
      }
      return content
    },
  },
}
</script>

<style lang="less">
@import './badge.less';
</style>
