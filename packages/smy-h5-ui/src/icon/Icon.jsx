import { convertToUnit, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import { SlotsMixin, getSlot } from '../_utils/vue/slots'
import { toNumber } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { isNil, isString } from '../_utils/is'
import { IconCache } from './utils'

import './icon.less'

const isImage = (name) => name?.includes('/')

const [name, bem] = createNamespace('icon')

export default {
  name,
  props,
  mixins: [SlotsMixin],
  data: () => ({
    shrinking: false,
    nextName: '',
  }),
  computed: {
    style({ transition, size, color, shrinking }) {
      return {
        color,
        fontSize: convertToUnit(size),
        transitionDuration: shrinking ? `${toNumber(transition)}ms` : undefined,
      }
    },
  },
  watch: {
    name: {
      immediate: true,
      handler(newName, oldName) {
        const { transition } = this
        if (oldName == null || toNumber(transition) === 0) {
          this.nextName = newName
          return
        }

        this.shrinking = true
        setTimeout(() => {
          requestAnimationFrame(() => {
            oldName != null && (this.nextName = newName)
            this.shrinking = false
          })
        }, toNumber(transition))
      },
    },
  },
  render() {
    const vm = this
    const { tag, $createElement: h, shrinking, namespace, nextName, style, $listeners } = vm
    const defaultSlot = getSlot(this)
    const baseClass = bem({ shrinking })
    let child = defaultSlot
    let isImageIcon = false
    if (isNil(child) && nextName) {
      if (isString(nextName)) {
        isImageIcon = isImage(nextName)
        const icon = IconCache.resolve(nextName)
        if (icon) {
          child = h(icon)
        }
      } else {
        child = h(nextName)
      }
    }
    if (child) {
      return h(
        tag,
        {
          class: baseClass,
          style,
          on: $listeners,
        },
        [child],
      )
    }
    // iconfont 字体或图片
    const addClass = namespace && nextName && !isImageIcon ? ` ${namespace}--set ${namespace}-${nextName}` : ''
    return h(
      'i',
      {
        class: baseClass + addClass,
        style,
        on: $listeners,
      },
      [isImageIcon ? h('img', { staticClass: bem('image'), attrs: { src: nextName } }) : null],
    )
  },
}
