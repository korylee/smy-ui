import { checkerProps } from './props'
import SmyIcon from '../icon'
import Minus from '@smy-h5/icons/dist/es/Minus'
import { convertToUnit } from '../_utils/dom'

const DEFAULT_SHAPE = { radio: 'round', checkbox: 'square' }

export default {
  name: 'InternalChecker',
  props: checkerProps,
  computed: {
    _disabled(vm) {
      const { disabled, parent, bindGroup, role, getParentProp, checked } = vm
      if (parent && bindGroup) {
        const _disabled = getParentProp('disabled') || disabled
        if (role === 'checkbox') {
          const checkedCount = getParentProp('value').length
          const max = getParentProp('max')
          const overlimit = max && checkedCount >= +max
          return _disabled || (overlimit && !checked)
        }
        return _disabled
      }
      return disabled
    },
  },
  methods: {
    getParentProp(name) {
      const { parent, bindGroup } = this
      if (parent && bindGroup) {
        return parent[name]
      }
    },
    onClick(event) {
      const { _disabled: disabled, labelDisabled } = this
      const { target } = event
      const { icon } = this.$refs
      const iconClicked = icon === target || icon?.contains(target)
      if (!disabled && (iconClicked || !labelDisabled)) {
        this.$emit('toggle')
      }
      this.$emit('click', event)
    },
    renderIcon() {
      const vm = this
      const c = vm.$createElement
      const { indeterminate, bem, checked, role, _disabled: disabled, preset, checkedIcon } = vm
      let { icon } = vm
      if (icon === false) {
        return null
      }
      if (!icon) {
        icon = indeterminate ? Minus : checkedIcon
      }
      const iconSize = vm.size || vm.getParentProp('size')
      const size = convertToUnit(iconSize)
      const shape = vm.shape || vm.getParentProp('shape') || DEFAULT_SHAPE[role]
      const color = vm.color || vm.getParentProp('color')
      const clazz = bem('icon-content')
      const iconFallback = () => {
        if (shape === 'dot') {
          return c('div', { class: clazz })
        }
        return c(SmyIcon, { attrs: { name: icon }, class: clazz })
      }
      return c(
        'div',
        {
          ref: 'icon',
          class: bem('icon', { disabled, checked, indeterminate, [shape]: shape, preset }),
          style: { [`--${role}-size`]: size, [`--${role}-color`]: color },
        },
        [vm._t('icon', iconFallback, { checked })],
      )
    },
    renderLabel() {
      const vm = this
      const c = vm._self._c || vm.$createElement
      const { _disabled: disabled, checked } = vm
      const childNodes = vm._t('default', undefined, { disabled, checked })
      if (childNodes) {
        return c('span', { class: vm.bem('label', { disabled }) }, childNodes)
      }
      return null
    },
  },
  render() {
    /**@type {import('vue').default} */
    const vm = this
    const _h = vm.$createElement
    const c = vm._self._c || _h
    const { role, bem, checked, renderIcon, renderLabel, _disabled: disabled, labelDisabled } = vm
    let { inline } = vm

    const children = [renderIcon()]
    const labelVnode = renderLabel()
    if (labelVnode) {
      children.push(labelVnode)
    } else if (!inline) {
      inline = true
    }
    const direction = vm.getParentProp('direction')

    return c(
      'div',
      {
        attrs: { role, 'aria-checked': checked, tabindex: disabled ? undefined : 0 },
        class: bem({ inline, [direction]: direction, disabled, labelDisabled }),
        on: {
          click: vm.onClick,
        },
      },
      children,
    )
  },
}
