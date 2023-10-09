import { ExtractPropTypes, createNumericProp, createStringProp, elProp, numericProp } from '../_utils/vue/props'

type StickyPosition = 'top' | 'bottom'

export const props = {
  zIndex: numericProp,
  position: createStringProp<StickyPosition>('top'),
  container: elProp,
  offsetTop: createNumericProp(0),
  offsetBottom: createNumericProp(0),
}

export type StickyProp = ExtractPropTypes<typeof props>
