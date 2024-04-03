import { PropType } from 'vue'
import { assign } from '@smy-h5/shared'
import {
  ExtractPropTypes,
  componentProp,
  createComponentProp,
  createUnknownProp,
  numericProp,
  truthProp,
} from '../_utils/vue/props'
import { RadioShape } from '../radio/props'
// @ts-ignore
import Check from '@smy-h5/icons/dist/es/Check'

export type CheckboxShape = 'square' | 'round' | 'plain'

export type CheckerShape = CheckboxShape | RadioShape
export type CheckerDirection = 'horizontal' | 'vertical'

export const checkerSharedProps = {
  disabled: Boolean,
  size: numericProp,
  value: createUnknownProp(true),
  color: String,
  checked: Boolean,
  inline: Boolean,
  labelDisabled: Boolean,
  icon: componentProp,
  checkedIcon: createComponentProp(Check),
  preset: truthProp,
  bindGroup: truthProp,
}

export const checkerProps = assign({}, checkerSharedProps, {
  bem: {
    type: Function,
    required: true,
  },
  role: String,
  shape: String as PropType<CheckboxShape>,
  indeterminate: {
    type: Boolean as PropType<boolean | null>,
    defualt: null,
  },
  parent: Object,
})

export const props = assign({}, checkerSharedProps, {
  shape: String as PropType<CheckboxShape>,
  indeterminate: {
    type: Boolean as PropType<boolean | null>,
    defualt: null,
  },
})

export type CheckboxProps = ExtractPropTypes<typeof props>
