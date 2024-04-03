<template>
  <div :class="bem(['$--box'])">
    <transition :name="transition">
      <span v-bind="$attrs" v-on="$listeners" v-show="!hidden" :style="contentStyle" :class="contentClass">
        <slot v-if="!dot" name="icon">{{ content }}</slot>
      </span>
    </transition>
    <slot />
  </div>
</template>
<script>
import { convertToUnit } from '@smy-h5/shared'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { normalizeBadge } from './utils'

const [name, bem] = createNamespace('badge')

const getMinusOffset = (val) => {
  val = String(val)
  return val.startsWith('-') ? val.replace('-', '') : `-${val}`
}

export default {
  name,
  inheritAttrs: false,
  mixins: [SlotsMixin],
  props,
  computed: {
    contentStyle({ color, offset, position, hasSlot }) {
      const style = { background: color }

      if (offset) {
        const [x = 0, y = 0] = offset
        if (hasSlot()) {
          const [offsetY, offsetX] = position.split('-')
          style[offsetX] = offsetX === 'left' ? convertToUnit(x) : convertToUnit(getMinusOffset(x))
          style[offsetY] = offsetY === 'top' ? convertToUnit(y) : convertToUnit(getMinusOffset(y))
        } else {
          style.marginLeft = convertToUnit(x)
          style.marginTop = convertToUnit(y)
        }
      }
      return style
    },
    contentClass({ bubble, position, hasSlot, value, dot: _dot }) {
      const fixed = hasSlot()
      const hasIconSlot = hasSlot('icon')
      const dot = _dot || (!value && !hasIconSlot)

      return bem('content', {
        dot,
        bubble: !dot && bubble,
        icon: hasIconSlot,
        fixed,
        [position]: position && fixed,
      })
    },
    content({ max, value }) {
      return normalizeBadge(value, max)
    },
  },
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './badge.less';
</style>
