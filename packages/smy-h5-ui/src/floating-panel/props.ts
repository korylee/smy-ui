import { ExtractPropTypes, createArrayProp, createNumberProp, createNumericProp, truthProp } from '../_utils/vue/props'

export const props = {
  height: createNumericProp(0),
  anchors: createArrayProp<number>(),
  duration: createNumberProp(0.3),
  contentDraggable: truthProp,
  lockScroll: Boolean,
  safeAreaInsetBottom: truthProp,
}

export type FloatingPanelProps = ExtractPropTypes<typeof props>
