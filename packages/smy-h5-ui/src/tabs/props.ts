import { ExtractPropTypes, createNumericProp, numericProp, truthProp } from '../_utils/vue/props'

export const props = {
  color: String,
  sticky: Boolean,
  shrink: Boolean,
  animated: Boolean,
  ellipsis: truthProp,
  swipeable: Boolean,
  scrollspy: Boolean,
  lineWidth: numericProp,
  lineHeight: numericProp,
  background: String,
  active: createNumericProp(0),
  offsetTop: createNumericProp(0),
  duration: createNumericProp(300),
}

export type TabsProp = ExtractPropTypes<typeof props>
