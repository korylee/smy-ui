import { convertToUnit, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import { SlotsMixin, getSlot } from '../_utils/vue/slots'
import { toNumber } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { get as getIcon } from './utils'
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
    style({ transition, size, color }) {
      return {
        color,
        fontSize: convertToUnit(size),
        transition: `transform ${toNumber(transition)}ms`,
      }
    },
  },
  watch: {
    name: {
      immediate: true,
      handler(newName, oldName) {
        if (oldName == null || toNumber(this.transition) === 0) {
          this.nextName = newName
          return
        }

        this.shrinking = true
        setTimeout(() => {
          requestAnimationFrame(() => {
            oldName != null && (this.nextName = newName)
            this.shrinking = false
          })
        }, toNumber(this.transition))
      },
    },
  },
  render() {
    const { tag, name, $createElement: h, shrinking, namespace, nextName, style, $listeners } = this
    const defaultSlot = getSlot(this)
    const CachedIconComponent = getIcon(name)
    const baseClass = bem({ shrinking })
    // iconfont 字体或图片
    if (!defaultSlot && name && !CachedIconComponent) {
      const isImageIcon = isImage(nextName)
      const addClass = namespace && nextName && !isImageIcon ? ` ${namespace}--set ${namespace}-${nextName}` : ''
      return h(
        'i',
        {
          class: baseClass + addClass,
          style,
          on: $listeners,
        },
        [isImageIcon ? h('img', { staticClass: bem('image'), attrs: { src: name } }) : null]
      )
    }

    const child = defaultSlot ?? (CachedIconComponent ? h(CachedIconComponent) : null)
    if (!child) return null

    // 组件
    return h(
      tag,
      {
        class: baseClass,
        style,
        on: $listeners,
      },
      [child]
    )
  },
}
