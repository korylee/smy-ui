import { ExtractPropTypes, componentProp, createNumericProp, createStringProp, numericProp } from '../_utils/vue/props'

export const props = {
  name: componentProp,
  size: numericProp,
  color: String,
  tag: createStringProp('span'),
  namespace: createStringProp('smy-icon'),
  transition: createNumericProp(0),
}

export type IconProps = ExtractPropTypes<typeof props>
