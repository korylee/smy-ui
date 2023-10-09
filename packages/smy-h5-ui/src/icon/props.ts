import {
  ExtractPropTypes,
  componentProp,
  createNumericProp,
  createStringProp,
  numericProp,
  truthProp,
} from '../_utils/vue/props'

export const props = {
  name: componentProp,
  size: numericProp,
  color: String,
  tag: createStringProp('span'),
  namespace: createStringProp('smy-icon'),
  transition: createNumericProp(0),
  iconfont: truthProp,
}

export type IconProps = ExtractPropTypes<typeof props>
