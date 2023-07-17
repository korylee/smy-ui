<template>
  <div ref="root" :class="bem()" @click="$emit('click', $event)">
    <template v-if="!exceeded">{{ content }}</template>
    <template v-else>
      <template v-if="!expanded"
        >{{ ellipsis.leading
        }}<span v-if="expandText" :class="bem('text')" @click.stop="handleExpand">{{ expandText }}</span
        >{{ ellipsis.tailing }}</template
      >
      <template v-else
        >{{ content
        }}<span v-if="collapseText" :class="bem('text')" @click.stop="handleExpand">{{ collapseText }}</span></template
      >
    </template>
  </div>
</template>

<script>
import { toPxNum } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('ellipsis')

export default {
  name,
  props,
  data: () => ({
    exceeded: false,
    expanded: false,
    ellipsis: {
      leading: undefined,
      tailing: undefined,
    },
  }),
  computed: {
    actionText({ expanded, collapseText, expandText }) {
      return expanded ? collapseText : expandText
    },
  },
  created() {
    let container = null
    let maxHeight = 0
    const calcEllipsis = () => {
      if (container.offsetHeight <= maxHeight) {
        this.exceeded = false
        document.body.removeChild(container)
      } else {
        this.exceeded = true
        const end = this.content.length
        const middle = Math.floor((0 + end) / 2)
        const ellipsised = this.direction === 'middle' ? tailorMiddle([0, middle], [middle, end]) : tailor(0, end)
        this.ellipsis = ellipsised

        document.body.removeChild(container)
      }
    }
    const createContainer = () => {
      const { root } = this.$refs
      if (!root) return
      container = document.createElement('div')
      const originStyle = window.getComputedStyle(root)
      const styleNames = Array.prototype.slice.apply(originStyle)
      const containerStyle = container.style
      styleNames.forEach((name) => {
        containerStyle.setProperty(name, originStyle.getPropertyValue(name))
      })
      containerStyle.position = 'fixed'
      containerStyle.left = '9999999px'
      containerStyle.top = '9999999px'
      containerStyle.zIndex = '-10000'
      containerStyle.height = 'auto'
      containerStyle.minHeight = 'auto'
      containerStyle.maxHeight = 'auto'
      containerStyle.textOverflow = 'clip'
      containerStyle.whiteSpace = 'normal'
      containerStyle.webkitLineClamp = 'unset'
      containerStyle.display = 'block'
      const lineHeight = toPxNum(originStyle.lineHeight === 'normal' ? this.lineHeight : originStyle.lineHeight)
      maxHeight = Math.floor(
        lineHeight * (Number(this.rows) + 0.5) + toPxNum(originStyle.paddingTop) + toPxNum(originStyle.paddingBottom)
      )
      container.innerText = this.content
      document.body.appendChild(container)
      calcEllipsis()
    }
    const tailor = (left, right) => {
      const { content, symbol, actionText, direction } = this
      const isEnd = direction === 'end'
      const end = content.length
      if (right - left <= 1) {
        if (isEnd) {
          return { leading: content.slice(0, left) + symbol }
        } else {
          return { tailing: symbol + content.slice(right, end) }
        }
      }
      const middle = Math.round((left + right) / 2)
      if (isEnd) {
        container.innerText = content.slice(0, middle) + symbol + actionText
      } else {
        container.innerText = actionText + symbol + content.slice(middle, end)
      }
      if (container.offsetHeight <= maxHeight) {
        if (isEnd) return tailor(middle, right)
        return tailor(left, middle)
      } else {
        if (isEnd) return tailor(left, middle)
        return tailor(middle, right)
      }
    }
    const tailorMiddle = (leftPart, rightPart) => {
      const { content, symbol, actionText } = this
      const [leftPartStart, leftPartEnd] = leftPart
      const [rightPartStart, rightPartEnd] = rightPart
      const end = content.length

      if (leftPartEnd - leftPartStart <= 1 && rightPartEnd - rightPartStart <= 1) {
        return {
          leading: content.slice(0, leftPartStart) + symbol,
          tailing: symbol + content.slice(rightPartEnd, end),
        }
      }
      const leftPartMiddle = Math.floor((leftPartStart + leftPartEnd) / 2)
      const rightPartMiddle = Math.floor((rightPartStart + rightPartEnd) / 2)

      container.innerText =
        content.slice(0, leftPartMiddle) + symbol + actionText + symbol + content.slice(rightPartMiddle, end)
      if (container.offsetHeight <= maxHeight) {
        return tailorMiddle([leftPartMiddle, leftPartEnd], [rightPartStart, rightPartMiddle])
      }
      return tailorMiddle([leftPartStart, leftPartMiddle], [rightPartMiddle, rightPartEnd])
    }
    this.$once('hook:mounted', createContainer)
    this.$watch('content', (val, oldVal) => val != oldVal && createContainer())
  },
  methods: {
    bem,
    handleExpand() {
      this.expanded = !this.expanded
      this.$emit('change', this.expanded)
    },
  },
}
</script>

<style lang="less">
@import './ellipsis.less';
</style>
