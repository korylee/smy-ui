import { PropType } from 'vue'
import { assign } from '../_utils/shared'
import { numericProp, truthProp, unknownProp } from '../_utils/vue/props'

export type CheckboxShape = 'square' | 'round' | 'plain'
export type CheckerShape = CheckboxShape
export type CheckerDirection = 'horizontal' | 'vertical'

export const checkerSharedProps = {
  disabled: Boolean,
  size: numericProp,
  value: unknownProp,
  color: String,
  checked: unknownProp,
  inline: Boolean,
  labelDisabled: Boolean,
}

export const checkerProps = assign({}, checkerSharedProps, {
  bem: {
    type: Function,
    required: true,
  },
  role: String,
  shape: String as PropType<CheckboxShape>,
  checked: Boolean,
  indeterminate: {
    type: Boolean as PropType<boolean | null>,
    defualt: null,
  },
  parent: Object,
  bindGroup: truthProp,
})

export const props = assign({}, checkerSharedProps, {
  checked: Boolean,
  shape: String as PropType<CheckboxShape>,
  bindGroup: truthProp,
  indeterminate: {
    type: Boolean as PropType<boolean | null>,
    defualt: null,
  },
})
