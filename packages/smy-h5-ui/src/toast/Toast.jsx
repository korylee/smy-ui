import Popup from '../popup'
import Loading from '../loading'
import Icon from '../icon'
import { props } from './props'
import { SlotsMixin, hasSlot } from '../_utils/vue/slots'
import { assign, pick } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { getListeners } from '../_mixins/listeners'
import { popupListenerKeys, popupSharedPropKeys } from '../popup/shared'

import '../popup/popup.less'
import './toast.less'

const [name, bem] = createNamespace('toast')

export default {
  name,
  mixins: [SlotsMixin],
  props,
  watch: {
    show: {
      immediate: true,
      handler: 'updateAfterDuration',
    },
    duration: 'updateAfterDuration',
  },
  methods: {
    bem,
    onClick() {
      if (!this.closeOnClick) return
      this.$emit('update:show', false)
    },
    updateAfterDuration() {
      const { duration, show } = this
      clearTimeout(this.timer)
      if (show && duration > 0 && duration < Infinity) {
        this.timer = setTimeout(() => {
          this.$emit('update:show', false)
        }, duration)
      }
    },
  },
  render() {
    const vm = this
    const c = vm.$createElement
    const { position, wordBreak, type, icon, iconPosition, forbidClick, iconSize, loadingType, content, contentClass } =
      vm
    const hasContent = content || hasSlot.call(vm)
    const hasIcon = !!(hasSlot.call(vm, 'icon') || icon || ['loading'].includes(type))
    const toastClass = bem([
      position,
      wordBreak === 'normal' ? 'break-normal' : wordBreak,
      {
        [`icon-${hasContent ? iconPosition : 'center'}`]: hasIcon && iconPosition,
        [type]: !icon && type,
      },
    ])
    const attrs = assign(
      {
        contentClass: toastClass,
        'smy-toast-cover': '',
        wrapperClass: bem('popup', { unclickable: type === 'loading' || forbidClick }),
      },
      pick(vm, popupSharedPropKeys),
    )
    const data = vm._g(
      {
        attrs,
        on: { click: vm.onClick },
      },
      getListeners.call(vm, popupListenerKeys),
    )
    return c(Popup, data, [
      hasIcon
        ? c('div', { class: bem('icon') }, [
            hasIcon &&
              vm._t('icon', () => {
                if (icon) {
                  return c(Icon, { attrs: { name: icon, size: iconSize } })
                }
                if (type === 'loading') {
                  return c(Loading, { attrs: { type: loadingType, size: iconSize } })
                }
              }),
          ])
        : null,
      hasContent
        ? c(
            'div',
            { class: [bem('content'), contentClass] },
            vm._t('default', () => [c('span', { domProps: { innerHTML: vm._s(content) } })]),
          )
        : null,
    ])
  },
}
