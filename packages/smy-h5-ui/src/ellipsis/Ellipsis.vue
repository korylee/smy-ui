<template>
  <div ref="root" :class="bem()">
    <template v-if="!exceeded">{{ content }}</template>
    <template v-else>
      <template v-if="!expanded"
        >{{ ellipsis.leading
        }}<span v-if="expandText" :class="bem('text')" @click.stop="onExpand">{{ expandText }}</span
        >{{ ellipsis.tailing }}</template
      >
      <template v-else
        >{{ content
        }}<span v-if="collapseText" :class="bem('text')" @click.stop="onExpand">{{ collapseText }}</span></template
      >
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { toPxNum } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('ellipsis')

type Ellipsis = { leading?: string; tailing?: string }

export default defineComponent({
  name,
  props,
  emits: ['change'],
  setup(props, { emit }) {
    let container: HTMLElement
    let maxHeight = 0
    const root = ref(null)
    const exceeded = ref(false)
    const expanded = ref(false)
    const ellipsis = ref<Ellipsis>({})

    const actionText = computed(() => (expanded.value ? props.collapseText : props.expandText))

    const calcEllipsis = () => {
      if (container.offsetHeight <= maxHeight) {
        exceeded.value = false
        document.body.removeChild(container)
      } else {
        exceeded.value = true
        const end = props.content.length
        const middle = Math.floor((0 + end) / 2)
        const ellipsised = props.direction === 'middle' ? tailorMiddle([0, middle], [middle, end]) : tailor(0, end)
        ellipsis.value = ellipsised

        document.body.removeChild(container)
      }
    }

    const createContainer = () => {
      if (!root.value) return
      container = document.createElement('div')
      const originStyle = window.getComputedStyle(root.value)
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
      const lineHeight = toPxNum(originStyle.lineHeight === 'normal' ? props.lineHeight : originStyle.lineHeight)
      maxHeight = Math.floor(
        lineHeight * (Number(props.rows) + 0.5) + toPxNum(originStyle.paddingTop) + toPxNum(originStyle.paddingBottom)
      )
      container.innerText = props.content
      document.body.appendChild(container)
      calcEllipsis()
    }
    const tailor = (left: number, right: number): Ellipsis => {
      const { content, symbol, direction } = props
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
        container.innerText = content.slice(0, middle) + symbol + actionText.value
      } else {
        container.innerText = actionText.value + symbol + content.slice(middle, end)
      }
      if (container.offsetHeight <= maxHeight) {
        if (isEnd) return tailor(middle, right)
        return tailor(left, middle)
      } else {
        if (isEnd) return tailor(left, middle)
        return tailor(middle, right)
      }
    }
    const tailorMiddle = (leftPart: [number, number], rightPart: [number, number]): Ellipsis => {
      const { content, symbol } = props
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
        content.slice(0, leftPartMiddle) + symbol + actionText.value + symbol + content.slice(rightPartMiddle, end)
      if (container.offsetHeight <= maxHeight) {
        return tailorMiddle([leftPartMiddle, leftPartEnd], [rightPartStart, rightPartMiddle])
      }
      return tailorMiddle([leftPartStart, leftPartMiddle], [rightPartMiddle, rightPartEnd])
    }

    const onExpand = () => {
      expanded.value = !expanded.value
      emit('change', expanded.value)
    }

    watch(
      () => props.content,
      (val, oldVal) => val !== oldVal && createContainer()
    )
    onMounted(createContainer)

    return { root, exceeded, expanded, ellipsis, actionText, bem, onExpand }
  },
})
</script>

<style lang="less">
@import './ellipsis.less';
</style>
