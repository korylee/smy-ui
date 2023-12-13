import { checkerProps } from './props'
import SmyIcon from '../icon'
import Check from '@smy-h5/icons/dist/es/Check'
import Minus from '@smy-h5/icons/dist/es/Minus'
import { convertToUnit } from '../_utils/dom'
import { hasSlot } from '../_utils/vue/slots'

export default {
  name: 'InternalChecker',
  props: checkerProps,
  computed: {
    _disabled({ disabled }) {
      return disabled
    },
  },
  methods: {
    onClick(event) {
      const { _disabled } = this
      const { target } = event
      const { icon } = this.$refs
      const iconClicked = icon === target || icon?.contains(target)
      if (!_disabled && iconClicked) {
        this.$emit('toggle')
      }
      this.$emit('click', event)
    },
    renderIcon() {
      const vm = this
      const c = vm.$createElement
      const { size: iconSize, indeterminate, shape, bem, checked, role, color, _disabled: disabled } = vm
      const size = convertToUnit(iconSize)
      const iconFallback = () => {
        if (shape === 'dot') {
          return c('div', {
            class: bem('icon', ['dot']),
          })
        }
        const icon = indeterminate ? Minus : Check
        return c(SmyIcon, {
          attrs: { name: icon },
          style: {},
        })
      }
      const custom = hasSlot(vm, 'icon')
      return c(
        'div',
        {
          ref: 'icon',
          class: bem('icon', { disabled, checked, indeterminate, [shape]: shape, custom }),
          style: { [`--${role}-size`]: size, [`--${role}-color`]: color },
        },
        [vm._t('icon', iconFallback, { checked })],
      )
    },
    renderLabel() {
      const vm = this
      const c = vm._self._c || vm.$createElement
      const childNodes = vm._t('default')
      if (childNodes) {
        return c('span', { class: vm.bem('label') }, childNodes)
      }
      return null
    },
  },
  render() {
    /**@type {import('vue').default} */
    const vm = this
    const _h = vm.$createElement
    const c = vm._self._c || _h
    const { role, bem, checked, renderIcon, renderLabel } = vm
    let { inline } = vm

    const children = [renderIcon()]
    const labelVnode = renderLabel()
    if (labelVnode) {
      children.push(labelVnode)
    } else if (!inline) {
      inline = true
    }

    return c(
      'div',
      {
        attrs: { role, 'aria-checked': checked },
        class: bem({ inline }),
        on: {
          click: vm.onClick,
        },
      },
      children,
    )
  },
}
