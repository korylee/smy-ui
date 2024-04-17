import { ExtractPropTypes, createContainProp, createNumericProp, numericProp, truthProp } from '../_utils/vue/props'

const TABS_TYPE = ['line'] as const

export const props = {
  type: createContainProp(TABS_TYPE),
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
  scrollThreshold: createNumericProp(5),
}

export type TabsProps = ExtractPropTypes<typeof props>
