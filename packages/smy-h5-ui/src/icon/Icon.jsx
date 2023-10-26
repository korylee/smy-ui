import { convertToUnit, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import { SlotsMixin, getSlot } from '../_utils/vue/slots'
import { toNumber } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { isNil, isString } from '../_utils/is'
import Vue from 'vue'

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
    const { tag, name, $createElement: h, shrinking, namespace, nextName, style, $listeners, iconfont } = vm
    const defaultSlot = getSlot(this)
    const baseClass = bem({ shrinking })
    let child = defaultSlot
    let isImageIcon = false
    if (
      isNil(child) &&
      name &&
      (!isString(name) ||
        // 仅为组件
        (!(isImageIcon = isImage(name)) && !iconfont && Vue.component(name)))
    ) {
      child = h(name)
    }
    if (child) {
      return h(
        tag,
        {
          class: baseClass,
          style,
          on: $listeners,
        },
        [child]
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
      [isImageIcon ? h('img', { staticClass: bem('image'), attrs: { src: name } }) : null]
    )
  },
}
