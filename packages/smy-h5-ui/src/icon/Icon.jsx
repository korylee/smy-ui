import { convertToUnit, isNil, isString, toNumber } from '@smy-h5/shared'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { IconCache } from './utils'

import './icon.less'

const isImage = (name) => name?.includes('/')

const [name, bem] = createNamespace('icon')

export default {
  name,
  props,
  data: () => ({
    shrinking: false,
    nextName: '',
  }),
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

        this.$nextTick(() => {
          setTimeout(() => {
            oldName != null && (this.nextName = newName)
            this.shrinking = false
          }, toNumber(transition))
        })
      },
    },
  },
  render() {
    const vm = this
    const { tag, $createElement: h, shrinking, namespace, nextName, transition, size, color, $listeners } = vm
    const style = {
      color,
      fontSize: convertToUnit(size),
      transitionDuration: `${toNumber(transition)}ms`,
    }
    const defaultSlot = vm._t('default')
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
      [isImageIcon ? h('img', { attrs: { src: nextName } }) : null],
    )
  },
}
