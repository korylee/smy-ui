import { convertToUnit, isNil, isString, toNumber } from '@smy-h5/shared'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { IconCache } from './utils'
import { defineComponent, h, nextTick, ref, watch } from 'vue'

import './icon.less'

const isImage = (name) => name?.includes('/')

const [name, bem] = createNamespace('icon')

export default defineComponent({
  name,
  props,
  setup(props, { slots, listeners }) {
    const shrinking = ref(false)
    const nextName = ref('')

    watch(
      () => props.name,
      (newVal, oldVal) => {
        const transition = toNumber(props.transition)
        if (oldVal == null || transition === 0) {
          nextName.value = newVal
          return
        }
        shrinking.value = true
        nextTick(() => {
          setTimeout(() => {
            oldVal != null && (nextName.value = newVal)
            shrinking.value = false
          }, transition)
        })
      },
      { immediate: true },
    )

    return () => {
      const { tag, namespace, transition, size, color } = props
      const currentName = nextName.value
      const style = {
        color,
        fontSize: convertToUnit(size),
        transitionDuration: `${toNumber(transition)}ms`,
      }
      const baseClass = bem({ shrinking: shrinking.value })
      let child = slots.default?.()
      let isImageIcon = false
      if (isNil(child) && currentName) {
        if (isString(currentName)) {
          isImageIcon = isImage(currentName)
          const icon = IconCache.resolve(currentName)
          if (icon) {
            child = h(icon)
          }
        } else {
          child = h(currentName)
        }
      }
      if (child) {
        return h(
          tag,
          {
            class: baseClass,
            style,
            on: listeners,
          },
          [child],
        )
      }
      // iconfont 字体或图片
      const addClass = namespace && currentName && !isImageIcon ? ` ${namespace}--set ${namespace}-${currentName}` : ''
      return h(
        'i',
        {
          class: baseClass + addClass,
          style,
          on: listeners,
        },
        [isImageIcon ? h('img', { attrs: { src: currentName } }) : null],
      )
    }
  },
})
