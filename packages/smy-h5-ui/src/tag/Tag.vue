<template>
  <div :class="classes" :style="style" @click="$emit('click', $event)">
    <slot></slot>
    <Icon v-if="closeable" size="12" @click.stop="$emit('close', $event)" class="smy-tag__close"
      ><slot name="icon"><CloseSvg /></slot
    ></Icon>
  </div>
</template>

<script>
import { props } from './props'
import Icon from '../icon'
import CloseSvg from '../_icon/CloseSvg.vue'

export default {
  name: 'SmyTag',
  components: { Icon, CloseSvg },
  props,
  computed: {
    classes() {
      const prefixCls = 'smy-tag'
      return {
        [prefixCls]: true,
        [`${prefixCls}--${this.type}`]: this.type,
        [`${prefixCls}--plain`]: this.plain,
        [`${prefixCls}--round`]: this.round,
        [`${prefixCls}--mark`]: this.mark,
      }
    },
    style() {
      const style = {}
      const { textColor, color, plain } = this
      if (textColor) {
        style.color = textColor
      } else if (color && plain) {
        style.color = color
      }
      if (plain) {
        style.background = '#fff'
        style.borderColor = color
      } else if (color) {
        style.background = color
      }
      return style
    },
  },
}
</script>

<style lang="less">
@import './tag.less';
</style>
