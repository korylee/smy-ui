import { checkerProps } from './props'
import SmyIcon from '../icon'
import Minus from '@smy-h5/icons/dist/es/Minus'
import { convertToUnit } from '@smy-h5/shared'
import { computed, defineComponent, h, ref, unref } from 'vue'

const DEFAULT_SHAPE = { radio: 'round', checkbox: 'square' }

export default defineComponent({
  name: 'InternalChecker',
  props: checkerProps,
  setup(props, { emit, slots }) {
    const iconRef = ref()
    const realDisabled = computed(() => {
      const { disabled, parent, bindGroup, role, checked } = props
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
    })

    function getParentProp(name) {
      const { parent, bindGroup } = props
      if (parent && bindGroup) {
        return parent[name]
      }
    }
    function onClick(event) {
      const { target } = event
      const iconClicked = unref(iconRef) === target || unref(iconRef)?.contains(target)
      if (!unref(realDisabled) && (iconClicked || !props.labelDisabled)) {
        emit('toggle')
      }
      emit('click', event)
    }
    return () => {
      const iconSize = props.size || getParentProp('size')
      const size = convertToUnit(iconSize)
      const color = props.color || getParentProp('color')
      const direction = getParentProp('direction')
      const disabled = unref(realDisabled)
      const { role, bem, checked, labelPosition } = props
      let { inline } = props

      const renderIcon = () => {
        const { indeterminate } = props
        let { icon } = props
        if (icon === false) {
          return null
        }
        if (!icon) {
          icon = indeterminate ? Minus : props.checkedIcon
        }

        const shape = props.shape || getParentProp('shape') || DEFAULT_SHAPE[role]
        const clazz = bem('icon-content')
        return (
          <div
            ref={iconRef}
            class={bem('icon', { disabled, checked, indeterminate, [shape]: shape, preset: props.preset })}
          >
            {slots.icon
              ? slots.icon({ checked, disabled })
              : shape === 'dot'
              ? h('div', { class: clazz })
              : h(SmyIcon, { attrs: { name: icon }, class: clazz })}
          </div>
        )
      }
      const renderLabel = () =>
        slots.default ? (
          <span class={bem('label', { disabled, [labelPosition]: labelPosition })}>
            {slots.default({ disabled, checked })}
          </span>
        ) : null

      const children = [renderIcon()]
      const labelVnode = renderLabel()
      if (labelVnode) {
        children[labelPosition === 'left' ? 'unshift' : 'push'](labelVnode)
      } else if (!inline) {
        inline = true
      }

      return h(
        'div',
        {
          attrs: { role, 'aria-checked': props.checked, tabindex: disabled ? undefined : 0 },
          class: props.bem({ inline, [direction]: direction, disabled, 'label-disabled': props.labelDisabled }),
          style: { [`--${role}-size`]: size, [`--${role}-color`]: color },
          on: { click: onClick },
        },
        children,
      )
    }
  },
})
