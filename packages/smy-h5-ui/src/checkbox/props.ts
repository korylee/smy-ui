import { PropType } from 'vue'
import { assign } from '../_utils/shared'
import { numericProp, unknownProp } from '../_utils/vue/props'

export type CheckboxShape = 'square' | 'round' | 'plain'

export const checkerSharedProps = {
  name: unknownProp,
  disabled: Boolean,
  size: numericProp,
  value: unknownProp,
  color: String,
  checked: unknownProp,
  inline: Boolean,
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
})

export const props = assign({}, checkerSharedProps, {
  shape: String as PropType<CheckboxShape>,
  indeterminate: {
    type: Boolean as PropType<boolean | null>,
    defualt: null,
  },
})
